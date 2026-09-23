import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Image as ImageIcon, ArrowRight } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function AlbumsStrip() {
  const { albums } = useData();
  const navigate = useNavigate();

  return (
    <section id="albums-section" className="py-4 sm:py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Albums Strip (approx 70%) */}
        <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                Albums Uploaded from: Chennai ({albums.length})
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Explore curated albums by Kishore across weddings, mandaps, haldi, and birthdays
              </p>
            </div>
          </div>

          {/* Horizontal scrollable / grid album cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {albums.map((album) => {
              const photoCount = album.photos?.length || album.photoCount || 0;
              const thumb = album.thumbnail || album.photos?.[0]?.url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80";

              return (
                <div
                  key={album.id}
                  onClick={() => navigate(`/album/${album.id}`)}
                  className="group cursor-pointer flex flex-col rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <div className="relative aspect-square w-full bg-zinc-800 overflow-hidden">
                    <img
                      src={thumb}
                      alt={album.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>{photoCount}</span>
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-zinc-800/80 flex-1 flex flex-col justify-between">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-[#E91E63] transition-colors">
                      {album.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5 capitalize">
                      {album.category || "Celebration"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
