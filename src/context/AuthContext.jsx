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

  // Method 2: Google Sign-In with Authorized Email Whitelist Verification
  const loginWithGoogle = async (enteredEmail = null) => {
    let emailToVerify = (enteredEmail || "").trim().toLowerCase();

    // If Firebase Auth is configured and no email was provided manually, launch real Google Popup
    if (!emailToVerify && isFirebaseConfigured && auth) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result && result.user && result.user.email) {
          emailToVerify = result.user.email.trim().toLowerCase();
        }
      } catch (err) {
        console.warn("Firebase Google popup error:", err);
        return {
          success: false,
          error: "Google sign-in popup cancelled or failed: " + (err.message || "Failed")
        };
      }
    }

    if (!emailToVerify) {
      return {
        success: false,
        error: "Please enter your Google account email to verify access."
      };
    }

    // Fetch allowed admin emails from backend database
    const creds = await getAuthCredentials();
    const allowed = (creds.allowedEmails || [
      "pagesofanisha@gmail.com",
      "futureeventskishore@gmail.com"
    ]).map((e) => e.trim().toLowerCase());

    if (!allowed.includes(emailToVerify)) {
      return {
        success: false,
        error: `Access Denied: "${emailToVerify}" is not an authorized administrator. Only whitelisted admin Google accounts configured in the backend can access this portal.`
      };
    }

    // Success! Authorized administrator
    const expiry = Date.now() + INACTIVITY_TIMEOUT_MS;
    localStorage.setItem("future_events_admin_token", "google_oauth_" + Date.now());
    localStorage.setItem("future_events_admin_expiry", expiry.toString());
    const user = {
      name: emailToVerify.split("@")[0].replace(/[._-]/g, " "),
      email: emailToVerify,
      role: "Owner / Administrator",
      loginMethod: "google",
      verified: true
    };
    localStorage.setItem("future_events_admin_user", JSON.stringify(user));
    setIsAdminLoggedIn(true);
    setAdminUser(user);
    return { success: true, user };
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
