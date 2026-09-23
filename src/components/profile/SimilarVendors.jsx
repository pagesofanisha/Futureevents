import React from "react";
import { Star, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import { similarVendorsData } from "../../config/defaultData";

export default function SimilarVendors() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Browse Similar Vendors in Chennai
          </h3>
          <p className="text-[11px] text-gray-500">Other wedding planners around Chennai</p>
        </div>
        <button
          onClick={() => alert("Exploring more WedMeGood Chennai planners...")}
          className="text-[#E91E63] hover:text-[#D81B60] text-xs font-bold border border-pink-200 dark:border-pink-900/60 px-3 py-1 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-3.5">
        {similarVendorsData.map((vendor) => (
          <div
            key={vendor.id}
            className="flex items-center space-x-3.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors group cursor-pointer"
            onClick={() => alert(`Selected vendor: ${vendor.name} (${vendor.location})`)}
          >
            {vendor.image && !vendor.image.includes("unsplash.com") ? (
              <img
                src={vendor.image}
                alt={vendor.name}
                className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-zinc-700 flex-shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-pink-600 to-[#E91E63] text-white flex items-center justify-center flex-shrink-0 font-black text-xs shadow-sm">
                {vendor.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-[#E91E63] transition-colors">
                  {vendor.name}
                </h4>
                <div className="flex items-center space-x-0.5 bg-[#00A651] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                  <span>{vendor.rating}</span>
                  <Star className="w-2.5 h-2.5 fill-white" />
                </div>
              </div>

              <div className="flex items-center space-x-1 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="truncate">{vendor.location}</span>
                <span className="opacity-60">·</span>
                <span>{vendor.reviewCount} reviews</span>
              </div>

              <div className="mt-1 text-[11px] text-gray-700 dark:text-gray-300">
                <span className="text-gray-400">Fee: </span>
                <span className="font-semibold text-[#E91E63] dark:text-pink-400">{vendor.startingPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
