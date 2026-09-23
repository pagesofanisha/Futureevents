import React, { useState } from "react";
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
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";

export default function SettingsManager() {
  const { changePassword } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { settings, updateSettings } = useData();

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
      </div>
    </div>
  );
}
