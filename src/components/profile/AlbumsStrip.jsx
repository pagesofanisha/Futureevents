import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Image as ImageIcon, ArrowRight } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function AlbumsStrip({ onSelectAlbum }) {
  const { albums } = useData();

  return (
    <section id="albums-section" className="py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Albums Strip (approx 70%) */}
        <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Albums Uploaded from: Chennai ({albums.length})
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Explore curated albums by Kishore across weddings, mandaps, haldi, and birthdays
              </p>
            </div>
          </div>

          {/* Horizontal scrollable / grid album cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {albums.map((album) => {
              const photoCount = album.photos?.length || album.photoCount || 0;
              const thumb = album.thumbnail || album.photos?.[0]?.url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80";

              return (
                <div
                  key={album.id}
                  onClick={() => onSelectAlbum(album)}
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

        {/* Right: Genie Concierge Promo Card (approx 30% matching WedMeGood) */}
        <div className="w-full lg:w-80 bg-gradient-to-br from-pink-600 via-[#E91E63] to-rose-700 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>WedMeGood Genie Concierge</span>
            </div>
            <h3 className="text-xl font-black leading-tight mb-2">
              Planning your dream event made easy!
            </h3>
            <p className="text-xs text-pink-100 leading-relaxed mb-4">
              Get Kishore's direct quotes for destination weddings, stage decors, floral mandaps, and catering packages.
            </p>
          </div>

          <a
            href="#inquiry-form"
            className="w-full bg-white text-[#E91E63] hover:bg-pink-50 py-2.5 px-4 rounded-xl text-xs font-extrabold text-center shadow-lg transition-transform transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Meet Kishore & Team</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
