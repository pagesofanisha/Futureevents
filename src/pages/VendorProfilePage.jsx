import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import Navbar from "../components/common/Navbar";
import StickySubNav from "../components/common/StickySubNav";
import HeroSlideshow from "../components/profile/HeroSlideshow";
import InquiryCard from "../components/profile/InquiryCard";
import AlbumsStrip from "../components/profile/AlbumsStrip";
import PortfolioGrid from "../components/profile/PortfolioGrid";
import SimilarVendors from "../components/profile/SimilarVendors";
import AboutSection from "../components/profile/AboutSection";
import ReviewsSection from "../components/profile/ReviewsSection";
import Footer from "../components/common/Footer";
import LightboxModal from "../components/common/LightboxModal";
import ContactModal from "../components/common/ContactModal";
import { useData } from "../context/DataContext";

export default function VendorProfilePage() {
  const { businessData } = useData();

  // Modal States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (photos, index = 0) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      {/* 1. Header & Navigation */}
      <Navbar />

      {/* 2. Breadcrumbs */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 py-2 sm:py-2.5 px-3 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap">
          <a href="#" className="hover:text-[#E91E63]">Home</a>
          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <a href="#" className="hover:text-[#E91E63]">Vendors</a>
          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <a href="#" className="hover:text-[#E91E63]">Wedding Planners</a>
          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <a href="#" className="hover:text-[#E91E63]">Wedding Planners Chennai</a>
          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[180px]">
            {businessData.businessName || "Future Event Organization"}
          </span>
        </div>
      </div>

      {/* 3. Sticky Sub-Nav (Compact & sleek on mobile, no overlapping) */}
      <StickySubNav onOpenContactModal={() => setIsContactModalOpen(true)} />

      {/* 4. Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Hero Section: 60% Left Slideshow + 40% Right Inquiry Form */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left: Slideshow Hero (auto-playing + manual arrows) */}
          <div className="lg:col-span-7 w-full">
            <HeroSlideshow
              onOpenLightbox={handleOpenLightbox}
              onOpenContactModal={() => setIsContactModalOpen(true)}
            />
          </div>

          {/* Right: Inquiry Card (lg:sticky to avoid mobile screen takeover) */}
          <div id="inquiry-form" className="lg:col-span-5 w-full lg:sticky lg:top-32">
            <InquiryCard onOpenContactModal={() => setIsContactModalOpen(true)} />
          </div>
        </section>

        {/* 5. Albums Strip: "Albums Uploaded from: Chennai (N)" */}
        <AlbumsStrip />

        {/* 6. Pinterest-Style Portfolio Box - MOVED UP BEFORE ABOUT AS REQUESTED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left 8 cols: Pinterest Portfolio Grid */}
          <div className="lg:col-span-8 w-full">
            <PortfolioGrid onOpenLightbox={handleOpenLightbox} />
          </div>

          {/* Right 4 cols: Similar Vendors in Chennai */}
          <div className="lg:col-span-4 w-full lg:sticky lg:top-32">
            <SimilarVendors />
          </div>
        </div>

        {/* 7. About Section: Kishore description, planning since 2018, policies, FAQ accordion */}
        <AboutSection />

        {/* 8. Reviews Section: Rating distribution, review submission, testimonials */}
        <ReviewsSection onOpenLightbox={handleOpenLightbox} />
      </main>

      {/* 9. Footer */}
      <Footer />

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={lightboxPhotos}
        currentIndex={lightboxIndex}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />

      {/* Contact Details Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
