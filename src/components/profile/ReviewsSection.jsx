import React, { useState } from "react";
import {
  Star,
  Camera,
  CheckCircle,
  MessageSquare,
  ThumbsUp,
  Share2,
  AlertCircle,
  Clock,
  Sparkles,
  BadgeCheck
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { compressImage } from "../../services/storageService";

export default function ReviewsSection({ onOpenLightbox }) {
  const { reviews, businessData, addCustomerReview } = useData();

  // Sort State: "recent" | "highest" | "lowest"
  const [sortBy, setSortBy] = useState("recent");

  // Review Form State
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [spendAmount, setSpendAmount] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Handle Photo attachments (1-5 photos)
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (uploadedPhotos.length + files.length > 5) {
      alert("You can attach up to 5 photos.");
      return;
    }

    try {
      const newUrls = await Promise.all(
        files.map(async (f) => {
          const comp = await compressImage(f, 1200, 1200, 0.8);
          return new Promise((res) => {
            const reader = new FileReader();
            reader.onloadend = () => res(reader.result);
            reader.readAsDataURL(comp);
          });
        })
      );
      setUploadedPhotos((prev) => [...prev, ...newUrls]);
    } catch (err) {
      console.error("Photo upload error:", err);
    }
  };

  const removePhoto = (index) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Review Handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    if (!reviewText.trim()) {
      setSubmitError("Please write your review experience.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await addCustomerReview({
        reviewerName,
        reviewerEmail,
        rating,
        reviewText,
        spendAmount,
        photos: uploadedPhotos,
      });

      setSubmitSuccess(true);
      setReviewerName("");
      setReviewerEmail("");
      setReviewText("");
      setSpendAmount("");
      setUploadedPhotos([]);
      setRating(5);

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sorted reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return (b.dateTimestamp || 0) - (a.dateTimestamp || 0);
  });

  // Calculate rating distribution
  const totalCount = reviews.length || 1;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(r.rating);
    if (ratingCounts[star] !== undefined) ratingCounts[star]++;
  });

  return (
    <section id="reviews-section" className="py-6 space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Reviews for {businessData.businessName || "Future Event Organization"} ({reviews.length})
        </h2>

        {/* Top Split: Rating Summary vs Review Submission Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-gray-200 dark:border-zinc-800">
          {/* Left: Rating Distribution (approx 4 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-[#00A651] text-white px-3.5 py-1.5 rounded-xl font-extrabold text-2xl flex items-center space-x-1 shadow-sm">
                <span>{businessData.rating ? Number(businessData.rating).toFixed(1) : "5.0"}</span>
                <Star className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 dark:text-white block">
                  {reviews.length} Verified Reviews
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  5.0 ★ Google Rating & 100% Client Satisfaction
                </span>
              </div>
            </div>

            {/* Distribution Bars (5 star down to 1 star) */}
            <div className="space-y-2 pt-2 text-xs text-gray-600 dark:text-gray-400">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars] || 0;
                const percent = Math.round((count / totalCount) * 100);
                return (
                  <div key={stars} className="flex items-center space-x-2">
                    <span className="w-4 font-semibold text-right">{stars}</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                    <div className="flex-1 bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#E91E63] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-14 text-right text-gray-500">{count} reviews</span>
                  </div>
                );
              })}
            </div>

            {/* Recommended for Badges matching screenshot */}
            <div className="pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                Clients Highly Recommend For:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full font-medium border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>Quality of Work</span>
                </span>
                <span className="bg-pink-50 dark:bg-pink-950/60 text-[#E91E63] dark:text-pink-300 px-2.5 py-1 rounded-full font-medium border border-pink-200 dark:border-pink-800 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Professionalism</span>
                </span>
                <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full font-medium border border-amber-200 dark:border-amber-800 flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5" />
                  <span>Authentic Catering</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Review Form (approx 7 cols) */}
          <div className="lg:col-span-7 bg-gray-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-gray-200 dark:border-zinc-700/60">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Review {businessData.businessName || "Future Event Organization"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Had an event planned by Kishore? Share your valuable experience with future couples.
            </p>

            {submitSuccess && (
              <div className="mb-3 p-3 rounded-xl bg-green-100 dark:bg-green-950/70 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-200 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Review submitted successfully! Thank you for sharing your feedback.</span>
              </div>
            )}

            {submitError && (
              <div className="mb-3 p-3 rounded-xl bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  Rate Vendor <span className="text-[#E91E63]">*</span>
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? "text-[#E91E63] fill-[#E91E63]"
                            : "text-gray-300 dark:text-zinc-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-[#E91E63] text-sm">
                    {hoverRating || rating}.0 Stars
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  Tell us about your experience <span className="text-[#E91E63]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="How was the decor, team coordination, catering, and execution? Tell us details..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E91E63] focus:border-[#E91E63]"
                />
              </div>

              {/* Name, Email, Spend Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    Your Name <span className="text-[#E91E63]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. B. Abirami"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={reviewerEmail}
                    onChange={(e) => setReviewerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    Approx. Spend (₹)
                  </label>
                  <input
                    type="text"
                    value={spendAmount}
                    onChange={(e) => setSpendAmount(e.target.value)}
                    placeholder="e.g. 1,50,000"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
              </div>

              {/* Photo Previews */}
              {uploadedPhotos.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {uploadedPhotos.map((url, i) => (
                    <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-pink-200">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-0 right-0 bg-red-600 text-white w-4 h-4 flex items-center justify-center text-[10px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions row: Add Photos & Submit Review */}
              <div className="flex items-center justify-between pt-2">
                <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-100 text-gray-700 dark:text-gray-300 font-semibold transition-colors">
                  <Camera className="w-3.5 h-3.5 text-[#E91E63]" />
                  <span>Add Photos ({uploadedPhotos.length}/5)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#E91E63] hover:bg-[#D81B60] disabled:opacity-60 text-white font-bold px-5 py-2 rounded-lg shadow-sm transition-transform transform active:scale-95 text-xs sm:text-sm"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Reviews List Toolbar: Sort Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            Customer Testimonials ({sortedReviews.length})
          </span>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews Cards List matching screenshot */}
        <div className="space-y-4 pt-4">
          {sortedReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 rounded-xl border transition-all ${
                rev.isPinned
                  ? "border-pink-300 dark:border-pink-900 bg-pink-50/20 dark:bg-pink-950/10"
                  : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              }`}
            >
              {/* Header: User avatar, Name, Rating Badge */}
              <div className="flex justify-between items-start mb-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#E91E63]/10 text-[#E91E63] font-bold flex items-center justify-center text-sm border border-pink-200 dark:border-pink-900">
                    {rev.reviewerName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {rev.reviewerName}
                      </span>
                      {rev.badge && (
                        <span className="text-[10px] font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                          {rev.badge}
                        </span>
                      )}
                      {rev.isPinned && (
                        <span className="text-[10px] font-bold bg-[#E91E63] text-white px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 block">{rev.reviewDate || "Recent"}</span>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center space-x-1 bg-[#00A651] text-white px-2.5 py-1 rounded-md font-bold text-xs shadow-sm">
                  <span>{Number(rev.rating).toFixed(1)}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3 whitespace-pre-line">
                "{rev.reviewText}"
              </p>

              {/* Spend Amount & Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {rev.spendAmount && (
                  <span className="text-xs font-semibold text-[#E91E63] dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded">
                    Spend: {rev.spendAmount}
                  </span>
                )}
                {rev.tags?.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Attached Photos */}
              {rev.photos && rev.photos.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mb-3">
                  {rev.photos.map((pUrl, pIdx) => (
                    <img
                      key={pIdx}
                      src={pUrl}
                      alt="Review attachment"
                      onClick={() => onOpenLightbox(rev.photos.map(p => ({ url: p, caption: `Photo from ${rev.reviewerName}` })), pIdx)}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 dark:border-zinc-700 cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  ))}
                </div>
              )}

              {/* Owner Response (by Kishore) matching Google Maps screenshot */}
              {rev.ownerResponse && (
                <div className="mt-3 p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border-l-4 border-[#E91E63] text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-gray-900 dark:text-white">
                    <MessageSquare className="w-3.5 h-3.5 text-[#E91E63]" />
                    <span>Response from Kishore (Owner)</span>
                    {rev.ownerResponseDate && (
                      <span className="text-gray-400 font-normal text-[11px]">· {rev.ownerResponseDate}</span>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "{rev.ownerResponse}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
