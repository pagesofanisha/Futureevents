import React, { useState } from "react";
import { Heart, Share2, Check, Phone } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function StickySubNav({ onOpenContactModal }) {
  const { businessData } = useData();
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [shortlistCount, setShortlistCount] = useState(48);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShortlistToggle = () => {
    if (isShortlisted) {
      setIsShortlisted(false);
      setShortlistCount(prev => prev - 1);
    } else {
      setIsShortlisted(true);
      setShortlistCount(prev => prev + 1);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: businessData.businessName || "Future Event Organization",
          text: `Check out ${businessData.businessName} - Wedding & Event Planners in Ramapuram, Chennai`,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or fallback
      }
    }
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      alert("Link copied: " + window.location.href);
    }
  };

  return (
    <div className="sticky top-16 z-30 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Navigation Anchors */}
          <div className="flex items-center space-x-6 sm:space-x-8 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <a
              href="#projects-section"
              className="py-4 border-b-2 border-transparent hover:border-[#E91E63] hover:text-[#E91E63] dark:hover:text-[#E91E63] transition-colors"
            >
              Projects
            </a>
            <a
              href="#about-section"
              className="py-4 border-b-2 border-transparent hover:border-[#E91E63] hover:text-[#E91E63] dark:hover:text-[#E91E63] transition-colors"
            >
              About
            </a>
            <a
              href="#reviews-section"
              className="py-4 border-b-2 border-transparent hover:border-[#E91E63] hover:text-[#E91E63] dark:hover:text-[#E91E63] transition-colors"
            >
              Reviews ({businessData.reviewCount || 12})
            </a>
          </div>

          {/* Action buttons matching screenshot */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Shortlist */}
            <button
              onClick={handleShortlistToggle}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium transition-all ${
                isShortlisted
                  ? "bg-pink-50 border-pink-300 text-[#E91E63] dark:bg-pink-950/40 dark:border-pink-800"
                  : "border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-[#E91E63]"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isShortlisted ? "fill-[#E91E63] text-[#E91E63]" : "text-gray-500"}`}
              />
              <span className="hidden sm:inline">Shortlist</span>
              <span className="text-xs opacity-75">({shortlistCount})</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-[#E91E63] text-xs sm:text-sm font-medium transition-colors"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-gray-500" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            {/* Starting Price Tag */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs text-gray-500 dark:text-gray-400">Starting Price</span>
              <span className="text-sm font-bold text-[#E91E63] dark:text-pink-400">
                {businessData.priceStarting || "₹ 50,000"}
              </span>
            </div>

            {/* Prominent Pink Contact Button */}
            <button
              onClick={onOpenContactModal}
              className="bg-[#E91E63] hover:bg-[#D81B60] text-white px-5 py-2 rounded-md font-semibold text-xs sm:text-sm shadow-md transition-transform transform active:scale-95 flex items-center space-x-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
