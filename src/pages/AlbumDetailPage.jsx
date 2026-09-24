import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Heart,
  Share2,
  Phone,
  Maximize2,
  Calendar,
  Sparkles
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import LightboxModal from "../components/common/LightboxModal";
import ContactModal from "../components/common/ContactModal";
import { useData } from "../context/DataContext";

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { albums, businessData, contactData } = useData();

  // Find the selected album or default to first
  const currentAlbum = albums.find((a) => a.id === albumId) || albums[0];

  // Modals state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Scroll to top on albumId change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [albumId]);

  if (!currentAlbum) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-gray-500 mb-4">Album not found.</p>
          <Link to="/" className="bg-[#E91E63] text-white px-5 py-2 rounded-xl text-xs font-bold">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const photos = currentAlbum.photos || [];
  const otherAlbums = albums.filter((a) => a.id !== currentAlbum.id);

  const handleOpenLightbox = (index = 0) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Preset aspect ratio classes to maintain Pinterest masonry rhythm
  const aspectHeights = [
    "aspect-[4/5]",
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[2/3]",
    "aspect-[3/4]"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 py-2.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[#E91E63]">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <Link to="/" className="hover:text-[#E91E63]">Vendors</Link>
          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <Link to="/" className="hover:text-[#E91E63]">{businessData.businessName}</Link>
          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[200px]">
            {currentAlbum.name}
          </span>
        </div>
      </div>

      {/* Main Album Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Album Header Banner */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
            <div>
              <Link
                to="/"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#E91E63] hover:underline mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Vendor Profile</span>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider font-bold bg-pink-100 dark:bg-pink-950/60 text-[#E91E63] px-2.5 py-0.5 rounded-full">
                  {currentAlbum.category || "Celebrations"}
                </span>
                <span className="text-xs text-gray-400">· {photos.length} Photos</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1.5 tracking-tight">
                {currentAlbum.name}
              </h1>
              {currentAlbum.description && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
                  {currentAlbum.description}
                </p>
              )}
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center space-x-3 self-start sm:self-center">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="bg-[#E91E63] hover:bg-[#D81B60] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Book This Theme</span>
              </button>
            </div>
          </div>

          {/* Photo Gallery Grid (Pinterest Style) */}
          <div className="pt-6">
            {photos.length > 0 ? (
              <div className="masonry-grid">
                {photos.map((photo, idx) => {
                  const ratioClass = aspectHeights[idx % aspectHeights.length];

                  return (
                    <div
                      key={photo.id || idx}
                      onClick={() => handleOpenLightbox(idx)}
                      className="masonry-item group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div className={`w-full ${ratioClass} bg-zinc-800 overflow-hidden`}>
                        <img
                          src={photo.url}
                          alt={photo.caption || currentAlbum.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3.5 text-white">
                        <div className="self-end bg-black/40 backdrop-blur-md p-1.5 rounded-full">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </div>
                        {photo.caption && (
                          <p className="text-xs font-medium leading-snug line-clamp-2">
                            {photo.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="font-semibold text-sm">No photos inside this album yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Section: Album Videos if present */}
        {currentAlbum.videos && currentAlbum.videos.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-[#E91E63]">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Event Highlights & Videos ({currentAlbum.videos.length})
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Cinematic reels and ceremony videos for {currentAlbum.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentAlbum.videos.map((vid, vIdx) => (
                <div
                  key={vid.id || vIdx}
                  className="rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-black shadow-sm"
                >
                  <div className="aspect-video w-full flex items-center justify-center">
                    <video
                      src={vid.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-800">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                      {vid.title || `${currentAlbum.name} Video`}
                    </h4>
                    {vid.caption && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {vid.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Other Event Albums from Future Event Organization */}
        {otherAlbums.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Other Event Albums from {businessData.businessName}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Browse weddings, haldi, valaikappu baby showers, and birthdays
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {otherAlbums.map((other) => {
                const photoCount = other.photos?.length || other.photoCount || 0;
                const thumb =
                  other.thumbnail && !other.thumbnail.includes("unsplash.com")
                    ? other.thumbnail
                    : other.photos?.[0]?.url || "";

                return (
                  <div
                    key={other.id}
                    onClick={() => navigate(`/album/${other.id}`)}
                    className="group cursor-pointer rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-all transform hover:-translate-y-1 bg-white dark:bg-zinc-800/80"
                  >
                    <div className="relative aspect-square w-full bg-zinc-800 overflow-hidden">
                      {thumb && !thumb.includes("unsplash.com") ? (
                        <img
                          src={thumb}
                          alt={other.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-tr from-pink-950/40 via-zinc-900 to-zinc-900">
                          <ImageIcon className="w-6 h-6 text-[#E91E63] opacity-60 mb-1" />
                          <span className="text-[10px] text-gray-400 font-semibold truncate max-w-full px-1">
                            {other.category || "Album"}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                      <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>{photoCount}</span>
                      </span>
                    </div>
                    <div className="p-2.5">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-[#E91E63] transition-colors">
                        {other.name}
                      </h3>
                      <span className="text-[10px] text-gray-400 dark:text-gray-400 block mt-0.5 capitalize">
                        {other.category || "Celebration"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={lightboxPhotos}
        currentIndex={lightboxIndex}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
