import React, { useState, useEffect } from "react";
import {
  Database,
  HardDrive,
  Image as ImageIcon,
  Copy,
  Check,
  Download,
  ExternalLink,
  Shield,
  Layers,
  FileText,
  Cloud,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { getAllDatabaseData } from "../../services/dataService";
import { isFirebaseConfigured } from "../../config/firebase";

export default function DatabaseManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("photos"); // "photos" | "json" | "cloud"
  const [selectedCollection, setSelectedCollection] = useState("albums");
  const [copiedId, setCopiedId] = useState(null);
  const [jsonCopied, setJsonCopied] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const fullData = await getAllDatabaseData();
      setData(fullData);
    } catch (err) {
      console.error("Failed to load database data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyJSON = (obj) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const handleDownloadBackup = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `future-events-database-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading || !data) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-zinc-800">
        <RefreshCw className="w-8 h-8 text-[#E91E63] animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          Loading live database storage records...
        </p>
      </div>
    );
  }

  // Flatten all photos across all albums
  const allStoredPhotos = (data.albums || []).flatMap((alb) =>
    (alb.photos || []).map((p) => ({
      ...p,
      albumName: alb.name,
      albumCategory: alb.category,
      albumId: alb.id
    }))
  );

  return (
    <div className="space-y-6">
      {/* 1. Database & Cloud Storage Overview Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-[#E91E63] flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Database & Cloud Storage Center
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Live & Persistent
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Inspect all photos, albums, customer reviews, and database documents stored in the system.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleDownloadBackup}
              className="bg-[#E91E63] hover:bg-[#D81B60] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center space-x-1.5 transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup (.json)</span>
            </button>
          </div>
        </div>

        {/* 4 Storage Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-gray-400 block mb-1">
              Active Storage Engine
            </span>
            <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center space-x-1.5">
              <HardDrive className="w-3.5 h-3.5 text-[#E91E63]" />
              <span className="truncate">
                {isFirebaseConfigured ? "Firebase Cloud" : "Local Browser DB"}
              </span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-gray-400 block mb-1">
              Total Event Albums
            </span>
            <span className="text-base font-black text-gray-900 dark:text-white">
              {(data.albums || []).length} Albums
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-gray-400 block mb-1">
              Total Stored Photos
            </span>
            <span className="text-base font-black text-[#E91E63]">
              {allStoredPhotos.length} Images
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-gray-400 block mb-1">
              Total Customer Reviews
            </span>
            <span className="text-base font-black text-gray-900 dark:text-white">
              {(data.reviews || []).length} Reviews
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-zinc-800 space-x-4 px-2">
        <button
          onClick={() => setActiveTab("photos")}
          className={`pb-3 text-xs font-bold transition-colors flex items-center space-x-2 border-b-2 ${
            activeTab === "photos"
              ? "border-[#E91E63] text-[#E91E63]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Stored Photos & Media ({allStoredPhotos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("json")}
          className={`pb-3 text-xs font-bold transition-colors flex items-center space-x-2 border-b-2 ${
            activeTab === "json"
              ? "border-[#E91E63] text-[#E91E63]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>JSON Collections Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab("cloud")}
          className={`pb-3 text-xs font-bold transition-colors flex items-center space-x-2 border-b-2 ${
            activeTab === "cloud"
              ? "border-[#E91E63] text-[#E91E63]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Database Architecture & Firebase Setup</span>
        </button>
      </div>

      {/* TAB 1: STORED PHOTOS & MEDIA */}
      {activeTab === "photos" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                All Photos Stored in Database
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Every photo uploaded or registered in albums with its direct URL and album association.
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-400">
              Showing {allStoredPhotos.length} items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allStoredPhotos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                className="group rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden bg-gray-50 dark:bg-zinc-800/40 flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.caption || "Event Photo"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded font-medium">
                      {photo.albumCategory}
                    </span>
                  </div>
                </div>

                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-gray-900 dark:text-white line-clamp-1">
                      {photo.albumName}
                    </span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                      {photo.caption || `Photo ID: ${photo.id}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-zinc-700/60">
                    <button
                      onClick={() => handleCopy(photo.url, photo.id || idx)}
                      className="text-[11px] text-[#E91E63] hover:text-[#D81B60] font-semibold flex items-center space-x-1"
                    >
                      {copiedId === (photo.id || idx) ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <a
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center space-x-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: JSON COLLECTIONS EXPLORER */}
      {activeTab === "json" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
            {/* Collection Selectors */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "albums", label: "Albums & Photos" },
                { id: "reviews", label: "Client Reviews" },
                { id: "business", label: "Business Profile" },
                { id: "contact", label: "Studio Contacts" },
                { id: "auth", label: "Auth & Whitelist" },
                { id: "settings", label: "Settings" }
              ].map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedCollection === col.id
                      ? "bg-[#E91E63] text-white"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleCopyJSON(data[selectedCollection])}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center space-x-1.5"
            >
              {jsonCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">JSON Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Collection JSON</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-gray-900 text-pink-400 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed border border-zinc-800">
              <code>{JSON.stringify(data[selectedCollection], null, 2)}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: ARCHITECTURE & FIREBASE SETUP */}
      {activeTab === "cloud" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Where is the Database & Cloud Storage Stored?
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Complete architectural explanation of data persistence, photo storage, and Google Firebase integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Current Active Database */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800 space-y-3">
              <div className="flex items-center space-x-2 text-gray-900 dark:text-white font-bold text-sm">
                <HardDrive className="w-4 h-4 text-[#E91E63]" />
                <span>1. Current Database Engine</span>
              </div>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2 leading-relaxed">
                <li>
                  • <strong>Browser Persistent Database (LocalStorage):</strong> Keyed under <code className="bg-white dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">future_events_albums_data</code>, <code className="bg-white dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">future_events_auth_data</code>, and <code className="bg-white dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">future_events_reviews_data</code>.
                </li>
                <li>
                  • <strong>How to see in Browser DevTools:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-zinc-700 text-[10px]">F12</kbd> → Click <strong>Application</strong> tab → Click <strong>Local Storage</strong> → Select <code className="text-[#E91E63]">https://future-events-kishore.vercel.app</code>.
                </li>
                <li>
                  • <strong>Photo Storage:</strong> High-definition event photos are served directly via Cloud Content Delivery Networks (Unsplash/Cloudinary) and in-memory WebP Base64 compression.
                </li>
              </ul>
            </div>

            {/* Box 2: Google Firebase Cloud Integration */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800 space-y-3">
              <div className="flex items-center space-x-2 text-gray-900 dark:text-white font-bold text-sm">
                <Cloud className="w-4 h-4 text-[#E91E63]" />
                <span>2. Connecting Google Firebase Cloud</span>
              </div>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2 leading-relaxed">
                <li>
                  • The entire codebase is pre-configured with Google Cloud Firestore and Google Firebase Storage in <code className="bg-white dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px]">src/config/firebase.js</code>.
                </li>
                <li>
                  • <strong>To view photos directly in Google Firebase Console:</strong>
                  <ol className="list-decimal pl-4 mt-1 space-y-1">
                    <li>Create a project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-[#E91E63] underline">console.firebase.google.com</a>.</li>
                    <li>Click <strong>Firestore Database</strong> → Create database.</li>
                    <li>Click <strong>Storage</strong> → Enable Cloud Storage bucket.</li>
                    <li>Add the API keys into your Vercel Environment variables or <code className="text-[11px]">.env</code> file.</li>
                  </ol>
                </li>
                <li>
                  • Once connected, all photos upload straight into Firebase Storage bucket (<code className="text-[11px]">gs://...</code>) and documents sync to Firestore live.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
