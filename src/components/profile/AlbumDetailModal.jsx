import React, { useState } from "react";
import { X, ArrowLeft, ChevronDown, Image as ImageIcon, Sparkles } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function AlbumDetailModal({ album, isOpen, onClose, onOpenLightbox, onSelectAnotherAlbum }) {
  const { albums, businessData, settings } = useData();

  const initialLimit = settings.imagesPerPage || 8;
  const [displayCount, setDisplayCount] = useState(initialLimit);

  if (!isOpen || !album) return null;

  const photos = album.photos || [];
  const displayedPhotos = photos.slice(0, displayCount);
  const hasMore = displayCount < photos.length;

  const otherAlbums = albums.filter((a) => a.id !== album.id);

  // Preset aspect ratio classes for Pinterest rhythm
  const aspectHeights = [
    "aspect-[4/5]",
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[2/3]",
    "aspect-[3/4]"
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-start overflow-y-auto backdrop-blur-md fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl mx-auto my-6 sm:my-10 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#E91E63] text-white p-6 sm:p-8 flex items-center justify-between relative">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-pink-100 block">
                {album.category || "Album Portfolio"} · {businessData.businessName}
              </span>
              <h2 className="text-xl sm:text-2xl font-black">{album.name}</h2>
              {album.description && (
                <p className="text-xs text-pink-100 mt-1 max-w-xl">{album.description}</p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none"
            title="Close Album (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Album Photos (Pinterest Style Grid) */}
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 dark:text-white">
              <ImageIcon className="w-4 h-4 text-[#E91E63]" />
              <span>
                Showing {displayedPhotos.length} of {photos.length} Photos
              </span>
            </div>
          </div>

          {photos.length > 0 ? (
            <>
              <div className="masonry-grid">
                {displayedPhotos.map((photo, idx) => {
                  const ratioClass = aspectHeights[idx % aspectHeights.length];

                  return (
                    <div
                      key={photo.id || idx}
                      onClick={() => onOpenLightbox(photos, idx)}
                      className="masonry-item group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div className={`w-full ${ratioClass} bg-zinc-800 overflow-hidden`}>
                        <img
                          src={photo.url}
                          alt={photo.caption || album.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      {photo.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {photo.caption}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* View More Button */}
              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setDisplayCount((prev) => prev + (settings.imagesPerPage || 8))}
                    className="bg-[#E91E63] hover:bg-[#D81B60] text-white px-8 py-3 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all transform active:scale-95 inline-flex items-center space-x-2"
                  >
                    <span>View More ({photos.length - displayCount} remaining)</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-sm">No photos inside this album yet</p>
            </div>
          )}

          {/* Section: Other Albums from Business Name */}
          {otherAlbums.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                Other Albums from {businessData.businessName}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {otherAlbums.map((other) => {
                  const thumb = other.thumbnail || other.photos?.[0]?.url;
                  return (
                    <div
                      key={other.id}
                      onClick={() => {
                        setDisplayCount(settings.imagesPerPage || 8);
                        onSelectAnotherAlbum(other);
                      }}
                      className="group cursor-pointer rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 hover:shadow-md transition-all transform hover:-translate-y-1"
                    >
                      <div className="aspect-square w-full bg-zinc-800 overflow-hidden relative">
                        <img
                          src={thumb}
                          alt={other.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {other.photos?.length || other.photoCount || 0}
                        </span>
                      </div>
                      <div className="p-2 text-xs font-bold text-gray-900 dark:text-white truncate">
                        {other.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
