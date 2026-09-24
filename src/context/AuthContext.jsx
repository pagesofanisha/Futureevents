import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { getAuthCredentials, updateAdminPassword, updateAllowedEmails } from "../services/dataService";
import { auth } from "../config/firebase";

const AuthContext = createContext();

// Session timeout: 30 minutes of inactivity
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      const token = localStorage.getItem("future_events_admin_token");
      const expiry = localStorage.getItem("future_events_admin_expiry");
      // STRICT: Only genuine password-authenticated tokens are valid
      if (token && token.startsWith("admin_authenticated_") && expiry && Number(expiry) > Date.now()) {
        return true;
      }
      // Purge any old google tokens or expired sessions
      localStorage.removeItem("future_events_admin_token");
      localStorage.removeItem("future_events_admin_expiry");
      localStorage.removeItem("future_events_admin_user");
      return false;
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const token = localStorage.getItem("future_events_admin_token");
      if (!token || !token.startsWith("admin_authenticated_")) {
        return null;
      }
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

  // Clean up any lingering Firebase Auth sessions on mount
  useEffect(() => {
    if (auth) {
      try {
        auth.signOut();
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  // Strict Password-Only Login
  const loginWithPassword = async (enteredPassword) => {
    if (!enteredPassword || !enteredPassword.trim()) {
      return { success: false, error: "Please enter the admin password." };
    }

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

  const logout = () => {
    localStorage.removeItem("future_events_admin_token");
    localStorage.removeItem("future_events_admin_expiry");
    localStorage.removeItem("future_events_admin_user");
    if (auth) {
      try {
        auth.signOut();
      } catch (e) {
        // Ignore
      }
    }
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
