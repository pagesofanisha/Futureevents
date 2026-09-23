import React from "react";
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Clock,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function ContactModal({ isOpen, onClose }) {
  const { contactData, businessData } = useData();

  if (!isOpen) return null;

  const rawPhone = contactData.rawPhone || contactData.phoneNumber?.replace(/[^0-9+]/g, "") || "+919360455217";
  const whatsappUrl = `https://wa.me/${rawPhone.replace("+", "")}?text=${encodeURIComponent(`Hi ${businessData.businessName || "Future Event Organization"}, I would like to inquire about event planning services.`)}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#E91E63] text-white p-5 flex justify-between items-center relative">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold">Contact {businessData.businessName}</span>
              <ShieldCheck className="w-5 h-5 text-yellow-300" />
            </div>
            <p className="text-xs text-pink-100 mt-0.5">
              Manager: {businessData.manager || "Kishore"} · Ramapuram, Chennai
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-pink-700/60 hover:bg-pink-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Direct Phone & WhatsApp CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Call */}
            <a
              href={`tel:${rawPhone}`}
              className="flex items-center justify-center space-x-2 bg-[#00A651] hover:bg-[#008c44] text-white py-3 px-4 rounded-xl font-semibold shadow-sm transition-transform active:scale-95 text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call {contactData.phoneNumber || "+91 93604 55217"}</span>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl font-semibold shadow-sm transition-transform active:scale-95 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 space-y-3">
            {/* Email */}
            <a
              href={`mailto:${contactData.email || "futureeventskishore@gmail.com"}?subject=Event%20Inquiry%20-%20Future%20Events`}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-800 dark:text-gray-200"
            >
              <div className="w-9 h-9 rounded-lg bg-pink-50 dark:bg-pink-950/60 flex items-center justify-center text-[#E91E63]">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Direct Email</span>
                <span className="text-sm font-medium truncate block">{contactData.email || "futureeventskishore@gmail.com"}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>

            {/* Address & Google Maps */}
            <a
              href={contactData.googleMapsLink || "https://maps.google.com/?q=11th+Cross+St,+Venkateshwara+Nagar,+Ramapuram,+Chennai,+Tamil+Nadu+600089"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-800 dark:text-gray-200"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Studio & Office Address</span>
                <span className="text-sm font-medium leading-snug block">
                  {contactData.address || "11th Cross St, Venkateshwara Nagar, Ramapuram, Chennai, Tamil Nadu 600089"}
                </span>
                <span className="text-xs text-[#E91E63] font-semibold mt-1 inline-flex items-center space-x-1">
                  <span>Open in Google Maps (25HF+XV)</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>

            {/* Hours */}
            <div className="flex items-center space-x-3 p-3 text-gray-700 dark:text-gray-300">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Operating Hours</span>
                <span className="text-sm font-medium">
                  {contactData.workingHours || "Open Daily · 7:00 AM – 10:00 PM"}
                </span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-gray-200 dark:border-zinc-800 pt-3 flex justify-center space-x-6">
            {contactData.instagram && (
              <a
                href={contactData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 text-xs font-medium text-pink-600 hover:text-pink-700"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
            )}
            {contactData.facebook && (
              <a
                href={contactData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 dark:bg-zinc-800/60 px-6 py-3 text-center border-t border-gray-100 dark:border-zinc-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            WedMeGood Verified Vendor · Zero commission booking directly with Kishore
          </p>
        </div>
      </div>
    </div>
  );
}
