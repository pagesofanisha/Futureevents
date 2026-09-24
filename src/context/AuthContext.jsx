import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { getAuthCredentials, updateAdminPassword, updateAllowedEmails } from "../services/dataService";
import { auth, isFirebaseConfigured } from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const AuthContext = createContext();

// Session timeout: 30 minutes of inactivity
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      const token = localStorage.getItem("future_events_admin_token");
      const expiry = localStorage.getItem("future_events_admin_expiry");
      if (token && expiry && Number(expiry) > Date.now()) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("future_events_admin_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const lastActivityRef = useRef(Date.now());

  // Inactivity tracking
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      localStorage.setItem("future_events_admin_expiry", (Date.now() + INACTIVITY_TIMEOUT_MS).toString());
    };

    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > INACTIVITY_TIMEOUT_MS) {
        console.warn("Session expired due to 30 minutes of inactivity.");
        logout();
      }
    }, 15000);

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [isAdminLoggedIn]);

  // Firebase Auth State Listener: Auto-detect Google sign-in and authorize automatically
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    try {
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser && firebaseUser.email) {
          const email = firebaseUser.email.trim().toLowerCase();
          const creds = await getAuthCredentials();
          const defaultAllowed = ["pagesofanisha@gmail.com", "futureeventskishore@gmail.com"];
          const customAllowed = Array.isArray(creds?.allowedEmails) ? creds.allowedEmails : [];
          const allowed = Array.from(new Set([...defaultAllowed, ...customAllowed])).map((e) => e.trim().toLowerCase());

          if (allowed.includes(email)) {
            const expiry = Date.now() + INACTIVITY_TIMEOUT_MS;
            localStorage.setItem("future_events_admin_token", "google_oauth_" + Date.now());
            localStorage.setItem("future_events_admin_expiry", expiry.toString());
            const user = {
              name: firebaseUser.displayName || email.split("@")[0].replace(/[._-]/g, " "),
              email: email,
              role: "Owner / Administrator",
              loginMethod: "google",
              verified: true
            };
            localStorage.setItem("future_events_admin_user", JSON.stringify(user));
            setIsAdminLoggedIn(true);
            setAdminUser(user);
          } else {
            // Unauthorized Google account detected - force sign-out immediately
            try {
              await auth.signOut();
            } catch (e) {
              // Ignore
            }
            localStorage.removeItem("future_events_admin_token");
            localStorage.removeItem("future_events_admin_expiry");
            localStorage.removeItem("future_events_admin_user");
            setIsAdminLoggedIn(false);
            setAdminUser(null);
          }
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("onAuthStateChanged setup warning:", err);
    }
  }, []);

  // Method 1: Password Login
  const loginWithPassword = async (enteredPassword) => {
    const creds = await getAuthCredentials();
    const correctPassword = creds.adminPassword || "Futureeventskishore2026";

    if (enteredPassword.trim() === correctPassword.trim()) {
      const expiry = Date.now() + INACTIVITY_TIMEOUT_MS;
      localStorage.setItem("future_events_admin_token", "admin_authenticated_" + Date.now());
      localStorage.setItem("future_events_admin_expiry", expiry.toString());
      const user = { name: "Kishore", role: "Administrator", loginMethod: "password" };
      localStorage.setItem("future_events_admin_user", JSON.stringify(user));
      setIsAdminLoggedIn(true);
      setAdminUser(user);
      return { success: true };
    } else {
      return { success: false, error: "Incorrect password. Please verify and try again." };
    }
  };

  // Method 2: Google Sign-In with Strict Whitelist Verification
  // The email MUST come directly from Google OAuth authentication.
  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      return {
        success: false,
        error: "Google Authentication is not configured in Firebase Console."
      };
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);

      if (!result || !result.user || !result.user.email) {
        return {
          success: false,
          error: "Could not retrieve account details from Google. Please try again."
        };
      }

      const emailToVerify = result.user.email.trim().toLowerCase();

      // Fetch allowed admin emails from database
      const creds = await getAuthCredentials();
      const defaultAllowed = ["pagesofanisha@gmail.com", "futureeventskishore@gmail.com"];
      const customAllowed = Array.isArray(creds?.allowedEmails) ? creds.allowedEmails : [];
      const allowed = Array.from(new Set([...defaultAllowed, ...customAllowed])).map((e) => e.trim().toLowerCase());

      // STRICT VERIFICATION: If the selected Google email is not in the whitelist, reject & kick out immediately!
      if (!allowed.includes(emailToVerify)) {
        try {
          await auth.signOut();
        } catch (e) {
          // Ignore
        }
        localStorage.removeItem("future_events_admin_token");
        localStorage.removeItem("future_events_admin_expiry");
        localStorage.removeItem("future_events_admin_user");
        setIsAdminLoggedIn(false);
        setAdminUser(null);

        return {
          success: false,
          error: `Access Denied: "${emailToVerify}" is not an authorized administrator. Only registered owner accounts (such as Kishore) can access this workspace.`
        };
      }

      // Success! Verified authorized administrator
      const expiry = Date.now() + INACTIVITY_TIMEOUT_MS;
      localStorage.setItem("future_events_admin_token", "google_oauth_" + Date.now());
      localStorage.setItem("future_events_admin_expiry", expiry.toString());
      const user = {
        name: result.user.displayName || emailToVerify.split("@")[0].replace(/[._-]/g, " "),
        email: emailToVerify,
        role: "Owner / Administrator",
        loginMethod: "google",
        verified: true
      };
      localStorage.setItem("future_events_admin_user", JSON.stringify(user));
      setIsAdminLoggedIn(true);
      setAdminUser(user);
      return { success: true, user };
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        return { success: false, error: "Google sign-in popup was closed before completing." };
      }
      return {
        success: false,
        error: "Google sign-in failed: " + (err.message || "Unknown error")
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("future_events_admin_token");
    localStorage.removeItem("future_events_admin_expiry");
    localStorage.removeItem("future_events_admin_user");
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    const creds = await getAuthCredentials();
    const correctPassword = creds.adminPassword || "Futureeventskishore2026";

    if (currentPassword !== correctPassword) {
      return { success: false, error: "Current password does not match our records." };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }

    await updateAdminPassword(newPassword);
    return { success: true };
  };

  const getAllowedEmails = async () => {
    const creds = await getAuthCredentials();
    return creds.allowedEmails || ["pagesofanisha@gmail.com", "futureeventskishore@gmail.com"];
  };

  const saveAllowedEmails = async (emails) => {
    return await updateAllowedEmails(emails);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn,
        adminUser,
        loginWithPassword,
        loginWithGoogle,
        logout,
        changePassword,
        getAllowedEmails,
        saveAllowedEmails
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
