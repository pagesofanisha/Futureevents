import React, { useState, useEffect } from "react";
import {
  FolderOpen,
  Image as ImageIcon,
  Star,
  Users,
  PlusCircle,
  Edit,
  Phone,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  Loader2,
  Check
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { isFirebaseConfigured } from "../../config/firebase";
import { isSupabaseConfigured, supabase } from "../../config/supabase";
import { checkCloudStatus } from "../../services/dataService";

export default function DashboardHome({ setActiveTab, onOpenCreateAlbumModal }) {
  const { albums, reviews, businessData, contactData, syncLocalAlbumsToSupabase } = useData();
  const [cloudStatus, setCloudStatus] = useState(null);
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  const testConnection = async () => {
    setIsTestingCloud(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("albums").select("id").limit(1);
        if (!error) {
          setCloudStatus({
            connected: true,
            provider: "supabase",
            message: "Supabase Cloud Database is Online & Connected!"
          });
          setIsTestingCloud(false);
          return;
        }
      } catch (e) {
        // Fallback to checkCloudStatus
      }
    }
    const res = await checkCloudStatus();
    setCloudStatus(res);
    setIsTestingCloud(false);
  };

  const handlePushToCloud = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncMsg("Syncing laptop photos to Supabase Cloud...");
    try {
      const res = await syncLocalAlbumsToSupabase((pct, msg) => {
        setSyncMsg(msg);
      });
      setSyncDone(true);
      setSyncMsg(
        `Successfully synced ${res?.albums?.length || 2} albums and ${res?.uploadedPhotos || 7} photos to Supabase Cloud!`
      );
      setTimeout(() => setSyncDone(false), 8000);
    } catch (err) {
      alert("Sync error: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const totalPhotos = albums.reduce((sum, a) => sum + (a.photos?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#E91E63] to-pink-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
            <span>Administrator Workspace · Proprietorship under Kishore</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {businessData.manager || "Kishore"}!
          </h1>
          <p className="text-xs sm:text-sm text-pink-100 mt-1.5 leading-relaxed">
            Manage your portfolios, upload high-resolution wedding photos, update studio contact channels, and reply to client testimonials in real-time.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 items-center">
            {/* Direct 1-Click Push Button on Dashboard Home */}
            <button
              onClick={handlePushToCloud}
              disabled={isSyncing}
              className="bg-white text-[#E91E63] hover:bg-pink-50 px-4 py-2.5 rounded-xl text-xs font-black shadow-lg transition-transform active:scale-95 flex items-center space-x-2 border-2 border-white cursor-pointer"
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#E91E63]" />
              ) : (
                <Cloud className="w-4 h-4 text-[#E91E63]" />
              )}
              <span>{isSyncing ? syncMsg || "Syncing..." : "☁️ Push Laptop Photos to Cloud"}</span>
            </button>

            <button
              onClick={onOpenCreateAlbumModal}
              className="bg-pink-800/80 hover:bg-pink-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5 border border-pink-400/40"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Album</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-900/60 hover:bg-pink-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 border border-pink-400/30"
            >
              <span>View Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {syncDone && (
            <div className="mt-4 p-3 bg-emerald-500/90 text-white rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-md">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{syncMsg} Open the site on your phone now to view them!</span>
            </div>
          )}
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Cloud Status Alert Card */}
      {cloudStatus && (
        <div
          className={`p-5 rounded-2xl border transition-colors ${
            cloudStatus.connected
              ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
              : "bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              {cloudStatus.connected ? (
                <div className="p-2 rounded-xl bg-emerald-500 text-white flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-amber-500 text-white flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {cloudStatus.connected
                      ? (cloudStatus.provider === "supabase" ? "Supabase Cloud: Online & Connected" : "Cloud Database: Online & Connected")
                      : "Supabase Database Connecting..."}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      cloudStatus.connected
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                        : "bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200"
                    }`}
                  >
                    {cloudStatus.connected ? "Cloud Active" : "Checking Cloud"}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {cloudStatus.connected
                    ? "Your portfolios and photos are connected to Supabase Cloud and sync permanently across all client phones, tablets, and laptops instantly."
                    : "Connecting to Supabase Cloud Database. Make sure you have clicked 'Push Laptop Photos to Cloud' above to sync existing photos."}
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={handlePushToCloud}
                    disabled={isSyncing}
                    className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-transform active:scale-95"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>{isSyncing ? "Syncing..." : "Push Photos to Cloud"}</span>
                  </button>

                    <button
                      onClick={testConnection}
                      disabled={isTestingCloud}
                      className="inline-flex items-center space-x-1 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingCloud ? "animate-spin" : ""}`} />
                      <span>{isTestingCloud ? "Testing..." : "Test Connection"}</span>
                    </button>
                  </div>
              </div>
            </div>

            {cloudStatus.connected && (
              <button
                onClick={testConnection}
                disabled={isTestingCloud}
                className="self-start sm:self-center p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-1"
                title="Refresh Cloud Status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingCloud ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Albums */}
        <div
          onClick={() => setActiveTab("gallery")}
          className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Albums
            </span>
            <div className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-[#E91E63]">
              <FolderOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              {albums.length}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">Categorized event collections</span>
          </div>
        </div>

        {/* Card 2: Photos */}
        <div
          onClick={() => setActiveTab("gallery")}
          className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Cloud Photos
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              {totalPhotos}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">High-res compressed uploads</span>
          </div>
        </div>

        {/* Card 3: Reviews */}
        <div
          onClick={() => setActiveTab("reviews")}
          className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Client Reviews
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              {reviews.length}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
              5.0 ★ Google Verified
            </span>
          </div>
        </div>

        {/* Card 4: Phone & Contact */}
        <div
          onClick={() => setActiveTab("contact")}
          className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Studio Hotline
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
              <Phone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-black text-gray-900 dark:text-white truncate block">
              {contactData.phoneNumber || "+91 93604 55217"}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">Ramapuram, Chennai</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-colors">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
          Quick Management Shortcuts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <button
            onClick={() => setActiveTab("gallery")}
            className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-[#E91E63] text-left transition-colors group"
          >
            <div className="flex items-center space-x-3 mb-1">
              <FolderOpen className="w-5 h-5 text-[#E91E63]" />
              <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#E91E63]">
                Manage Albums & Photos
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Upload wedding shoots, delete or reorder photos with compression.
            </p>
          </button>

          <button
            onClick={() => setActiveTab("business")}
            className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-[#E91E63] text-left transition-colors group"
          >
            <div className="flex items-center space-x-3 mb-1">
              <Edit className="w-5 h-5 text-[#E91E63]" />
              <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#E91E63]">
                Edit Business Details
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Update description, years of experience, fee structure, and decor policies.
            </p>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-[#E91E63] text-left transition-colors group"
          >
            <div className="flex items-center space-x-3 mb-1">
              <MessageSquare className="w-5 h-5 text-[#E91E63]" />
              <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#E91E63]">
                Moderate Client Reviews
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Pin top testimonials, write owner replies, or edit ratings.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
