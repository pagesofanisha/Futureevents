import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAdminLoggedIn, loginWithPassword } = useAuth();
  const { businessData } = useData();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ensure password input is completely empty on mount
  useEffect(() => {
    setPassword("");
  }, []);

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

          {/* Method 1: Password Login */}
          <form onSubmit={handlePasswordSubmit} autoComplete="off" className="space-y-4">
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
                  name="admin_security_key"
                  id="admin_security_key"
                  autoComplete="new-password"
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

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 text-center">
            <span className="text-[11px] text-gray-400">
              Admin Security Protected · Password Authentication Only.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
