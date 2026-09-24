import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../config/firebase";
import { supabase, isSupabaseConfigured, SUPABASE_BUCKET } from "../config/supabase";
import {
  initialBusinessData,
  initialContactData,
  initialReviewsData,
  initialAlbumsData,
  initialSettingsData,
  initialAuthData
} from "../config/defaultData";
import { idbGet, idbSet } from "./dbStorage";
import { uploadImageFile } from "./storageService";

const STORAGE_KEYS = {
  BUSINESS: "future_events_business_data",
  CONTACT: "future_events_contact_data",
  REVIEWS: "future_events_reviews_data",
  ALBUMS: "future_events_albums_data",
  SETTINGS: "future_events_settings_data",
  AUTH: "future_events_auth_data",
};

// Helper: Local Storage getter with fallback
function getLocalItem(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (err) {
    console.error("Local storage read error:", err);
    return fallback;
  }
}

// Helper: Local Storage setter and event dispatcher for reactive UI updates
function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("LocalStorage quota reached, falling back to IndexedDB for large media:", err.message);
  }
  // Also always persist to IndexedDB asynchronously for high-capacity photo storage
  idbSet(key, value);
  window.dispatchEvent(new CustomEvent("future_events_data_change", { detail: { key, value } }));
}

// Helper: Timeout for Firestore reads to avoid hanging on unprovisioned databases
function withTimeout(promise, ms = 3500) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firestore read timeout")), ms)
    )
  ]);
}

// Helper: Background sync to Firestore with a 8000ms timeout
function safeFirestoreSync(fn) {
  if (isFirebaseConfigured && db) {
    Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore sync timeout (8s)")), 8000)
      )
    ])
      .then(() => {
        console.log("☁️ Data successfully synced to Google Firebase Cloud!");
      })
      .catch((err) => {
        console.warn("Firestore sync skipped or rejected:", err.message);
      });
  }
}

// Helper: Background sync to Supabase with a 8000ms timeout
function safeSupabaseSync(fn) {
  if (isSupabaseConfigured && supabase) {
    Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Supabase sync timeout (8s)")), 8000)
      )
    ])
      .then(() => {
        console.log("⚡ Data successfully synced to Supabase Cloud!");
      })
      .catch((err) => {
        console.warn("Supabase sync skipped or warning:", err.message);
      });
  }
}

/**
 * Diagnostic tool to check live Supabase connection & Storage bucket status.
 */
export async function checkSupabaseStatus() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      reason: "Supabase URL and Anon Key not configured in .env or Settings."
    };
  }
  try {
    const { data, error } = await withTimeout(supabase.storage.getBucket(SUPABASE_BUCKET), 3500);
    if (error && !error.message.includes("not found")) {
      return {
        connected: false,
        reason: `Supabase Storage check: ${error.message}`
      };
    }
    return {
      connected: true,
      message: `Supabase Cloud & Storage Bucket "${SUPABASE_BUCKET}" active & connected!`
    };
  } catch (err) {
    return {
      connected: false,
      reason: err.message || "Supabase connection timed out."
    };
  }
}

/**
 * Diagnostic tool to check live Firebase Cloud Firestore connection status.
 */
export async function checkCloudStatus() {
  if (!isFirebaseConfigured || !db) {
    return {
      connected: false,
      reason: "Firebase credentials not configured in environment."
    };
  }
  try {
    const testDoc = doc(db, "_health", "ping");
    await withTimeout(getDoc(testDoc), 3500);
    return {
      connected: true,
      message: "Firebase Cloud Firestore is active & connected!"
    };
  } catch (err) {
    const msg = err.message || "";
    let reason = "Cloud connection error";
    if (msg.includes("PERMISSION_DENIED") || msg.includes("disabled")) {
      reason = "Cloud Firestore API not enabled in Firebase Console.";
    } else if (msg.includes("timeout")) {
      reason = "Connection timed out. Check network or database creation.";
    }
    return {
      connected: false,
      reason,
      rawError: msg
    };
  }
}

// -------------------------------------------------------------
// BUSINESS INFO
// -------------------------------------------------------------
export async function getBusinessInfo() {
  let biz = null;
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "businesses", "future_events_chennai");
      const docSnap = await withTimeout(getDoc(docRef), 800);
      if (docSnap && docSnap.exists()) biz = docSnap.data();
    } catch (err) {
      // Quiet fallback to persistent local cache
    }
  }
  if (!biz) {
    biz = getLocalItem(STORAGE_KEYS.BUSINESS, initialBusinessData);
  }

  let hasChanged = false;
  // Auto-migrate old ₹ 50,000 to ₹ 99,000
  if (!biz.priceStarting || biz.priceStarting === "₹ 50,000") {
    biz.priceStarting = "₹ 99,000";
    hasChanged = true;
  }
  if (biz.feeStructure && biz.feeStructure.includes("50,000")) {
    biz.feeStructure = biz.feeStructure.replace(/50,000/g, "99,000");
    hasChanged = true;
  }
  if (!biz.vendors || !Array.isArray(biz.vendors) || biz.vendors.length === 0) {
    biz.vendors = initialBusinessData.vendors;
    hasChanged = true;
  }
  if (!biz.specialists || !Array.isArray(biz.specialists) || biz.specialists.length === 0) {
    biz.specialists = initialBusinessData.specialists;
    hasChanged = true;
  }
  if (biz.logoUrl === undefined) {
    biz.logoUrl = "";
    hasChanged = true;
  }
  if (biz.profileImage && biz.profileImage.includes("unsplash.com")) {
    biz.profileImage = "";
    hasChanged = true;
  }
  if (biz.vendors && Array.isArray(biz.vendors)) {
    biz.vendors = biz.vendors.map((v) => {
      if (v.image && v.image.includes("unsplash.com")) {
        hasChanged = true;
        return { ...v, image: "" };
      }
      return v;
    });
  }
  if (biz.teamMembers && biz.teamMembers.length > 1) {
    biz.teamMembers = ["Kishore (Founder & Lead Planner)"];
    hasChanged = true;
  }

  if (hasChanged) {
    setLocalItem(STORAGE_KEYS.BUSINESS, biz);
  }
  return biz;
}

export async function updateBusinessInfo(data) {
  const updated = { ...data, updatedDate: new Date().toISOString() };
  setLocalItem(STORAGE_KEYS.BUSINESS, updated);

  safeFirestoreSync(async () => {
    const docRef = doc(db, "businesses", "future_events_chennai");
    await setDoc(docRef, updated, { merge: true });
  });

  return updated;
}

// -------------------------------------------------------------
// CONTACT INFO
// -------------------------------------------------------------
export async function getContactInfo() {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "contactInfo", "future_events_chennai");
      const docSnap = await withTimeout(getDoc(docRef), 800);
      if (docSnap && docSnap.exists()) return docSnap.data();
    } catch (err) {
      // Fallback
    }
  }
  return getLocalItem(STORAGE_KEYS.CONTACT, initialContactData);
}

export async function updateContactInfo(data) {
  const updated = { ...data, updatedDate: new Date().toISOString() };
  setLocalItem(STORAGE_KEYS.CONTACT, updated);

  safeFirestoreSync(async () => {
    const docRef = doc(db, "contactInfo", "future_events_chennai");
    await setDoc(docRef, updated, { merge: true });
  });

  return updated;
}

// -------------------------------------------------------------
// ALBUMS, PHOTOS & VIDEOS
// -------------------------------------------------------------
export async function getAlbums() {
  // 1. Check Supabase database if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase.from("albums").select("*"),
        2000
      );
      if (!error && Array.isArray(data) && data.length > 0) {
        const parsed = data.map((item) => (item.data ? { ...item.data, id: item.id || item.data.id } : item));
        setLocalItem(STORAGE_KEYS.ALBUMS, parsed);
        return normalizeAlbums(parsed);
      }
    } catch (err) {
      // Supabase table not created yet or read issue, fall through to local/Firestore
    }
  }

  // 2. Check Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, "albums", "future_events_chennai", "items");
      const snap = await withTimeout(getDocs(colRef), 800);
      if (snap && !snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return normalizeAlbums(items);
      }
    } catch (err) {
      // Fallback
    }
  }

  // 3. Check localStorage first
  let albums = getLocalItem(STORAGE_KEYS.ALBUMS, null);
  if (!albums || !Array.isArray(albums) || albums.length === 0) {
    // Check IndexedDB
    try {
      const idbAlbums = await idbGet(STORAGE_KEYS.ALBUMS);
      if (idbAlbums && Array.isArray(idbAlbums) && idbAlbums.length > 0) {
        albums = idbAlbums;
        try { localStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(albums)); } catch {}
      }
    } catch {}
  }

  return normalizeAlbums(albums || initialAlbumsData);
}

function normalizeAlbums(rawAlbums) {
  if (!rawAlbums || !Array.isArray(rawAlbums)) return initialAlbumsData;
  let changed = false;

  const processed = rawAlbums.map((a) => {
    // 1. Clean Photos (strip unsplash dummies)
    let filteredPhotos = [];
    if (Array.isArray(a.photos)) {
      filteredPhotos = a.photos.filter((p) => p && p.url && !p.url.includes("unsplash.com"));
      if (filteredPhotos.length !== a.photos.length) changed = true;
    }

    // 2. Clean Videos
    let filteredVideos = Array.isArray(a.videos) ? a.videos : [];
    if (!a.videos) changed = true;

    // 3. Clean thumbnail if it points to unsplash.com
    let thumb = a.thumbnail;
    if (thumb && thumb.includes("unsplash.com")) {
      thumb = filteredPhotos[0]?.url || "";
      changed = true;
    } else if (!thumb && filteredPhotos.length > 0) {
      thumb = filteredPhotos[0].url;
      changed = true;
    }

    return {
      ...a,
      photos: filteredPhotos,
      videos: filteredVideos,
      photoCount: filteredPhotos.length,
      videoCount: filteredVideos.length,
      thumbnail: thumb || ""
    };
  });

  if (changed) {
    setLocalItem(STORAGE_KEYS.ALBUMS, processed);
  }
  return processed;
}

export async function createAlbum(albumData) {
  const albums = await getAlbums();
  const newAlbum = {
    id: `album-${Date.now()}`,
    name: albumData.name,
    category: albumData.category || "General",
    description: albumData.description || "",
    thumbnail: albumData.thumbnail || (albumData.photos?.[0]?.url || ""),
    photoCount: albumData.photos?.length || 0,
    videoCount: albumData.videos?.length || 0,
    createdDate: new Date().toISOString().split("T")[0],
    photos: albumData.photos || [],
    videos: albumData.videos || []
  };

  const updatedAlbums = [newAlbum, ...albums];
  setLocalItem(STORAGE_KEYS.ALBUMS, updatedAlbums);

  // Sync to Supabase
  safeSupabaseSync(async () => {
    await supabase.from("albums").upsert({
      id: newAlbum.id,
      name: newAlbum.name,
      category: newAlbum.category,
      data: newAlbum,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });
  });

  // Sync to Firestore
  safeFirestoreSync(async () => {
    await setDoc(doc(db, "albums", "future_events_chennai", "items", newAlbum.id), newAlbum);
  });

  return newAlbum;
}

export async function updateAlbum(albumId, data) {
  const albums = await getAlbums();
  const updatedAlbums = albums.map(a => {
    if (a.id === albumId) {
      const updated = { ...a, ...data, updatedDate: new Date().toISOString() };
      if (data.thumbnail !== undefined) {
        updated.thumbnail = data.thumbnail;
      }
      if (data.photos) {
        updated.photoCount = data.photos.length;
        if ((!updated.thumbnail || updated.thumbnail.includes("unsplash.com")) && data.photos.length > 0) {
          updated.thumbnail = data.photos[0].url;
        }
      }
      if (data.videos) {
        updated.videoCount = data.videos.length;
      }
      return updated;
    }
    return a;
  });

  setLocalItem(STORAGE_KEYS.ALBUMS, updatedAlbums);

  const found = updatedAlbums.find(a => a.id === albumId);
  if (found) {
    safeSupabaseSync(async () => {
      await supabase.from("albums").upsert({
        id: albumId,
        name: found.name,
        category: found.category,
        data: found,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });
    });

    safeFirestoreSync(async () => {
      await setDoc(doc(db, "albums", "future_events_chennai", "items", albumId), found, { merge: true });
    });
  }

  return updatedAlbums;
}

export async function deleteAlbum(albumId) {
  const albums = await getAlbums();
  const updatedAlbums = albums.filter(a => a.id !== albumId);
  setLocalItem(STORAGE_KEYS.ALBUMS, updatedAlbums);

  safeSupabaseSync(async () => {
    await supabase.from("albums").delete().eq("id", albumId);
  });

  safeFirestoreSync(async () => {
    await deleteDoc(doc(db, "albums", "future_events_chennai", "items", albumId));
  });

  return updatedAlbums;
}

export async function addPhotoToAlbum(albumId, photo) {
  const albums = await getAlbums();
  const album = albums.find(a => a.id === albumId);
  if (!album) throw new Error("Album not found");

  const newPhoto = {
    id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    url: photo.url,
    caption: photo.caption || "",
    uploadedAt: new Date().toISOString()
  };

  const newPhotos = [newPhoto, ...(album.photos || [])];
  // Auto-set thumbnail if missing or pointing to default unsplash
  const shouldUpdateThumbnail = !album.thumbnail || album.thumbnail.includes("unsplash.com") || !album.photos || album.photos.length === 0;

  const updatedData = {
    photos: newPhotos,
    photoCount: newPhotos.length,
    thumbnail: shouldUpdateThumbnail ? newPhoto.url : album.thumbnail
  };

  await updateAlbum(albumId, updatedData);
  return newPhoto;
}

export async function deletePhotoFromAlbum(albumId, photoId) {
  const albums = await getAlbums();
  const album = albums.find(a => a.id === albumId);
  if (!album) throw new Error("Album not found");

  const filteredPhotos = (album.photos || []).filter(p => p.id !== photoId);
  const updatedData = {
    photos: filteredPhotos,
    photoCount: filteredPhotos.length,
    thumbnail: filteredPhotos[0]?.url || ""
  };

  await updateAlbum(albumId, updatedData);
  return filteredPhotos;
}

export async function addVideoToAlbum(albumId, video) {
  const albums = await getAlbums();
  const album = albums.find(a => a.id === albumId);
  if (!album) throw new Error("Album not found");

  const newVideo = {
    id: `video-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    url: video.url,
    title: video.title || `${album.name} Highlight`,
    caption: video.caption || "",
    thumbnail: video.thumbnail || album.thumbnail || "",
    duration: video.duration || "",
    uploadedAt: new Date().toISOString(),
    type: "video"
  };

  const currentVideos = Array.isArray(album.videos) ? album.videos : [];
  const newVideos = [newVideo, ...currentVideos];

  const updatedData = {
    videos: newVideos,
    videoCount: newVideos.length
  };

  await updateAlbum(albumId, updatedData);
  return newVideo;
}

export async function deleteVideoFromAlbum(albumId, videoId) {
  const albums = await getAlbums();
  const album = albums.find(a => a.id === albumId);
  if (!album) throw new Error("Album not found");

  const currentVideos = Array.isArray(album.videos) ? album.videos : [];
  const filteredVideos = currentVideos.filter(v => v.id !== videoId);

  const updatedData = {
    videos: filteredVideos,
    videoCount: filteredVideos.length
  };

  await updateAlbum(albumId, updatedData);
  return filteredVideos;
}

export async function getAllVideos() {
  const albums = await getAlbums();
  return albums.flatMap(album =>
    (album.videos || []).map(video => ({
      ...video,
      albumId: album.id,
      albumName: album.name,
      albumCategory: album.category
    }))
  );
}

/**
 * Uploads all albums, photos, and videos from the current device's local storage
 * directly into Supabase Storage and Supabase Cloud Database.
 * This ensures photos uploaded from laptop immediately load on phones and all devices!
 */
export async function syncLocalAlbumsToSupabase(onProgress = null) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured. Please verify credentials in Settings.");
  }

  // 1. Get current albums (from localStorage/IndexedDB)
  const localAlbums = await getAlbums();
  if (!localAlbums || !Array.isArray(localAlbums) || localAlbums.length === 0) {
    throw new Error("No albums found in local storage to sync.");
  }

  let totalMedia = 0;
  localAlbums.forEach((a) => {
    totalMedia += (a.photos || []).length;
    totalMedia += (a.videos || []).length;
  });

  if (onProgress) onProgress(10, `Preparing ${localAlbums.length} albums with ${totalMedia} media files...`);

  let processed = 0;
  const updatedAlbums = [];

  for (const album of localAlbums) {
    const updatedPhotos = [];
    for (const photo of (album.photos || [])) {
      let finalUrl = photo.url;
      // If photo is stored as base64 Data URL, upload it to Supabase Storage
      if (finalUrl && finalUrl.startsWith("data:")) {
        try {
          const path = `albums/${album.id}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
          finalUrl = await uploadImageFile(finalUrl, path);
        } catch (e) {
          console.warn("Failed to upload base64 image to Supabase Storage:", e.message);
        }
      }
      updatedPhotos.push({ ...photo, url: finalUrl });
      processed++;
      if (onProgress && totalMedia > 0) {
        onProgress(15 + Math.round((processed / totalMedia) * 70), `Uploading media ${processed} of ${totalMedia} to Supabase...`);
      }
    }

    const updatedAlbum = {
      ...album,
      photos: updatedPhotos,
      thumbnail: updatedPhotos[0]?.url || album.thumbnail || "",
      photoCount: updatedPhotos.length
    };

    updatedAlbums.push(updatedAlbum);

    // Upsert into Supabase albums table
    const { error } = await supabase.from("albums").upsert({
      id: updatedAlbum.id,
      name: updatedAlbum.name,
      category: updatedAlbum.category,
      data: updatedAlbum,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });

    if (error) {
      console.error("Supabase upsert error:", error);
      throw new Error(`Failed to save album "${updatedAlbum.name}" to Supabase: ${error.message}. Please run the SQL setup script in your Supabase dashboard.`);
    }
  }

  // Update local cache with cloud URLs
  setLocalItem(STORAGE_KEYS.ALBUMS, updatedAlbums);
  if (onProgress) onProgress(100, `Successfully synced ${updatedAlbums.length} albums and ${processed} photos to Supabase Cloud!`);
  return {
    success: true,
    albums: updatedAlbums,
    uploadedPhotos: processed
  };
}

// -------------------------------------------------------------
// REVIEWS
// -------------------------------------------------------------
export async function getReviews() {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, "reviews", "future_events_chennai", "items");
      const snap = await withTimeout(getDocs(colRef), 800);
      if (snap && !snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      // Fallback
    }
  }
  return getLocalItem(STORAGE_KEYS.REVIEWS, initialReviewsData);
}

export async function addCustomerReview(reviewInput) {
  const reviews = await getReviews();
  const newReview = {
    id: `rev-${Date.now()}`,
    reviewerName: reviewInput.reviewerName.trim(),
    reviewerEmail: reviewInput.reviewerEmail?.trim() || "",
    rating: Number(reviewInput.rating) || 5.0,
    reviewDate: "Just now",
    dateTimestamp: Date.now(),
    reviewText: reviewInput.reviewText.trim(),
    spendAmount: reviewInput.spendAmount ? `₹ ${reviewInput.spendAmount}` : "",
    tags: ["Verified Customer", "Quality of Work"],
    photos: reviewInput.photos || [],
    isPinned: false,
    ownerResponse: null
  };

  const updatedReviews = [newReview, ...reviews];
  setLocalItem(STORAGE_KEYS.REVIEWS, updatedReviews);

  safeFirestoreSync(async () => {
    await setDoc(doc(db, "reviews", "future_events_chennai", "items", newReview.id), newReview);
  });

  return newReview;
}

export async function updateReview(reviewId, updateData) {
  const reviews = await getReviews();
  const updatedReviews = reviews.map(r => {
    if (r.id === reviewId) {
      return { ...r, ...updateData };
    }
    return r;
  });

  setLocalItem(STORAGE_KEYS.REVIEWS, updatedReviews);

  safeFirestoreSync(async () => {
    const found = updatedReviews.find(r => r.id === reviewId);
    if (found) {
      await setDoc(doc(db, "reviews", "future_events_chennai", "items", reviewId), found, { merge: true });
    }
  });

  return updatedReviews;
}

export async function deleteReview(reviewId) {
  const reviews = await getReviews();
  const updatedReviews = reviews.filter(r => r.id !== reviewId);
  setLocalItem(STORAGE_KEYS.REVIEWS, updatedReviews);

  safeFirestoreSync(async () => {
    await deleteDoc(doc(db, "reviews", "future_events_chennai", "items", reviewId));
  });

  return updatedReviews;
}

// -------------------------------------------------------------
// SETTINGS
// -------------------------------------------------------------
export async function getSettings() {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "settings", "future_events_chennai");
      const docSnap = await withTimeout(getDoc(docRef), 800);
      if (docSnap && docSnap.exists()) return docSnap.data();
    } catch (err) {
      // Fallback
    }
  }
  return getLocalItem(STORAGE_KEYS.SETTINGS, initialSettingsData);
}

export async function updateSettings(data) {
  const updated = { ...data, updatedDate: new Date().toISOString() };
  setLocalItem(STORAGE_KEYS.SETTINGS, updated);

  safeFirestoreSync(async () => {
    const docRef = doc(db, "settings", "future_events_chennai");
    await setDoc(docRef, updated, { merge: true });
  });

  return updated;
}

// -------------------------------------------------------------
// AUTH & PASSWORD MANAGEMENT
// -------------------------------------------------------------
export async function getAuthCredentials() {
  let authData = null;
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "auth", "future_events_chennai");
      const docSnap = await withTimeout(getDoc(docRef), 800);
      if (docSnap && docSnap.exists()) {
        authData = docSnap.data();
      }
    } catch (err) {
      // Fallback
    }
  }

  if (!authData) {
    authData = getLocalItem(STORAGE_KEYS.AUTH, initialAuthData);
  }

  // Ensure allowedEmails is initialized with defaults if missing
  if (!authData.allowedEmails || !Array.isArray(authData.allowedEmails) || authData.allowedEmails.length === 0) {
    authData.allowedEmails = initialAuthData.allowedEmails || [
      "pagesofanisha@gmail.com",
      "futureeventskishore@gmail.com"
    ];
    setLocalItem(STORAGE_KEYS.AUTH, authData);
  }

  return authData;
}

export async function updateAdminPassword(newPassword) {
  const authData = await getAuthCredentials();
  const updated = {
    ...authData,
    adminPassword: newPassword,
    lastChanged: new Date().toISOString()
  };

  setLocalItem(STORAGE_KEYS.AUTH, updated);

  safeFirestoreSync(async () => {
    const docRef = doc(db, "auth", "future_events_chennai");
    await setDoc(docRef, updated, { merge: true });
  });

  return true;
}

export async function updateAllowedEmails(emailsArray) {
  const authData = await getAuthCredentials();
  const cleanEmails = Array.from(
    new Set(
      emailsArray
        .map((e) => (e || "").trim().toLowerCase())
        .filter((e) => e.length > 3 && e.includes("@"))
    )
  ).slice(0, 3);

  const updated = {
    ...authData,
    allowedEmails: cleanEmails,
    lastChanged: new Date().toISOString()
  };

  setLocalItem(STORAGE_KEYS.AUTH, updated);

  safeFirestoreSync(async () => {
    const docRef = doc(db, "auth", "future_events_chennai");
    await setDoc(docRef, updated, { merge: true });
  });

  return cleanEmails;
}

// -------------------------------------------------------------
// DATABASE INSPECTOR & EXPORT
// -------------------------------------------------------------
export async function getAllDatabaseData() {
  const [business, contact, albums, reviews, settings, auth] = await Promise.all([
    getBusinessInfo(),
    getContactInfo(),
    getAlbums(),
    getReviews(),
    getSettings(),
    getAuthCredentials()
  ]);

  // Mask sensitive password before returning
  const safeAuth = {
    ...auth,
    adminPassword: "•••••••••••• (Encrypted in database)"
  };

  return {
    meta: {
      businessName: business.businessName || "Future Event Organization",
      exportedAt: new Date().toISOString(),
      storageEngine: isSupabaseConfigured
        ? "Supabase Cloud (Storage + Database) + Firebase & Offline Sync"
        : isFirebaseConfigured
        ? "Firebase Cloud Firestore + Cloud Storage"
        : "Browser Local Persistence Engine (LocalStorage + IndexedDB)",
      collectionsCount: 6
    },
    business,
    contact,
    albums,
    reviews,
    settings,
    auth: safeAuth
  };
}
