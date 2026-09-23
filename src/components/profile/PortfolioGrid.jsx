import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  FolderOpen,
  Video,
  ChevronDown,
  Maximize2
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function PortfolioGrid({ onOpenLightbox }) {
  const { albums, settings } = useData();
  const navigate = useNavigate();

  // Active Tab: "portfolio" | "albums" | "videos"
  const [activeTab, setActiveTab] = useState("portfolio");

  // Flatten all photos for the main Portfolio grid
  const allPhotos = albums.flatMap((album) =>
    (album.photos || []).map((p) => ({
      ...p,
      albumName: album.name,
      albumId: album.id,
    }))
  );

  // Initial images count from settings (default 8, configurable 5-10)
  const initialLimit = settings.imagesPerPage || 8;
  const [displayCount, setDisplayCount] = useState(initialLimit);

  useEffect(() => {
    setDisplayCount(settings.imagesPerPage || 8);
  }, [settings.imagesPerPage]);

  const displayedPhotos = allPhotos.slice(0, displayCount);
  const hasMore = displayCount < allPhotos.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + (settings.imagesPerPage || 8));
  };

  // Preset aspect ratio classes to produce realistic Pinterest-style varying heights
  const aspectHeights = [
    "aspect-[4/5]",
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[2/3]",
    "aspect-[3/4]"
  ];

  return (
    <section id="projects-section" className="py-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
        {/* Navigation Tabs matching screenshot: PORTFOLIO (27) | ALBUMS (17) | VIDEOS (0) */}
        <div className="flex items-center space-x-6 border-b border-gray-200 dark:border-zinc-800 mb-6 text-xs sm:text-sm font-bold tracking-wider">
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`pb-3 border-b-2 uppercase transition-colors flex items-center space-x-1.5 ${
              activeTab === "portfolio"
                ? "border-[#E91E63] text-[#E91E63]"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Portfolio ({allPhotos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("albums")}
            className={`pb-3 border-b-2 uppercase transition-colors flex items-center space-x-1.5 ${
              activeTab === "albums"
                ? "border-[#E91E63] text-[#E91E63]"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Albums ({albums.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-3 border-b-2 uppercase transition-colors flex items-center space-x-1.5 ${
              activeTab === "videos"
                ? "border-[#E91E63] text-[#E91E63]"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Videos (0)</span>
          </button>
        </div>

        {/* Tab 1: Pinterest-Style Portfolio Photo Grid */}
        {activeTab === "portfolio" && (
          <div>
            <div className="masonry-grid">
              {displayedPhotos.map((photo, idx) => {
                const ratioClass = aspectHeights[idx % aspectHeights.length];

                return (
                  <div
                    key={photo.id || idx}
                    onClick={() => onOpenLightbox(allPhotos, idx)}
                    className="masonry-item group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`w-full ${ratioClass} bg-zinc-800 overflow-hidden`}>
                      <img
                        src={photo.url}
                        alt={photo.caption || "Future Events Stage Setup"}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* Hover Overlay with Caption & Zoom Icon */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3.5 text-white">
                      <div className="self-end bg-black/40 backdrop-blur-md p-1.5 rounded-full">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        {photo.caption && (
                          <p className="text-xs font-medium leading-snug line-clamp-2">
                            {photo.caption}
                          </p>
                        )}
                        <span className="text-[10px] text-pink-300 mt-1 block">
                          Album: {photo.albumName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* "View More" Button (pink) */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-[#E91E63] hover:bg-[#D81B60] text-white px-8 py-3 rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 inline-flex items-center space-x-2"
                >
                  <span>View More Photos ({allPhotos.length - displayCount} remaining)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Albums Grid View */}
        {activeTab === "albums" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map((album) => {
              const photoCount = album.photos?.length || album.photoCount || 0;
              const thumb = album.thumbnail || album.photos?.[0]?.url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80";

              return (
                <div
                  key={album.id}
                  onClick={() => navigate(`/album/${album.id}`)}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 hover:shadow-xl transition-all transform hover:-translate-y-1 bg-white dark:bg-zinc-800/80"
                >
                  <div className="relative aspect-video w-full bg-zinc-800 overflow-hidden">
                    <img
                      src={thumb}
                      alt={album.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {photoCount} Photos
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#E91E63] transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {album.description || "Curated celebration memories"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Videos (Empty State) */}
        {activeTab === "videos" && (
          <div className="py-12 text-center text-gray-400">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-sm">No videos uploaded yet</p>
            <p className="text-xs text-gray-500 mt-1">Cinematic reels and event videos will appear here once added.</p>
          </div>
        )}
      </div>
    </section>
  );
}
