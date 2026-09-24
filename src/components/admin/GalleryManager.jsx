import React, { useState } from "react";
import {
  FolderPlus,
  Trash2,
  Edit2,
  Upload,
  Image as ImageIcon,
  Video,
  Play,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  Eye,
  Sparkles,
  Cloud,
  Film
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { uploadImageFile, uploadVideoFile } from "../../services/storageService";
import { isSupabaseConfigured, SUPABASE_BUCKET } from "../../config/supabase";

export default function GalleryManager() {
  const {
    albums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addPhotoToAlbum,
    deletePhotoFromAlbum,
    addVideoToAlbum,
    deleteVideoFromAlbum,
    syncLocalAlbumsToSupabase
  } = useData();

  // Selected Album for viewing / uploading media
  const [selectedAlbumId, setSelectedAlbumId] = useState(albums[0]?.id || null);

  // Active Media Sub-tab for selected album: "photos" | "videos"
  const [activeMediaTab, setActiveMediaTab] = useState("photos");

  // Create Album modal / inline form state
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumCategory, setNewAlbumCategory] = useState("Weddings");
  const [newAlbumDesc, setNewAlbumDesc] = useState("");

  // Edit / Rename Album state
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [editingAlbumName, setEditingAlbumName] = useState("");

  // Upload State (Unified for photos & videos)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Direct Image URL State
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [photoCaptionInput, setPhotoCaptionInput] = useState("");
  const [isAddingPhotoUrl, setIsAddingPhotoUrl] = useState(false);

  // Direct Video URL State
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [videoTitleInput, setVideoTitleInput] = useState("");
  const [videoCaptionInput, setVideoCaptionInput] = useState("");
  const [isAddingVideoUrl, setIsAddingVideoUrl] = useState(false);

  // Cloud Sync State (Laptop -> Supabase)
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncError, setSyncError] = useState("");

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    setSyncProgress(5);
    setSyncMessage("Connecting to Supabase...");
    setSyncError("");
    setSyncSuccess(false);

    try {
      await syncLocalAlbumsToSupabase((pct, msg) => {
        setSyncProgress(pct);
        setSyncMessage(msg);
      });
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 8000);
    } catch (err) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const currentAlbum = albums.find((a) => a.id === selectedAlbumId) || albums[0];

  // 1. Create Album
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;

    try {
      const created = await createAlbum({
        name: newAlbumName.trim(),
        category: newAlbumCategory,
        description: newAlbumDesc.trim(),
        photos: [],
        videos: []
      });
      setSelectedAlbumId(created.id);
      setIsCreatingAlbum(false);
      setNewAlbumName("");
      setNewAlbumDesc("");
    } catch (err) {
      alert("Failed to create album: " + err.message);
    }
  };

  // 2. Rename Album
  const handleSaveRename = async (albumId) => {
    if (!editingAlbumName.trim()) return;
    await updateAlbum(albumId, { name: editingAlbumName.trim() });
    setEditingAlbumId(null);
  };

  // 3. Delete Album
  const handleDeleteAlbum = async (albumId, albumName) => {
    if (window.confirm(`Are you sure you want to permanently delete album "${albumName}" and all its photos & videos?`)) {
      await deleteAlbum(albumId);
      if (selectedAlbumId === albumId) {
        const remaining = albums.filter((a) => a.id !== albumId);
        setSelectedAlbumId(remaining[0]?.id || null);
      }
    }
  };

  // 4. Multi-file Photo Upload to Supabase Storage
  const handleUploadPhotoFiles = async (files) => {
    if (!currentAlbum) {
      alert("Please select or create an album first.");
      return;
    }
    const fileList = Array.from(files);
    if (!fileList.length) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadMessage(`Processing ${fileList.length} photo${fileList.length > 1 ? "s" : ""} for Supabase...`);

    let completed = 0;
    try {
      for (const file of fileList) {
        setUploadMessage(`Uploading photo ${completed + 1} of ${fileList.length} to Supabase...`);
        const storagePath = `albums/${currentAlbum.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const downloadUrl = await uploadImageFile(file, storagePath, (pct) => {
          const stepTotal = ((completed + pct / 100) / fileList.length) * 100;
          setUploadProgress(Math.round(stepTotal));
        });

        await addPhotoToAlbum(currentAlbum.id, {
          url: downloadUrl,
          caption: `${currentAlbum.name} - Photo ${Date.now().toString().slice(-4)}`
        });

        completed++;
      }
      setUploadProgress(100);
      setUploadMessage(`${completed} photo${completed > 1 ? "s" : ""} saved permanently!`);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadMessage("");
      }, 2000);
    } catch (err) {
      alert("Upload failed: " + err.message);
      setIsUploading(false);
    }
  };

  // 4b. Multi-file Video Upload to Supabase Storage
  const handleUploadVideoFiles = async (files) => {
    if (!currentAlbum) {
      alert("Please select or create an album first.");
      return;
    }
    const fileList = Array.from(files);
    if (!fileList.length) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadMessage(`Uploading ${fileList.length} video${fileList.length > 1 ? "s" : ""} to Supabase Storage...`);

    let completed = 0;
    try {
      for (const file of fileList) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setUploadMessage(`Uploading video ${completed + 1} of ${fileList.length} (${sizeMb} MB) to Supabase...`);
        const storagePath = `videos/${currentAlbum.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        
        const downloadUrl = await uploadVideoFile(file, storagePath, (pct) => {
          const stepTotal = ((completed + pct / 100) / fileList.length) * 100;
          setUploadProgress(Math.round(stepTotal));
        });

        await addVideoToAlbum(currentAlbum.id, {
          url: downloadUrl,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          caption: `${currentAlbum.name} Video Highlight`
        });

        completed++;
      }
      setUploadProgress(100);
      setUploadMessage(`${completed} video${completed > 1 ? "s" : ""} stored permanently in Supabase!`);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadMessage("");
      }, 2000);
    } catch (err) {
      alert("Video upload failed: " + err.message);
      setIsUploading(false);
    }
  };

  // 4c. Add Photo via URL
  const handleAddPhotoUrl = async (e) => {
    e.preventDefault();
    if (!photoUrlInput.trim() || !currentAlbum) return;
    setIsAddingPhotoUrl(true);
    try {
      await addPhotoToAlbum(currentAlbum.id, {
        url: photoUrlInput.trim(),
        caption: photoCaptionInput.trim() || `${currentAlbum.name} - Photo ${Date.now().toString().slice(-4)}`
      });
      setPhotoUrlInput("");
      setPhotoCaptionInput("");
    } catch (err) {
      alert("Failed to add photo: " + err.message);
    } finally {
      setIsAddingPhotoUrl(false);
    }
  };

  // 4d. Add Video via URL
  const handleAddVideoUrl = async (e) => {
    e.preventDefault();
    if (!videoUrlInput.trim() || !currentAlbum) return;
    setIsAddingVideoUrl(true);
    try {
      await addVideoToAlbum(currentAlbum.id, {
        url: videoUrlInput.trim(),
        title: videoTitleInput.trim() || `${currentAlbum.name} Highlight`,
        caption: videoCaptionInput.trim() || ""
      });
      setVideoUrlInput("");
      setVideoTitleInput("");
      setVideoCaptionInput("");
    } catch (err) {
      alert("Failed to add video: " + err.message);
    } finally {
      setIsAddingVideoUrl(false);
    }
  };

  // 5. Delete Photo
  const handleDeletePhoto = async (photoId) => {
    if (window.confirm("Permanently delete this photo from cloud storage?")) {
      await deletePhotoFromAlbum(currentAlbum.id, photoId);
    }
  };

  // 5b. Delete Video
  const handleDeleteVideo = async (videoId) => {
    if (window.confirm("Permanently delete this video from storage?")) {
      await deleteVideoFromAlbum(currentAlbum.id, videoId);
    }
  };

  // 5c. Set as Album Cover Photo
  const handleSetCoverPhoto = async (photoUrl) => {
    if (!currentAlbum) return;
    try {
      await updateAlbum(currentAlbum.id, { thumbnail: photoUrl });
    } catch (err) {
      alert("Failed to set cover photo: " + err.message);
    }
  };

  // 6. Reorder Photo (Up / Down)
  const handleMovePhoto = async (index, direction) => {
    if (!currentAlbum?.photos) return;
    const newPhotos = [...currentAlbum.photos];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPhotos.length) return;

    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;

    await updateAlbum(currentAlbum.id, { photos: newPhotos });
  };

  const albumPhotos = currentAlbum?.photos || [];
  const albumVideos = currentAlbum?.videos || [];

  return (
    <div className="space-y-6">
      {/* Top Header & Cloud Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-colors">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Gallery & Media Management
            </h2>
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                <Cloud className="w-3 h-3" />
                <span>Supabase Storage Connected</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3" />
                <span>Configure Supabase in Settings</span>
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Upload high-resolution event photos & videos directly to Supabase Cloud Storage. All changes update the live website immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleSyncToSupabase}
            disabled={isSyncing}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5"
            title="Upload all photos currently on this laptop into Supabase Cloud so they load on your phone and everywhere"
          >
            {isSyncing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Cloud className="w-4 h-4" />
            )}
            <span>{isSyncing ? "Syncing to Cloud..." : "Push Laptop Photos to Cloud"}</span>
          </button>

          <button
            onClick={() => setIsCreatingAlbum(true)}
            className="bg-[#E91E63] hover:bg-[#D81B60] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create New Album</span>
          </button>
        </div>
      </div>

      {/* Cloud Sync Progress Bar */}
      {isSyncing && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-2">
          <div className="flex justify-between font-bold">
            <span className="flex items-center space-x-1.5">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>{syncMessage}</span>
            </span>
            <span>{syncProgress}%</span>
          </div>
          <div className="w-full bg-indigo-200 dark:bg-indigo-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${syncProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Sync Success Banner */}
      {syncSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center space-x-2">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold">Sync Complete! All photos are now stored permanently in Supabase Cloud.</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
              Open the website on your phone right now and refresh — all your photos will load immediately!
            </p>
          </div>
        </div>
      )}

      {/* Sync Error Banner */}
      {syncError && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 space-y-2">
          <div className="flex items-center space-x-2 font-bold">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>Sync Warning: {syncError}</span>
          </div>
          <p className="text-[11px] text-red-600 dark:text-red-300">
            If the table or bucket does not exist in Supabase yet, open the <strong>Database & Storage</strong> tab &gt; <strong>Supabase SQL Setup</strong>, copy the SQL, and run it in your Supabase SQL Editor once.
          </p>
        </div>
      )}

      {/* Create Album Modal */}
      {isCreatingAlbum && (
        <div className="bg-pink-50/50 dark:bg-zinc-800/80 p-5 rounded-2xl border border-pink-200 dark:border-zinc-700 fade-in">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            Create New Event Album
          </h3>
          <form onSubmit={handleCreateAlbum} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  Album Name <span className="text-[#E91E63]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="e.g. Traditional Muhurtham & Mandap"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={newAlbumCategory}
                  onChange={(e) => setNewAlbumCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
                >
                  <option value="Weddings">Weddings</option>
                  <option value="Engagements">Engagements</option>
                  <option value="Baby Shower (Valaikappu)">Baby Shower (Valaikappu)</option>
                  <option value="Haldi & Sangeet">Haldi & Sangeet</option>
                  <option value="Catering & Food">Catering & Food</option>
                  <option value="Birthdays">Birthdays</option>
                  <option value="Special Events">Special Events</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Description (optional)
              </label>
              <input
                type="text"
                value={newAlbumDesc}
                onChange={(e) => setNewAlbumDesc(e.target.value)}
                placeholder="Brief summary of decor theme or venue highlights"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingAlbum(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#E91E63] text-white px-4 py-1.5 rounded-lg font-bold hover:bg-[#D81B60]"
              >
                Save Album
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Split: Left Albums List, Right Media Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Albums List (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block px-1">
            Albums List ({albums.length})
          </span>

          <div className="space-y-2">
            {albums.map((album) => {
              const isSelected = album.id === (selectedAlbumId || albums[0]?.id);
              const isEditing = editingAlbumId === album.id;
              const photoCount = album.photos?.length || album.photoCount || 0;
              const videoCount = album.videos?.length || album.videoCount || 0;
              const thumb = album.thumbnail || album.photos?.[0]?.url;

              return (
                <div
                  key={album.id}
                  onClick={() => !isEditing && setSelectedAlbumId(album.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#E91E63] bg-pink-50/50 dark:bg-pink-950/30"
                      : "border-gray-200 dark:border-zinc-800 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {thumb && !thumb.includes("unsplash.com") ? (
                      <img
                        src={thumb}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-zinc-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-[#E91E63] flex items-center justify-center flex-shrink-0 border border-pink-200 dark:border-pink-900">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingAlbumName}
                            onChange={(e) => setEditingAlbumName(e.target.value)}
                            className="w-full text-xs px-2 py-1 border rounded bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={() => handleSaveRename(album.id)}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingAlbumId(null)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {album.name}
                          </h4>
                          <span className="text-[11px] text-gray-500 block">
                            {photoCount} photos · {videoCount} videos · {album.category || "Celebration"}
                          </span>
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setEditingAlbumId(album.id);
                            setEditingAlbumName(album.name);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#E91E63] rounded-md transition-colors"
                          title="Rename Album"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAlbum(album.id, album.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                          title="Delete Album"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Album Media Manager (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {currentAlbum ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center space-x-3.5">
                  <div className="relative group flex-shrink-0">
                    {currentAlbum.thumbnail && !currentAlbum.thumbnail.includes("unsplash.com") ? (
                      <img
                        src={currentAlbum.thumbnail}
                        alt="Cover"
                        className="w-14 h-14 rounded-xl object-cover border-2 border-[#E91E63] shadow-md bg-zinc-800"
                      />
                    ) : currentAlbum.photos && currentAlbum.photos[0]?.url && !currentAlbum.photos[0].url.includes("unsplash.com") ? (
                      <img
                        src={currentAlbum.photos[0].url}
                        alt="Cover"
                        className="w-14 h-14 rounded-xl object-cover border-2 border-[#E91E63] shadow-md bg-zinc-800"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-[#E91E63] flex items-center justify-center border-2 border-[#E91E63] shadow-md">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 bg-[#E91E63] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow flex items-center space-x-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Cover</span>
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {currentAlbum.name}
                      </h3>
                      <span className="text-xs bg-pink-100 dark:bg-pink-950/60 text-[#E91E63] font-semibold px-2 py-0.5 rounded-full">
                        {albumPhotos.length} Photos · {albumVideos.length} Videos
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {currentAlbum.description || "Upload event photos and videos to this album."}
                    </p>
                  </div>
                </div>

                {/* Sub-Tabs: Photos vs Videos */}
                <div className="flex items-center bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl self-start sm:self-center">
                  <button
                    onClick={() => setActiveMediaTab("photos")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                      activeMediaTab === "photos"
                        ? "bg-white dark:bg-zinc-900 text-[#E91E63] shadow-sm"
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Photos ({albumPhotos.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveMediaTab("videos")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                      activeMediaTab === "videos"
                        ? "bg-white dark:bg-zinc-900 text-[#E91E63] shadow-sm"
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Videos ({albumVideos.length})</span>
                  </button>
                </div>
              </div>

              {/* ----------------- PHOTOS TAB ----------------- */}
              {activeMediaTab === "photos" && (
                <div className="space-y-5">
                  {/* Photo Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      if (e.dataTransfer.files) {
                        handleUploadPhotoFiles(e.dataTransfer.files);
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      isDragOver
                        ? "border-[#E91E63] bg-pink-50/50 dark:bg-pink-950/30 scale-101"
                        : "border-gray-300 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/40"
                    }`}
                  >
                    <Upload className="w-10 h-10 text-[#E91E63] mx-auto mb-2 opacity-80" />
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      Drag & Drop photos here, or click to browse
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Formats: JPG, PNG, WebP. Compressed and stored directly in Supabase Storage.
                    </p>

                    <label className="mt-3 inline-block bg-[#E91E63] hover:bg-[#D81B60] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-transform active:scale-95">
                      <span>Browse Photos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => handleUploadPhotoFiles(e.target.files)}
                        className="hidden"
                      />
                    </label>

                    {/* Upload Progress Bar */}
                    {isUploading && (
                      <div className="mt-4 max-w-xs mx-auto space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between font-semibold">
                          <span>{uploadMessage}</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#E91E63] h-full transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add Photo by Direct URL */}
                  <div className="bg-gray-50/70 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-xs">
                    <form onSubmit={handleAddPhotoUrl} className="flex flex-col sm:flex-row gap-2 items-center">
                      <div className="flex-1 w-full">
                        <input
                          type="url"
                          value={photoUrlInput}
                          onChange={(e) => setPhotoUrlInput(e.target.value)}
                          placeholder="Or paste any direct Photo URL (e.g. https://...)"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
                        />
                      </div>
                      <div className="w-full sm:w-48">
                        <input
                          type="text"
                          value={photoCaptionInput}
                          onChange={(e) => setPhotoCaptionInput(e.target.value)}
                          placeholder="Photo caption (optional)"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isAddingPhotoUrl || !photoUrlInput.trim()}
                        className="w-full sm:w-auto bg-gray-900 dark:bg-zinc-700 hover:bg-[#E91E63] text-white px-4 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {isAddingPhotoUrl ? "Adding..." : "Add via URL"}
                      </button>
                    </form>
                  </div>

                  {/* Photos Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                        Photos in Album ({albumPhotos.length})
                      </span>
                    </div>

                    {albumPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                        {albumPhotos.map((photo, idx) => {
                          const isCover = currentAlbum.thumbnail === photo.url || (!currentAlbum.thumbnail && idx === 0);
                          return (
                            <div
                              key={photo.id || idx}
                              className={`group relative rounded-xl overflow-hidden border transition-all ${
                                isCover
                                  ? "border-2 border-[#E91E63] shadow-md ring-2 ring-[#E91E63]/25 bg-pink-50/20 dark:bg-pink-950/20"
                                  : "border-gray-200 dark:border-zinc-800 hover:border-[#E91E63]/50 bg-zinc-900"
                              } flex flex-col`}
                            >
                              <div className="relative aspect-square overflow-hidden bg-zinc-900">
                                <img
                                  src={photo.url}
                                  alt=""
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />

                                {isCover && (
                                  <div className="absolute top-2 left-2 z-10 bg-[#E91E63] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center space-x-1">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Cover Photo</span>
                                  </div>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                                  <div className="flex justify-between items-center">
                                    <div className="flex space-x-1">
                                      {idx > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => handleMovePhoto(idx, "up")}
                                          className="p-1 rounded bg-white/20 hover:bg-white/40 text-white"
                                          title="Move Earlier"
                                        >
                                          <ArrowUp className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      {idx < albumPhotos.length - 1 && (
                                        <button
                                          type="button"
                                          onClick={() => handleMovePhoto(idx, "down")}
                                          className="p-1 rounded bg-white/20 hover:bg-white/40 text-white"
                                          title="Move Later"
                                        >
                                          <ArrowDown className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleDeletePhoto(photo.id)}
                                      className="p-1 rounded bg-red-600 hover:bg-red-700 text-white"
                                      title="Delete Photo"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {!isCover && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetCoverPhoto(photo.url)}
                                      className="bg-[#E91E63] hover:bg-[#D81B60] text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow transition-transform active:scale-95 flex items-center justify-center space-x-1 mx-auto"
                                    >
                                      <Sparkles className="w-3.5 h-3.5" />
                                      <span>Make Cover</span>
                                    </button>
                                  )}

                                  <p className="text-[10px] text-gray-200 line-clamp-1">
                                    {photo.caption || "Event Photo"}
                                  </p>
                                </div>
                              </div>

                              <div className="p-2 bg-white dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700/60 flex items-center justify-between text-xs">
                                {isCover ? (
                                  <span className="text-[#E91E63] font-bold text-[11px] flex items-center space-x-1 py-0.5">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    <span>Album Cover</span>
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCoverPhoto(photo.url)}
                                    className="w-full text-left text-gray-600 dark:text-gray-300 hover:text-[#E91E63] dark:hover:text-[#E91E63] font-semibold text-[11px] flex items-center space-x-1 py-0.5 transition-colors group/btn"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-[#E91E63]" />
                                    <span>Set as Cover</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                        <p className="text-xs">No photos in this album yet. Upload above.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ----------------- VIDEOS TAB ----------------- */}
              {activeMediaTab === "videos" && (
                <div className="space-y-5">
                  {/* Video Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      if (e.dataTransfer.files) {
                        handleUploadVideoFiles(e.dataTransfer.files);
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      isDragOver
                        ? "border-[#E91E63] bg-pink-50/50 dark:bg-pink-950/30 scale-101"
                        : "border-gray-300 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/40"
                    }`}
                  >
                    <Video className="w-10 h-10 text-[#E91E63] mx-auto mb-2 opacity-80" />
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      Drag & Drop video files here, or click to browse
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Formats: MP4, WebM, MOV. Uploaded directly to Supabase Storage bucket "{SUPABASE_BUCKET}".
                    </p>

                    <label className="mt-3 inline-block bg-[#E91E63] hover:bg-[#D81B60] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-transform active:scale-95">
                      <span>Browse Videos</span>
                      <input
                        type="file"
                        multiple
                        accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                        onChange={(e) => handleUploadVideoFiles(e.target.files)}
                        className="hidden"
                      />
                    </label>

                    {/* Video Upload Progress Bar */}
                    {isUploading && (
                      <div className="mt-4 max-w-xs mx-auto space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between font-semibold">
                          <span>{uploadMessage}</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#E91E63] h-full transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add Video by Direct URL */}
                  <div className="bg-gray-50/70 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-xs">
                    <form onSubmit={handleAddVideoUrl} className="flex flex-col sm:flex-row gap-2 items-center">
                      <div className="flex-1 w-full">
                        <input
                          type="url"
                          value={videoUrlInput}
                          onChange={(e) => setVideoUrlInput(e.target.value)}
                          placeholder="Paste direct Video URL (e.g. Supabase or CDN .mp4 URL)"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
                        />
                      </div>
                      <div className="w-full sm:w-40">
                        <input
                          type="text"
                          value={videoTitleInput}
                          onChange={(e) => setVideoTitleInput(e.target.value)}
                          placeholder="Video Title"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
                        />
                      </div>
                      <div className="w-full sm:w-40">
                        <input
                          type="text"
                          value={videoCaptionInput}
                          onChange={(e) => setVideoCaptionInput(e.target.value)}
                          placeholder="Caption (optional)"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isAddingVideoUrl || !videoUrlInput.trim()}
                        className="w-full sm:w-auto bg-gray-900 dark:bg-zinc-700 hover:bg-[#E91E63] text-white px-4 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {isAddingVideoUrl ? "Adding..." : "Add Video"}
                      </button>
                    </form>
                  </div>

                  {/* Videos Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                        Videos in Album ({albumVideos.length})
                      </span>
                    </div>

                    {albumVideos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {albumVideos.map((video) => (
                          <div
                            key={video.id}
                            className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-zinc-900 shadow-sm flex flex-col"
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

                            <div className="p-3 bg-white dark:bg-zinc-800 flex items-center justify-between text-xs">
                              <div className="min-w-0 pr-2">
                                <h5 className="font-bold text-gray-900 dark:text-white truncate">
                                  {video.title || "Event Video"}
                                </h5>
                                <p className="text-[11px] text-gray-500 truncate">
                                  {video.caption || "Supabase Cloud Video"}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteVideo(video.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors flex-shrink-0"
                                title="Delete Video"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Video className="w-8 h-8 mx-auto mb-1 opacity-40" />
                        <p className="text-xs">No videos in this album yet. Upload an MP4 video above.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center text-gray-400">
              <p>Please select or create an album from the left column.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
