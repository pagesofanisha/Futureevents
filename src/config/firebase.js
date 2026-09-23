import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAprTUvKxuYRfQhLKbJgqS0LtdbsDL0UPA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "future-events-kishore.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "future-events-kishore",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "future-events-kishore.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "638394322374",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:638394322374:web:e3fdee2721281d39bbb6c7"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== "your_api_key_here"
);

let app = null;
let db = null;
let storage = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    console.log("🔥 Connected to live Firebase Firestore & Storage!");
  } catch (error) {
    console.warn("Firebase initialization failed, falling back to local persistent engine:", error);
  }
} else {
  console.info("⚡ Running in local persistence sandbox (Pre-seeded with Kishore's business data). Connect Firebase credentials in .env whenever ready for permanent cloud hosting.");
}

export { app, db, storage, auth };
