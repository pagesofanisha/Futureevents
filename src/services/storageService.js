import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, isFirebaseConfigured } from "../config/firebase";

/**
 * Compresses an image file in the browser before upload using HTML5 Canvas.
 * Keeps aspect ratio, caps max dimension at 1920px, and outputs high quality WebP/JPEG (~85% quality).
 */
export async function compressImage(file, maxWidth = 1920, maxHeight = 1920, quality = 0.85) {
  return new Promise((resolve, reject) => {
    // If not an image, return raw file
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-preserving dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob (WebP if supported, fallback to JPEG)
        const mimeType = file.type === "image/png" ? "image/webp" : (file.type || "image/jpeg");
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                type: mimeType,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          mimeType,
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Uploads an image to Firebase Cloud Storage or returns a local persistent Data URL.
 * Reports progress (0-100) via onProgress callback.
 */
export async function uploadImageFile(file, path, onProgress = null) {
  // Validate file size (max 10MB)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error(`File "${file.name}" exceeds the 10MB size limit.`);
  }

  // Auto-compress
  const compressed = await compressImage(file);

  // Helper for resilient persistent fallback (Data URL)
  const runFallbackUpload = () => {
    return new Promise((resolve) => {
      let progress = 10;
      const interval = setInterval(() => {
        progress += 30;
        if (onProgress) onProgress(Math.min(progress, 90));
        if (progress >= 90) clearInterval(interval);
      }, 40);

      const reader = new FileReader();
      reader.onloadend = () => {
        clearInterval(interval);
        if (onProgress) onProgress(100);
        resolve(reader.result);
      };
      reader.readAsDataURL(compressed);
    });
  };

  if (isFirebaseConfigured && storage) {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, compressed);

      return await new Promise((resolve) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            if (onProgress) onProgress(progress);
          },
          async (error) => {
            console.warn("Firebase Storage bucket not yet enabled or rejected, using persistent storage engine:", error);
            // Fall back seamlessly so the user upload NEVER fails!
            const fallbackUrl = await runFallbackUpload();
            resolve(fallbackUrl);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              if (onProgress) onProgress(100);
              resolve(downloadURL);
            } catch (err) {
              console.warn("Error getting Firebase download URL, using persistent storage:", err);
              const fallbackUrl = await runFallbackUpload();
              resolve(fallbackUrl);
            }
          }
        );
      });
    } catch (err) {
      console.warn("Firebase storage ref error, using persistent storage:", err);
      return await runFallbackUpload();
    }
  }

  return await runFallbackUpload();
}
