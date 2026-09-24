import React, { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Moon,
  Sun,
  Bell,
  Sliders,
  ShieldCheck,
  Mail,
  Cloud,
  Database
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import {
  saveSupabaseConfig,
  getActiveSupabaseConfig,
  isSupabaseConfigured
} from "../../config/supabase";

export default function SettingsManager() {
  const { changePassword, getAllowedEmails, saveAllowedEmails } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { settings, updateSettings } = useData();

  // Allowed Google Emails State (Whitelist)
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [email3, setEmail3] = useState("");
  const [emailsSuccess, setEmailsSuccess] = useState(false);
  const [emailsError, setEmailsError] = useState("");
  const [isSavingEmails, setIsSavingEmails] = useState(false);

  useEffect(() => {
    async function loadEmails() {
      if (getAllowedEmails) {
        const emails = await getAllowedEmails();
        if (emails && emails.length > 0) {
          setEmail1(emails[0] || "");
          setEmail2(emails[1] || "");
          setEmail3(emails[2] || "");
        }
      }
    }
    loadEmails();
  }, []);

  const handleSaveEmails = async (e) => {
    e.preventDefault();
    setIsSavingEmails(true);
    setEmailsError("");
    setEmailsSuccess(false);

    try {
      const emailList = [email1, email2, email3].filter((e) => e && e.trim().length > 0);
      if (emailList.length === 0) {
        setEmailsError("At least one authorized Google email must be configured.");
        setIsSavingEmails(false);
        return;
      }
      await saveAllowedEmails(emailList);
      setEmailsSuccess(true);
      setTimeout(() => setEmailsSuccess(false), 4000);
    } catch (err) {
      setEmailsError("Failed to save authorized emails: " + err.message);
    } finally {
      setIsSavingEmails(false);
    }
  };

  // Password fields state (all hidden with dots/asterisks by default)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Settings State
  const [imagesPerPage, setImagesPerPage] = useState(settings.imagesPerPage || 8);
  const [inquiryNotifications, setInquiryNotifications] = useState(settings.inquiryNotifications ?? true);
  const [reviewNotifications, setReviewNotifications] = useState(settings.emailNotifications ?? true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Supabase Cloud Storage & Database State
  const activeSupabase = getActiveSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(activeSupabase.url || "");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [supabaseBucket, setSupabaseBucket] = useState(activeSupabase.bucket || "future-events");
  const [supabaseSaved, setSupabaseSaved] = useState(false);
  const [supabaseError, setSupabaseError] = useState("");

  const handleSaveSupabase = (e) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setSupabaseError("Please enter both Supabase Project URL and Anon API Key.");
      return;
    }
    saveSupabaseConfig(supabaseUrl, supabaseKey, supabaseBucket);
    setSupabaseSaved(true);
    setSupabaseError("");
    setTimeout(() => {
      setSupabaseSaved(false);
      window.location.reload();
    }, 1200);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError("");

    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 4000);
      } else {
        setPasswordError(res.error || "Password update failed.");
      }
    } catch (err) {
      setPasswordError("Failed to update password: " + err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSaveSettings = async () => {
    await updateSettings({
      imagesPerPage: Number(imagesPerPage),
      inquiryNotifications,
      emailNotifications: reviewNotifications
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 0. Authorized Admin Emails (Google Login Whitelist) */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="flex items-center space-x-2.5 pb-4 mb-4 border-b border-gray-100 dark:border-zinc-800">
          <Mail className="w-5 h-5 text-[#E91E63]" />
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Authorized Admin Google Accounts (Whitelist Security)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Only up to 3 authorized Google emails entered here can log in via &quot;Login with Google&quot;. You can set your developer email now, and update it to the client&apos;s email upon handover.
            </p>
          </div>
        </div>

        {emailsSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Authorized admin emails saved permanently to backend database!</span>
          </div>
        )}

        {emailsError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{emailsError}</span>
          </div>
        )}

        <form onSubmit={handleSaveEmails} className="space-y-4 max-w-lg text-xs">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Primary Admin Email <span className="text-[#E91E63]">*</span>
              <span className="text-[11px] text-gray-400 ml-1.5 font-normal">(Developer / Current Admin)</span>
            </label>
            <input
              type="email"
              required
              value={email1}
              onChange={(e) => setEmail1(e.target.value)}
              placeholder="e.g. pagesofanisha@gmail.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Secondary Admin Email <span className="text-gray-400 font-normal">(Optional)</span>
              <span className="text-[11px] text-gray-400 ml-1.5 font-normal">(Kishore / Client account)</span>
            </label>
            <input
              type="email"
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
              placeholder="e.g. futureeventskishore@gmail.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Backup / Third Admin Email <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              value={email3}
              onChange={(e) => setEmail3(e.target.value)}
              placeholder="e.g. backup-admin@gmail.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={isSavingEmails}
              className="bg-[#E91E63] hover:bg-[#D81B60] disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-transform active:scale-95 text-xs"
            >
              {isSavingEmails ? "Saving to Backend..." : "Save Authorized Admin Emails"}
            </button>
          </div>
        </form>
      </div>

      {/* 1. Change Backend Password Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="flex items-center space-x-2.5 pb-4 mb-4 border-b border-gray-100 dark:border-zinc-800">
          <Lock className="w-5 h-5 text-[#E91E63]" />
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Change Backend Password
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              The updated password is saved permanently to cloud Firestore and required for all subsequent logins.
            </p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Password updated permanently in database!</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md text-xs">
          {/* Current Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Current Password <span className="text-[#E91E63]">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              New Password <span className="text-[#E91E63]">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Confirm New Password <span className="text-[#E91E63]">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="bg-[#E91E63] hover:bg-[#D81B60] disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-transform active:scale-95 text-xs"
          >
            {isUpdatingPassword ? "Updating..." : "Update Password Permanently"}
          </button>
        </form>
      </div>

      {/* 2. Gallery & Display Preferences */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="flex items-center space-x-2.5 pb-4 mb-4 border-b border-gray-100 dark:border-zinc-800">
          <Sliders className="w-5 h-5 text-[#E91E63]" />
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Gallery & Display Preferences
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Configure initial photos loaded before the "View More" button appears.
            </p>
          </div>
        </div>

        <div className="max-w-md space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Initial Images Per Page (Configurable 5 - 10)
            </label>
            <select
              value={imagesPerPage}
              onChange={(e) => setImagesPerPage(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none"
            >
              {[5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} Images Initially
                </option>
              ))}
            </select>
          </div>

          {/* Theme Mode Preference */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-zinc-800">
            <div>
              <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                Dashboard Theme Mode
              </span>
              <span className="text-gray-400 text-[11px]">
                Currently: {isDarkMode ? "Dark Theme" : "Light Theme"}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-yellow-300" /> : <Moon className="w-4 h-4" />}
              <span>Toggle Mode</span>
            </button>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <span className="font-semibold text-gray-800 dark:text-gray-200 block">
              Admin Notifications
            </span>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inquiryNotifications}
                onChange={(e) => setInquiryNotifications(e.target.checked)}
                className="w-4 h-4 accent-[#E91E63] rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Send WhatsApp / Email notification on new customer inquiries
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={reviewNotifications}
                onChange={(e) => setReviewNotifications(e.target.checked)}
                className="w-4 h-4 accent-[#E91E63] rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Notify admin when customer posts a new review
              </span>
            </label>
          </div>

          {settingsSaved && (
            <div className="p-2 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences saved!</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="bg-[#E91E63] hover:bg-[#D81B60] text-white font-bold px-5 py-2 rounded-xl text-xs shadow-sm transition-transform active:scale-95"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* 4. SUPABASE CLOUD CONNECTION */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-[#E91E63]">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Supabase Cloud (Storage & Database)
                </h3>
                <p className="text-xs text-gray-500">
                  Store photos & videos permanently in Supabase Cloud Bucket
                </p>
              </div>
            </div>

            {isSupabaseConfigured ? (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 px-2.5 py-1 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Connected</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 px-2.5 py-1 rounded-full flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Needs Credentials</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSupabase} className="space-y-3.5 text-xs max-w-lg">
            {supabaseError && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{supabaseError}</span>
              </div>
            )}

            {supabaseSaved && (
              <div className="p-2.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Supabase credentials saved successfully! Reloading...</span>
              </div>
            )}

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Supabase Project URL <span className="text-[#E91E63]">*</span>
              </label>
              <input
                type="url"
                required
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                Found in your Supabase project dashboard under Project Settings &gt; API
              </span>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Supabase Anon Public API Key <span className="text-[#E91E63]">*</span>
              </label>
              <input
                type="password"
                required
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                Your anon / public key (safe for client application access)
              </span>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Storage Bucket Name
              </label>
              <input
                type="text"
                value={supabaseBucket}
                onChange={(e) => setSupabaseBucket(e.target.value)}
                placeholder="future-events"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                Default: <strong>future-events</strong> (public bucket for photos & videos)
              </span>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="bg-[#E91E63] hover:bg-[#D81B60] text-white font-bold px-5 py-2 rounded-xl text-xs shadow-sm transition-transform active:scale-95"
              >
                Save Supabase Credentials
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
