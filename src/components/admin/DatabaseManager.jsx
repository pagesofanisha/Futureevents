import React, { useState, useEffect } from "react";
import {
  Database,
  HardDrive,
  Image as ImageIcon,
  Video,
  Copy,
  Check,
  Download,
  ExternalLink,
  Shield,
  Layers,
  FileText,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Code
} from "lucide-react";
import { getAllDatabaseData } from "../../services/dataService";
import { isFirebaseConfigured } from "../../config/firebase";
import { isSupabaseConfigured, SUPABASE_BUCKET, SUPABASE_URL } from "../../config/supabase";

export default function DatabaseManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("photos"); // "photos" | "videos" | "json" | "supabase"
  const [selectedCollection, setSelectedCollection] = useState("albums");
  const [copiedId, setCopiedId] = useState(null);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

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

  const handleCopySQL = (sqlText) => {
    navigator.clipboard.writeText(sqlText);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
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

  // Flatten all videos across all albums
  const allStoredVideos = (data.albums || []).flatMap((alb) =>
    (alb.videos || []).map((v) => ({
      ...v,
      albumName: alb.name,
      albumCategory: alb.category,
      albumId: alb.id
    }))
  );

  const supabaseSqlSchema = `-- 1. Create albums table in Supabase
CREATE TABLE IF NOT EXISTS public.albums (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Allow public access to albums table
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Albums" ON public.albums;
CREATE POLICY "Public Read Albums"
  ON public.albums FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public Insert/Update Albums" ON public.albums;
CREATE POLICY "Public Insert/Update Albums"
  ON public.albums FOR ALL
  USING (true);

-- 3. Create Public Storage Bucket for Photos and Videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('${SUPABASE_BUCKET || "future-events"}', '${SUPABASE_BUCKET || "future-events"}', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Enable public read/write access to storage objects
DROP POLICY IF EXISTS "Public Storage Select" ON storage.objects;
CREATE POLICY "Public Storage Select"
  ON storage.objects FOR SELECT
  USING (bucket_id = '${SUPABASE_BUCKET || "future-events"}');

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = '${SUPABASE_BUCKET || "future-events"}');

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
CREATE POLICY "Public Storage Update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = '${SUPABASE_BUCKET || "future-events"}');

DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
CREATE POLICY "Public Storage Delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = '${SUPABASE_BUCKET || "future-events"}');`;

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
                Inspect all photos, videos, albums, and cloud database documents in the system.
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

        {/* 5 Storage Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-gray-400 block mb-1">
              Active Storage
            </span>
            <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center space-x-1.5">
              <Cloud className="w-3.5 h-3.5 text-[#E91E63]" />
              <span className="truncate">
                {isSupabaseConfigured
                  ? "Supabase Cloud"
                  : isFirebaseConfigured
                  ? "Firebase Cloud"
                  : "Local Browser Engine"}
              </span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-gray-400 block mb-1">
              Event Albums
            </span>
            <span className="text-base font-black text-gray-900 dark:text-white">
              {(data.albums || []).length} Albums
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-gray-400 block mb-1">
              Stored Photos
            </span>
            <span className="text-base font-black text-[#E91E63]">
              {allStoredPhotos.length} Images
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-gray-400 block mb-1">
              Stored Videos
            </span>
            <span className="text-base font-black text-[#E91E63]">
              {allStoredVideos.length} Videos
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-gray-400 block mb-1">
              Client Reviews
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
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === "photos"
              ? "border-[#E91E63] text-[#E91E63]"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Stored Photos ({allStoredPhotos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === "videos"
              ? "border-[#E91E63] text-[#E91E63]"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Stored Videos ({allStoredVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("json")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === "json"
              ? "border-[#E91E63] text-[#E91E63]"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>JSON Collections</span>
        </button>

        <button
          onClick={() => setActiveTab("supabase")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === "supabase"
              ? "border-[#E91E63] text-[#E91E63]"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Supabase SQL Setup</span>
        </button>
      </div>

      {/* TAB 1: STORED PHOTOS EXPLORER */}
      {activeTab === "photos" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Permanent Photos Index ({allStoredPhotos.length})
            </h3>
            <span className="text-xs text-gray-400">
              Photos uploaded via backend are permanently saved
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {allStoredPhotos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                className="rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/40 flex flex-col group"
              >
                <div className="relative aspect-square w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-gray-900 dark:text-white line-clamp-1">
                      {photo.albumName}
                    </span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                      {photo.caption || `Photo ID: ${photo.id}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-200 dark:border-zinc-700/60">
                    <button
                      onClick={() => handleCopy(photo.url, photo.id || idx)}
                      className="text-[11px] text-[#E91E63] hover:text-[#D81B60] font-semibold flex items-center space-x-1"
                    >
                      {copiedId === (photo.id || idx) ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
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

      {/* TAB 2: STORED VIDEOS EXPLORER */}
      {activeTab === "videos" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Permanent Videos Index ({allStoredVideos.length})
            </h3>
            <span className="text-xs text-gray-400">
              Stored in Supabase Cloud Bucket "{SUPABASE_BUCKET}"
            </span>
          </div>

          {allStoredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {allStoredVideos.map((video, idx) => (
                <div
                  key={video.id || idx}
                  className="rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/40 flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                    <video
                      src={video.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                        {video.title || "Video Highlight"}
                      </span>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        Album: {video.albumName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-zinc-700/60">
                      <button
                        onClick={() => handleCopy(video.url, video.id || idx)}
                        className="text-[11px] text-[#E91E63] hover:text-[#D81B60] font-semibold flex items-center space-x-1"
                      >
                        {copiedId === (video.id || idx) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Video URL</span>
                          </>
                        )}
                      </button>

                      <a
                        href={video.url}
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
          ) : (
            <div className="py-12 text-center text-gray-400">
              <Video className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#E91E63]" />
              <p className="font-semibold text-xs text-gray-700 dark:text-gray-300">No videos stored yet</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Go to Gallery & Media Management to upload event videos to Supabase.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: JSON COLLECTIONS EXPLORER */}
      {activeTab === "json" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "albums", label: "Albums (Photos & Videos)" },
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

      {/* TAB 4: SUPABASE SQL SETUP */}
      {activeTab === "supabase" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Supabase SQL Setup Script
              </h3>
              <p className="text-xs text-gray-500">
                Run this once in your Supabase SQL Editor to create the albums table & public storage bucket.
              </p>
            </div>

            <button
              onClick={() => handleCopySQL(supabaseSqlSchema)}
              className="bg-[#E91E63] hover:bg-[#D81B60] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center space-x-1.5 transition-transform active:scale-95"
            >
              {sqlCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>SQL Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Query</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[450px] leading-relaxed border border-zinc-800">
              <code>{supabaseSqlSchema}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
