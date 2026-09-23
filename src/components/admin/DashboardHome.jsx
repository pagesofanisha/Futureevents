import React from "react";
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
  Cloud
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { isFirebaseConfigured } from "../../config/firebase";

export default function DashboardHome({ setActiveTab, onOpenCreateAlbumModal }) {
  const { albums, reviews, businessData, contactData } = useData();

  const totalPhotos = albums.reduce((sum, a) => sum + (a.photos?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#E91E63] to-pink-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
            <span>Administrator Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {businessData.manager || "Kishore"}!
          </h1>
          <p className="text-xs sm:text-sm text-pink-100 mt-1.5 leading-relaxed">
            Manage your portfolios, upload high-resolution wedding photos, update studio contact channels, and reply to client testimonials in real-time.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onOpenCreateAlbumModal}
              className="bg-white text-[#E91E63] hover:bg-pink-50 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Album</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-800/60 hover:bg-pink-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 border border-pink-400/40"
            >
              <span>View Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Cloud Status Alert */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center justify-between text-xs transition-colors">
        <div className="flex items-center space-x-2.5">
          <Cloud className={`w-4 h-4 ${isFirebaseConfigured ? "text-emerald-500" : "text-amber-500"}`} />
          <div>
            <span className="font-bold text-gray-900 dark:text-white">
              {isFirebaseConfigured ? "Firebase Cloud Live Sync: Active" : "Dual-Engine Local Persistence: Active"}
            </span>
            <p className="text-gray-500">
              {isFirebaseConfigured
                ? "Changes immediately save to your Firebase Firestore & Storage."
                : "Changes immediately persist locally with instant UI sync. Add Firebase credentials in .env whenever you wish to sync to your cloud project."}
            </p>
          </div>
        </div>
      </div>

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
