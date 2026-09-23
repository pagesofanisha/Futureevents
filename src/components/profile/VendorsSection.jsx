import React from "react";
import { Camera, Music, Sparkles, Utensils, HeartHandshake, Phone, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function VendorsSection({ onOpenContactModal }) {
  const { businessData } = useData();

  const vendors = businessData.vendors && businessData.vendors.length > 0
    ? businessData.vendors
    : [
        {
          id: "v-photo",
          category: "Photography & Videography",
          name: "Cinematic & Candid Wedding Coverage",
          description: "Traditional photography, candid wedding film, 4K drone shoots, pre-wedding & post-wedding shoots.",
          priceStarting: "₹ 45,000",
          image: ""
        },
        {
          id: "v-dj",
          category: "DJ, Music & Sound",
          name: "Club DJ, Concert Sound & Truss Lighting",
          description: "High-power sound systems, live DJ mixing for Sangeet & Reception, beam lights, and cold spark pyros.",
          priceStarting: "₹ 25,000",
          image: ""
        },
        {
          id: "v-decor",
          category: "Stage & Mandap Decor",
          name: "Bespoke Royal Mandap & Florals",
          description: "Custom floral mandaps, grand reception backdrops, floral pathway arches, neon signs, and fairy lighting.",
          priceStarting: "₹ 60,000",
          image: ""
        },
        {
          id: "v-catering",
          category: "Food & Catering",
          name: "Authentic South Indian & Multi-Cuisine Feasts",
          description: "Traditional banana leaf feast, live chaat stalls, mocktail counters, desserts, and royal wedding buffet.",
          priceStarting: "₹ 450 / plate",
          image: ""
        },
        {
          id: "v-makeup",
          category: "Bridal Makeup & Styling",
          name: "Bridal HD Artistry & Styling",
          description: "HD bridal makeup, hair styling, saree draping, mehendi artists, and groom grooming.",
          priceStarting: "₹ 15,000",
          image: ""
        }
      ];

  const getCategoryIcon = (category) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("photo") || cat.includes("video")) return <Camera className="w-5 h-5 text-[#E91E63]" />;
    if (cat.includes("dj") || cat.includes("sound") || cat.includes("music")) return <Music className="w-5 h-5 text-[#E91E63]" />;
    if (cat.includes("food") || cat.includes("cater")) return <Utensils className="w-5 h-5 text-[#E91E63]" />;
    if (cat.includes("makeup") || cat.includes("style")) return <Sparkles className="w-5 h-5 text-[#E91E63]" />;
    return <HeartHandshake className="w-5 h-5 text-[#E91E63]" />;
  };

  return (
    <section id="vendors-section" className="py-6 scroll-mt-20">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 dark:border-zinc-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#E91E63]" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Vendors & Services Network by Kishore
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Top-tier photography, live DJ, sound systems, bespoke decor, and catering managed under one roof with zero coordination stress.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs bg-pink-100 dark:bg-pink-950/60 text-[#E91E63] font-bold px-3 py-1 rounded-full">
              {vendors.length} Partner Services
            </span>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors.map((vendor, idx) => (
            <div
              key={vendor.id || idx}
              className="group bg-gray-50/60 dark:bg-zinc-800/40 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 hover:border-pink-300 dark:hover:border-pink-900 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Image or Category Banner */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-tr from-zinc-900 via-zinc-850 to-zinc-900 flex items-center justify-center">
                  {vendor.image && !vendor.image.includes("unsplash.com") ? (
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-gradient-to-tr from-pink-950/30 via-zinc-900 to-zinc-900">
                      <div className="w-12 h-12 rounded-xl bg-[#E91E63]/20 text-[#E91E63] flex items-center justify-center mb-2">
                        {getCategoryIcon(vendor.category)}
                      </div>
                      <span className="text-xs font-bold text-gray-200">{vendor.category}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white flex items-center space-x-1.5 drop-shadow">
                    {getCategoryIcon(vendor.category)}
                    <span>{vendor.category}</span>
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#E91E63] transition-colors leading-snug">
                    {vendor.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {vendor.description}
                  </p>
                </div>
              </div>

              {/* Bottom Price & Inquiry */}
              <div className="p-4 pt-0 border-t border-gray-100 dark:border-zinc-800/60 mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Starting from</span>
                  <span className="text-xs font-black text-[#E91E63] dark:text-pink-400">
                    {vendor.priceStarting || "Price on request"}
                  </span>
                </div>

                <button
                  onClick={onOpenContactModal}
                  className="bg-white dark:bg-zinc-800 hover:bg-[#E91E63] hover:text-white text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center space-x-1 group-hover:border-transparent"
                >
                  <span>Book with Kishore</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coordinated by Kishore banner */}
        <div className="mt-6 p-4 rounded-xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
            <CheckCircle2 className="w-4 h-4 text-[#E91E63] flex-shrink-0" />
            <span>
              <strong>All vendors personally verified & managed by Kishore.</strong> No multiple follow-ups or vendor miscommunication on your wedding day.
            </span>
          </div>

          <button
            onClick={onOpenContactModal}
            className="bg-[#E91E63] hover:bg-[#D81B60] text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-transform active:scale-95 flex items-center space-x-1.5 whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Get Package Pricing</span>
          </button>
        </div>
      </div>
    </section>
  );
}
