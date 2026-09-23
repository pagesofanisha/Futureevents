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
import {
  initialBusinessData,
  initialContactData,
  initialReviewsData,
  initialAlbumsData,
  initialSettingsData,
  initialAuthData
} from "../config/defaultData";

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
    window.dispatchEvent(new CustomEvent("future_events_data_change", { detail: { key, value } }));
  } catch (err) {
    console.error("Local storage write error:", err);
  }
}

// -------------------------------------------------------------
// BUSINESS INFO
// -------------------------------------------------------------
export async function getBusinessInfo() {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "businesses", "future_events_chennai");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      // If not yet written to Firestore, seed it
      await setDoc(docRef, initialBusinessData);
      return initialBusinessData;
    } catch (err) {
      console.warn("Firestore read failed, using local:", err);
    }
  }
  return getLocalItem(STORAGE_KEYS.BUSINESS, initialBusinessData);
}

export async function updateBusinessInfo(data) {
  const updated = { ...data, updatedDate: new Date().toISOString() };
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "businesses", "future_events_chennai");
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.warn("Firestore update error:", err);
    }
  }
  setLocalItem(STORAGE_KEYS.BUSINESS, updated);
  return updated;
}

// -------------------------------------------------------------
// CONTACT INFO
// -------------------------------------------------------------
export async function getContactInfo() {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "contactInfo", "future_events_chennai");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      await setDoc(docRef, initialContactData);
      return initialContactData;
    } catch (err) {
      console.warn("Firestore read failed, using local:", err);
    }
  }
  return getLocalItem(STORAGE_KEYS.CONTACT, initialContactData);
}

export async function updateContactInfo(data) {
  const updated = { ...data, updatedDate: new Date().toISOString() };
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "contactInfo", "future_events_chennai");
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.warn("Firestore update error:", err);
    }
  }
  setLocalItem(STORAGE_KEYS.CONTACT, updated);
  return updated;
}

// -------------------------------------------------------------
// ALBUMS & PHOTOS
// -------------------------------------------------------------
export async function getAlbums() {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, "albums", "future_events_chennai", "items");
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
      // Seed Firestore with initial albums
      for (const alb of initialAlbumsData) {
        await setDoc(doc(db, "albums", "future_events_chennai", "items", alb.id), alb);
      }
      return initialAlbumsData;
    } catch (err) {
      console.warn("Firestore read failed, using local:", err);
    }
  }
  return getLocalItem(STORAGE_KEYS.ALBUMS, initialAlbumsData);
}

export async function createAlbum(albumData) {
  const albums = await getAlbums();
  const newAlbum = {
    id: `album-${Date.now()}`,
    name: albumData.name,
    category: albumData.category || "General",
    description: albumData.description || "",
    thumbnail: albumData.thumbnail || (albumData.photos?.[0]?.url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"),
    photoCount: albumData.photos?.length || 0,
    createdDate: new Date().toISOString().split("T")[0],
    photos: albumData.photos || []
  };

  const updatedAlbums = [newAlbum, ...albums];

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "albums", "future_events_chennai", "items", newAlbum.id), newAlbum);
    } catch (err) {
      console.warn("Firestore create album error:", err);
    }
  }
  setLocalItem(STORAGE_KEYS.ALBUMS, updatedAlbums);
  return newAlbum;
}

export async function updateAlbum(albumId, data) {
  const albums = await getAlbums();
  const updatedAlbums = albums.map(a => {
    if (a.id === albumId) {
      const updated = { ...a, ...data, updatedDate: new Date().toISOString() };
      if (data.photos) {
        updated.photoCount = data.photos.length;
        if (!updated.thumbnail && data.photos.length > 0) {
          updated.thumbnail = data.photos[0].url;
        }
      }
      return updated;
    }
    return a;
  });

  if (isFirebaseConfigured && db) {
    try {
      const found = updatedAlbums.find(a => a.id === albumId);
      if (found) {
        await setDoc(doc(db, "albums", "future_events_chennai", "items", albumId), found, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore update album error:", err);
    }
  }
  setLocalItem(STORAGE_KEYS.ALBUMS, updatedAlbums);
  return updatedAlbums;
}

export async function deleteAlbum(albumId) {
  const albums = await getAlbums();
  const updatedAlbums = albums.filter(a => a.id !== albumId);

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "albums", "future_events_chennai", "items", albumId));
    } catch (err) {
      console.warn("Firestore delete album error:", err);
    }
  }
  setLocalItem(STORAGE_KEYS.ALBUMS, updatedAlbums);
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
  const updatedData = {
    photos: newPhotos,
    photoCount: newPhotos.length,
    thumbnail: album.thumbnail || newPhoto.url
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

// -------------------------------------------------------------
// REVIEWS
// -------------------------------------------------------------
export async function getReviews() {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, "reviews", "future_events_chennai", "items");
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
      for (const rev of initialReviewsData) {
        await setDoc(doc(db, "reviews", "future_events_chennai", "items", rev.id), rev);
      }
      return initialReviewsData;
    } catch (err) {
      console.warn("Firestore read reviews failed, using local:", err);
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

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "reviews", "future_events_chennai", "items", newReview.id), newReview);
    } catch (err) {
      console.warn("Firestore add review error:", err);
    }
  }
  setLocalItem(STORAGE_KEYS.REVIEWS, updatedReviews);
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

  if (isFirebaseConfigured && db) {
    try {
      const found = updatedReviews.find(r => r.id === reviewId);
      if (found) {
        await setDoc(doc(db, "reviews", "future_events_chennai", "items", reviewId), found, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore update review error:", err);
    }
  }
  setLocalItem(STORAGE_KEYS.REVIEWS, updatedReviews);
  return updatedReviews;
}

export async function deleteReview(reviewId) {
  const reviews = await getReviews();
  const updatedReviews = reviews.filter(r => r.id !== reviewId);

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "reviews", "future_events_chennai", "items", reviewId));
    } catch (err) {
      console.warn("Firestore delete review error:", err);
    }
  }
  setLocalItem(STORAGE_KEYS.REVIEWS, updatedReviews);
  return updatedReviews;
}

// -------------------------------------------------------------
// SETTINGS
// -------------------------------------------------------------
export async function getSettings() {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "settings", "future_events_chennai");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      await setDoc(docRef, initialSettingsData);
      return initialSettingsData;
    } catch (err) {
      console.warn("Firestore settings read failed, using local:", err);
    }
  }
  return getLocalItem(STORAGE_KEYS.SETTINGS, initialSettingsData);
}

export async function updateSettings(data) {
  const updated = { ...data, updatedDate: new Date().toISOString() };
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "settings", "future_events_chennai");
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.warn("Firestore settings update error:", err);
    }
  }
  setLocalItem(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}

// -------------------------------------------------------------
// AUTH & PASSWORD MANAGEMENT
// -------------------------------------------------------------
export async function getAuthCredentials() {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "auth", "future_events_chennai");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      await setDoc(docRef, initialAuthData);
      return initialAuthData;
    } catch (err) {
      console.warn("Firestore auth read failed, using local:", err);
    }
  }
  return getLocalItem(STORAGE_KEYS.AUTH, initialAuthData);
}

export async function updateAdminPassword(newPassword) {
  const authData = await getAuthCredentials();
  const updated = {
    ...authData,
    adminPassword: newPassword,
    lastChanged: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "auth", "future_events_chennai");
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.warn("Firestore auth update error:", err);
    }
  }
  setLocalItem(STORAGE_KEYS.AUTH, updated);
  return true;
}
