import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Camera,
  Heart,
  Share2,
  Edit3,
  Phone,
  ShieldCheck
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function HeroSlideshow({ onOpenLightbox, onOpenContactModal }) {
  const { businessData, contactData, albums } = useData();

  // Aggregate all photos from albums for the hero gallery slideshow (excluding any dummy unsplash photos)
  const allPhotos = albums
    .flatMap((a) => a.photos || [])
    .filter((p) => p.url && !p.url.includes("unsplash.com"));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShortlisted, setIsShortlisted] = useState(false);

  const totalImages = allPhotos.length;
  const currentPhoto = totalImages > 0 ? allPhotos[currentIndex] : null;

  // Automatic Slideshow (auto-rotates every 3.5s, manual arrow buttons still available)
  React.useEffect(() => {
    if (totalImages <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [totalImages, currentIndex]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (totalImages === 0) return;
    setCurrentIndex(prev => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (totalImages === 0) return;
    setCurrentIndex(prev => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: businessData.businessName,
          text: `Check out ${businessData.businessName} in Ramapuram, Chennai`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="w-full flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden transition-colors">
      {/* Slideshow Display Area with Horizontal Sliding Track */}
      <div className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] bg-zinc-900 group overflow-hidden select-none">
        {totalImages > 0 ? (
          <>
            {/* Sliding Track that moves smoothly from right to left */}
            <div
              className="flex h-full w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {allPhotos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  className="w-full h-full flex-shrink-0 relative cursor-pointer"
                  onClick={() => onOpenLightbox(allPhotos, idx)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || "Future Events Stage Setup"}
                    className="w-full h-full object-cover"
                    loading={idx <= 3 ? "eager" : "lazy"}
                  />
                  {/* Gradient Overlays for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Manual Navigation Left Button - Pink background */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E91E63] hover:bg-[#D81B60] text-white flex items-center justify-center shadow-lg transition-transform transform active:scale-90 focus:outline-none"
              title="Previous Photo"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Manual Navigation Right Button - Pink background */}
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E91E63] hover:bg-[#D81B60] text-white flex items-center justify-center shadow-lg transition-transform transform active:scale-90 focus:outline-none"
              title="Next Photo"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dynamic Image Counter: "Image X of Y" */}
            <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
              Image {currentIndex + 1} of {totalImages}
            </div>

            {/* Bottom Caption Pill */}
            {currentPhoto?.caption && (
              <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                <span className="inline-block bg-black/60 backdrop-blur-md text-white text-xs sm:text-sm px-3.5 py-1 rounded-lg border border-white/10 max-w-xl truncate">
                  {currentPhoto.caption}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-zinc-900 via-zinc-850 to-zinc-900 text-white relative overflow-hidden select-none">
            {/* Ambient decorative lighting */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#E91E63]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E91E63] to-pink-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-pink-500/25">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {businessData.businessName || "Future Event Organization"}
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                Ramapuram, Chennai · WedMeGood Certified Partner
                <br />
                Weddings · Traditional Baby Shower · Stage & Mandap Decor · DJ · Catering
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={onOpenContactModal}
                  className="bg-[#E91E63] hover:bg-[#D81B60] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-transform active:scale-95"
                >
                  Contact Kishore
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Under Hero Information Section matching WedMeGood screenshot */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Title & Star Rating Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {businessData.businessName || "Future Event Organization"}
              </h1>
              <ShieldCheck className="w-6 h-6 text-[#E91E63] flex-shrink-0" title="WedMeGood Certified Partner" />
            </div>

            {/* Location & Map Link */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <MapPin className="w-4 h-4 text-[#E91E63] flex-shrink-0" />
              <span>Ramapuram, Chennai</span>
              <a
                href={contactData.googleMapsLink || "https://maps.google.com/?q=11th+Cross+St,+Venkateshwara+Nagar,+Ramapuram,+Chennai,+Tamil+Nadu+600089"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E91E63] font-medium hover:underline text-xs"
              >
                (View on Map)
              </a>
            </div>
          </div>

          {/* Green Star Rating Badge */}
          <div className="flex items-center space-x-2 self-start sm:self-center">
            <div className="flex items-center space-x-1 bg-[#00A651] text-white px-3 py-1.5 rounded-lg font-bold text-base shadow-sm">
              <Star className="w-4 h-4 fill-white" />
              <span>{businessData.rating ? Number(businessData.rating).toFixed(1) : "5.0"}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-800 dark:text-gray-200 block">{businessData.reviewCount || 12} reviews</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% Recommended</span>
            </div>
          </div>
        </div>

        {/* Action icons bar matching reference: Photos count, Contact, Shortlist, Write Review, Share */}
        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onOpenLightbox(allPhotos, 0)}
              className="flex items-center space-x-1.5 hover:text-[#E91E63] transition-colors"
            >
              <Camera className="w-4 h-4 text-[#E91E63]" />
              <span>{totalImages} Photos</span>
            </button>

            <button
              onClick={onOpenContactModal}
              className="flex items-center space-x-1.5 hover:text-[#00A651] transition-colors text-emerald-600 dark:text-emerald-400"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Vendor</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsShortlisted(!isShortlisted)}
              className="flex items-center space-x-1.5 hover:text-[#E91E63] transition-colors"
            >
              <Heart className={`w-4 h-4 ${isShortlisted ? "text-[#E91E63] fill-[#E91E63]" : ""}`} />
              <span>{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
            </button>

            <a
              href="#reviews-section"
              className="flex items-center space-x-1.5 hover:text-[#E91E63] transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Write a Review</span>
            </a>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 hover:text-[#E91E63] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
