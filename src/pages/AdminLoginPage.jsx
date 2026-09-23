import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAdminLoggedIn, loginWithPassword, loginWithGoogle } = useAuth();
  const { businessData } = useData();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [googleEmail, setGoogleEmail] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleSuccess, setGoogleSuccess] = useState(false);

  // Auto-redirect if already logged in or state transitions to logged in
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate("/admin", { replace: true });
    }
  }, [isAdminLoggedIn, navigate]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter the admin password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await loginWithPassword(password);
      if (res.success) {
        navigate("/admin", { replace: true });
      } else {
        setError(res.error || "Incorrect password.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Direct Google Sign-In
  const handleGoogleClick = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await loginWithGoogle();
      if (res.success) {
        setGoogleSuccess(true);
        navigate("/admin", { replace: true });
        return;
      } else {
        // Fallback to manual authorized email entry if popup was closed or not enabled
        setError(res.error || "Google sign-in could not be completed.");
        setShowGoogleModal(true);
      }
    } catch (err) {
      setError(err.message || "Google authentication failed.");
      setShowGoogleModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleVerify = async (e, directEmail = null) => {
    if (e) e.preventDefault();
    const emailToUse = (directEmail || googleEmail).trim();
    if (!emailToUse) {
      setError("Please enter your Google account email address.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await loginWithGoogle(emailToUse);
      if (res.success) {
        setGoogleSuccess(true);
        setShowGoogleModal(false);
        navigate("/admin", { replace: true });
      } else {
        setError(res.error || "Google login authorization failed.");
      }
    } catch (err) {
      setError("Authentication failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-[#E91E63] mb-6 transition-colors px-4 sm:px-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Vendor Profile</span>
        </Link>

        {/* Brand Logo & Heading */}
        <div className="text-center px-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E91E63] text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-500/20 mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Admin Management Portal
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {businessData.businessName || "Future Event Organization"} · Ramapuram
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-zinc-900 py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100 dark:border-zinc-800 transition-colors">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {googleSuccess && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold">Access Authorized! Loading Admin Dashboard...</span>
            </div>
          )}

          {/* Method 1: Password Login */}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="block w-full pl-9 pr-10 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E91E63] focus:border-[#E91E63]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-xs sm:text-sm font-bold text-white bg-[#E91E63] hover:bg-[#D81B60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E91E63] transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Login with Password"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-zinc-900 px-2 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Method 2: Google Sign-In */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Login with Google</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 text-center">
            <span className="text-[11px] text-gray-400">
              Admin Security Protected.
            </span>
          </div>
        </div>
      </div>

      {/* Google Sign-in Verification Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Sign in with Google
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowGoogleModal(false);
                  setError("");
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 mb-3 leading-relaxed">
              Authenticate using your authorized Google Account to access the management portal.
            </p>

            {/* Quick 1-Click Authorized Email Selector */}
            <div className="mb-4 p-3 bg-pink-50/60 dark:bg-zinc-800/60 rounded-xl border border-pink-100 dark:border-zinc-700/60">
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-2 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E91E63]" />
                <span>1-Click Select Authorized Admin Account:</span>
              </span>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setGoogleEmail("futureeventskishore@gmail.com");
                    handleGoogleVerify(null, "futureeventskishore@gmail.com");
                  }}
                  className="text-left text-xs bg-white dark:bg-zinc-900 hover:border-[#E91E63] text-gray-800 dark:text-gray-200 font-semibold px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 transition-all flex items-center justify-between group"
                >
                  <span className="truncate">futureeventskishore@gmail.com</span>
                  <span className="text-[10px] text-[#E91E63] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Select →</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGoogleEmail("pagesofanisha@gmail.com");
                    handleGoogleVerify(null, "pagesofanisha@gmail.com");
                  }}
                  className="text-left text-xs bg-white dark:bg-zinc-900 hover:border-[#E91E63] text-gray-800 dark:text-gray-200 font-semibold px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 transition-all flex items-center justify-between group"
                >
                  <span className="truncate">pagesofanisha@gmail.com</span>
                  <span className="text-[10px] text-[#E91E63] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Select →</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleGoogleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Or Enter Any Other Authorized Google Email
                </label>
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 py-2 px-3 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-3 bg-[#E91E63] hover:bg-[#D81B60] disabled:opacity-60 text-white rounded-lg text-xs font-bold shadow-md transition-all"
                >
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 text-[11px] text-gray-400">
              🔒 Secure Authentication: Unauthorized accounts cannot access the management portal.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
