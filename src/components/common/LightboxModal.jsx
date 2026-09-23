import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function LightboxModal({
  isOpen,
  onClose,
  photos = [],
  currentIndex = 0,
  onNavigate
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, currentIndex, photos.length]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    const prev = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    onNavigate(prev);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    const next = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    onNavigate(next);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-sm fade-in"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center text-white z-10" onClick={(e) => e.stopPropagation()}>
        <div className="text-sm font-medium opacity-90">
          Photo {currentIndex + 1} of {photos.length}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
          title="Close Lightbox (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        className="relative flex-1 flex items-center justify-center max-h-[80vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-[#E91E63] text-white hover:bg-[#D81B60] transition-transform transform active:scale-90 shadow-lg focus:outline-none"
          title="Previous Photo (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* The Image */}
        <div className="relative max-h-full max-w-5xl flex flex-col items-center">
          <img
            src={currentPhoto.url || currentPhoto}
            alt={currentPhoto.caption || "Event Photo"}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-opacity duration-300"
          />
          {currentPhoto.caption && (
            <p className="mt-3 text-center text-white/90 text-sm font-light max-w-2xl px-4 py-1.5 bg-black/60 rounded-full backdrop-blur-md">
              {currentPhoto.caption}
            </p>
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-[#E91E63] text-white hover:bg-[#D81B60] transition-transform transform active:scale-90 shadow-lg focus:outline-none"
          title="Next Photo (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div
        className="max-w-4xl mx-auto w-full overflow-x-auto py-2 flex space-x-2 justify-center z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.slice(0, 15).map((p, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(idx)}
            className={`relative flex-shrink-0 w-14 h-14 rounded-md overflow-hidden transition-all duration-200 ${
              idx === currentIndex ? "ring-2 ring-[#E91E63] scale-105 opacity-100" : "opacity-40 hover:opacity-80"
            }`}
          >
            <img
              src={p.url || p}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
