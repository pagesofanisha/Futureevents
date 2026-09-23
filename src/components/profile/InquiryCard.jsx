import React, { useState } from "react";
import {
  MessageCircle,
  Mail,
  Phone,
  Eye,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function InquiryCard({ onOpenContactModal }) {
  const { businessData, contactData } = useData();

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [details, setDetails] = useState("");
  const [notifyOnWhatsApp, setNotifyOnWhatsApp] = useState(true);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const rawPhone = contactData.rawPhone || contactData.phoneNumber?.replace(/[^0-9+]/g, "") || "+919360455217";
  const destinationNumber = rawPhone.replace("+", "");

  const validateForm = () => {
    if (!fullName.trim()) {
      setFormError("Please enter your full name.");
      return false;
    }
    const cleanPhone = mobileNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!eventDate) {
      setFormError("Please select your tentative event date.");
      return false;
    }
    setFormError("");
    return true;
  };

  // 1. Send via WhatsApp (Pink)
  const handleWhatsAppSend = () => {
    if (!validateForm()) return;

    const message = `Hi ${businessData.businessName || "Future Event Organization"}, I'm interested in ${eventType} for ${eventDate}. Please contact me at +91 ${mobileNumber.trim()}.${details ? ` Notes: ${details}` : ""}`;
    const url = `https://wa.me/${destinationNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4000);
  };

  // 2. Send via Email (Pink)
  const handleEmailSend = () => {
    if (!validateForm()) return;

    const subject = `Event Inquiry - ${eventType} - ${fullName}`;
    const body = `Hi ${businessData.businessName},\n\nI would like to inquire about event management services.\n\nName: ${fullName}\nPhone: +91 ${mobileNumber}\nEmail: ${emailAddress || "Not provided"}\nEvent Type: ${eventType}\nEvent Date: ${eventDate}\nWhatsApp Notifications: ${notifyOnWhatsApp ? "Yes" : "No"}\n\nAdditional Details:\n${details || "None provided"}\n\nLooking forward to hearing from Kishore.`;

    const mailtoUrl = `mailto:${contactData.email || "futureeventskishore@gmail.com"}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4000);
  };

  // 3. Call Now (Green)
  const handleCallNow = () => {
    window.location.href = `tel:${rawPhone}`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-5 sm:p-6 transition-colors">
      {/* Starting Price Header Card */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block">
            Starting Price
          </span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-2xl font-black text-[#E91E63] dark:text-pink-400">
              {businessData.priceStarting || "₹ 50,000"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              (Planning Fee)
            </span>
          </div>
        </div>

        {/* Quick Top Green View Contact button */}
        <button
          onClick={onOpenContactModal}
          className="flex items-center space-x-1.5 bg-[#00A651] hover:bg-[#008c44] text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition-transform active:scale-95"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>View Contact</span>
        </button>
      </div>

      {/* Inquiry Form Heading (dynamic from backend) */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Hi {businessData.businessName || "Future Event Organization"}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Share your celebration plans to receive a personalized quote directly from Kishore.
        </p>
      </div>

      {/* Error / Success feedback */}
      {formError && (
        <div className="mb-4 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="mb-4 p-2.5 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Inquiry prepared! Opening your communication app...</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-3.5 text-xs">
        {/* Full Name */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Full Name <span className="text-[#E91E63]">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Anandha Kumar"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E91E63] focus:border-[#E91E63]"
          />
        </div>

        {/* Mobile Number with India +91 */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Mobile Number <span className="text-[#E91E63]">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium">
              🇮🇳 +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="98765 43210"
              className="w-full px-3 py-2 rounded-r-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E91E63] focus:border-[#E91E63]"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Email Address <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="name@gmail.com"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E91E63] focus:border-[#E91E63]"
          />
        </div>

        {/* Event Type & Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Event Type Dropdown */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E91E63] focus:border-[#E91E63]"
            >
              <option value="Wedding">Wedding</option>
              <option value="Engagement">Engagement</option>
              <option value="Baby Shower (Valaikappu)">Baby Shower (Valaikappu)</option>
              <option value="Birthday Party">Birthday Party</option>
              <option value="Reception & Sangeet">Reception & Sangeet</option>
              <option value="Holy Communion">Holy Communion</option>
              <option value="Other">Other Celebration</option>
            </select>
          </div>

          {/* Event Date Picker */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Event Date <span className="text-[#E91E63]">*</span>
            </label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E91E63] focus:border-[#E91E63]"
            />
          </div>
        </div>

        {/* Message / Details */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Event Details / Message
          </label>
          <textarea
            rows={2}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Tell Kishore about your venue, guest count, or decor preferences..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#E91E63] focus:border-[#E91E63]"
          />
        </div>

        {/* Notify on WhatsApp Toggle Switch */}
        <div className="flex items-center justify-between py-1">
          <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">
            Notify me on WhatsApp
          </span>
          <button
            type="button"
            onClick={() => setNotifyOnWhatsApp(!notifyOnWhatsApp)}
            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              notifyOnWhatsApp ? "bg-[#00A651]" : "bg-gray-300 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                notifyOnWhatsApp ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="mt-5 space-y-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
        {/* Send via WhatsApp (Pink) */}
        <button
          onClick={handleWhatsAppSend}
          className="w-full flex items-center justify-center space-x-2 bg-[#E91E63] hover:bg-[#D81B60] text-white py-2.5 px-4 rounded-xl font-bold shadow-md transition-transform transform active:scale-95 text-xs sm:text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Send via WhatsApp</span>
        </button>

        {/* Send via Email (Pink) */}
        <button
          onClick={handleEmailSend}
          className="w-full flex items-center justify-center space-x-2 bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-950/70 text-[#E91E63] dark:text-pink-300 border border-pink-200 dark:border-pink-900 py-2.5 px-4 rounded-xl font-bold transition-colors text-xs sm:text-sm"
        >
          <Mail className="w-4 h-4" />
          <span>Send via Email</span>
        </button>

        {/* Bottom row: Call Now (Green) & View Contact (Green) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Call Now */}
          <button
            onClick={handleCallNow}
            className="flex items-center justify-center space-x-1.5 bg-[#00A651] hover:bg-[#008c44] text-white py-2 px-3 rounded-xl font-semibold shadow-sm transition-transform active:scale-95 text-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Now</span>
          </button>

          {/* View Contact */}
          <button
            onClick={onOpenContactModal}
            className="flex items-center justify-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-950 text-[#00A651] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 py-2 px-3 rounded-xl font-semibold transition-colors text-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
}
