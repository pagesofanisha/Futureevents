import React, { useState } from "react";
import {
  Star,
  Search,
  Filter,
  Pin,
  Trash2,
  Edit3,
  MessageSquare,
  Check,
  X,
  Eye,
  CornerDownRight
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function ReviewsManager() {
  const { reviews, updateReview, deleteReview } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [pinnedFilter, setPinnedFilter] = useState("all");

  // Edit Review Modal / State
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState("");

  // Owner Response State
  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // View full review modal
  const [viewingReview, setViewingReview] = useState(null);

  // Filtered & Searched Reviews
  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch =
      rev.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.reviewText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === "all" || Math.round(rev.rating) === Number(ratingFilter);

    const matchesPinned =
      pinnedFilter === "all" ||
      (pinnedFilter === "pinned" && rev.isPinned) ||
      (pinnedFilter === "unpinned" && !rev.isPinned);

    return matchesSearch && matchesRating && matchesPinned;
  });

  // Action 1: Pin / Unpin
  const handleTogglePin = async (rev) => {
    await updateReview(rev.id, { isPinned: !rev.isPinned });
  };

  // Action 2: Delete Review
  const handleDeleteReview = async (revId, name) => {
    if (window.confirm(`Permanently delete review by "${name}" from frontend and database?`)) {
      await deleteReview(revId);
    }
  };

  // Action 3: Edit Review Text / Rating
  const handleStartEdit = (rev) => {
    setEditingReview(rev);
    setEditRating(rev.rating);
    setEditText(rev.reviewText);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    await updateReview(editingReview.id, {
      rating: editRating,
      reviewText: editText
    });
    setEditingReview(null);
  };

  // Action 4: Submit Owner Reply
  const handleSaveReply = async (revId) => {
    if (!replyText.trim()) return;
    await updateReview(revId, {
      ownerResponse: replyText.trim(),
      ownerResponseDate: "Just now"
    });
    setReplyingReviewId(null);
    setReplyText("");
  };

  const handleDeleteReply = async (revId) => {
    if (window.confirm("Remove owner response?")) {
      await updateReview(revId, {
        ownerResponse: null,
        ownerResponseDate: null
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search/Filter Toolbar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-zinc-800 gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Customer Reviews Moderation ({reviews.length})
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pin top wedding testimonials to the top, post owner responses by Kishore, and moderate ratings.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client name or feedback..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Ratings (1 - 5 Stars)</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars Only</option>
            <option value="2">2 Stars Only</option>
            <option value="1">1 Star Only</option>
          </select>

          {/* Pinned Filter */}
          <select
            value={pinnedFilter}
            onChange={(e) => setPinnedFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Reviews (Pinned & Regular)</option>
            <option value="pinned">Pinned / Featured Only</option>
            <option value="unpinned">Unpinned Only</option>
          </select>
        </div>
      </div>

      {/* Reviews Table / Card View */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-zinc-800/80 text-[11px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Review Feedback</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {filteredReviews.map((rev) => (
                <tr
                  key={rev.id}
                  className={`hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors ${
                    rev.isPinned ? "bg-pink-50/20 dark:bg-pink-950/10" : ""
                  }`}
                >
                  {/* Reviewer Name */}
                  <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span>{rev.reviewerName}</span>
                      {rev.isPinned && (
                        <Pin className="w-3.5 h-3.5 text-[#E91E63] fill-[#E91E63]" title="Pinned to Top" />
                      )}
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 bg-[#00A651] text-white px-2 py-0.5 rounded text-[11px] font-bold w-max">
                      <span>{Number(rev.rating).toFixed(1)}</span>
                      <Star className="w-3 h-3 fill-white" />
                    </div>
                  </td>

                  {/* Review Text & Owner Response */}
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="line-clamp-2 text-gray-800 dark:text-gray-200">
                      "{rev.reviewText}"
                    </p>

                    {/* Owner reply row if exists */}
                    {rev.ownerResponse && (
                      <div className="mt-1.5 p-2 rounded bg-gray-100 dark:bg-zinc-800/80 text-[11px] text-gray-700 dark:text-gray-300 border-l-2 border-[#E91E63] flex justify-between items-start">
                        <div>
                          <span className="font-bold text-[#E91E63]">Kishore: </span>
                          <span>"{rev.ownerResponse}"</span>
                        </div>
                        <button
                          onClick={() => handleDeleteReply(rev.id)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                          title="Delete response"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Inline Reply Box */}
                    {replyingReviewId === rev.id && (
                      <div className="mt-2 p-2 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900 space-y-1.5">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write reply from Kishore (Owner)..."
                          className="w-full text-xs p-1.5 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        />
                        <div className="flex justify-end space-x-1.5">
                          <button
                            onClick={() => setReplyingReviewId(null)}
                            className="px-2 py-1 rounded text-gray-500 hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveReply(rev.id)}
                            className="bg-[#E91E63] text-white px-3 py-1 rounded font-bold hover:bg-[#D81B60]"
                          >
                            Post Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-gray-400">
                    {rev.reviewDate || "Recent"}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* Pin/Unpin */}
                      <button
                        onClick={() => handleTogglePin(rev)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          rev.isPinned
                            ? "bg-pink-100 dark:bg-pink-950 border-pink-300 text-[#E91E63]"
                            : "border-gray-200 dark:border-zinc-700 text-gray-400 hover:text-[#E91E63]"
                        }`}
                        title={rev.isPinned ? "Unpin Review" : "Pin to Top"}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      {/* Reply */}
                      <button
                        onClick={() => {
                          setReplyingReviewId(rev.id);
                          setReplyText(rev.ownerResponse || "");
                        }}
                        className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-400 hover:text-emerald-600 transition-colors"
                        title="Add/Edit Owner Reply"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleStartEdit(rev)}
                        className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Review Text/Rating"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteReview(rev.id, rev.reviewerName)}
                        className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-lg w-full border border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                Edit Review by {editingReview.reviewerName}
              </h3>
              <button onClick={() => setEditingReview(null)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Rating
              </label>
              <select
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              >
                <option value={5}>5.0 Stars (Excellent)</option>
                <option value={4}>4.0 Stars (Very Good)</option>
                <option value={3}>3.0 Stars (Average)</option>
                <option value={2}>2.0 Stars</option>
                <option value={1}>1.0 Star</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Review Content
              </label>
              <textarea
                rows={4}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingReview(null)}
                className="px-3 py-1.5 rounded-lg border text-xs text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-[#E91E63] text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-[#D81B60]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
