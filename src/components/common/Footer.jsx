import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle,
  Heart
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function Footer() {
  const { businessData, contactData } = useData();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubmitted(false), 3000);
    }
  };

  return (
    <footer className="bg-white dark:bg-zinc-950 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-zinc-800 transition-colors duration-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top summary row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-200 dark:border-zinc-800 text-sm">
          {/* Col 1: Platform & Business */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[#E91E63]">
                {businessData.businessName || "Future Event Organization"}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Chennai's premier wedding and event planning team managed by Kishore. Making your dream celebrations stress-free and magical with bespoke themes and catering.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified WedMeGood Vendor · Ramapuram</span>
            </div>
          </div>

          {/* Col 2: Studio Location */}
          <div className="space-y-2">
            <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs block">
              Registered Studio
            </span>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {contactData.address || "11th Cross St, Venkateshwara Nagar, Ramapuram, Chennai, Tamil Nadu 600089"}
            </p>
            <p className="text-xs text-gray-500">
              Plus Code: {contactData.plusCode || "25HF+XV Chennai, Tamil Nadu"}
            </p>
            <a
              href={contactData.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-medium text-[#E91E63] hover:underline"
            >
              Directions on Google Maps →
            </a>
          </div>

          {/* Col 3: Direct Connect */}
          <div className="space-y-2">
            <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs block">
              Direct Contact
            </span>
            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#E91E63]" />
                <a href={`tel:${contactData.rawPhone || "+919360455217"}`} className="hover:underline">
                  {contactData.phoneNumber || "+91 93604 55217"}
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#E91E63]" />
                <a href={`mailto:${contactData.email || "futureeventskishore@gmail.com"}`} className="hover:underline truncate">
                  {contactData.email || "futureeventskishore@gmail.com"}
                </a>
              </p>
              <p className="text-gray-500">
                Operating: {contactData.workingHours || "7:00 AM – 10:00 PM"}
              </p>
            </div>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              {contactData.facebook && (
                <a
                  href={contactData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {contactData.instagram && (
                <a
                  href={contactData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 4: Blog Alerts & Newsletter */}
          <div className="space-y-3">
            <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs block">
              Get Latest Event Alerts
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Receive wedding trends, decor inspirations, and special seasonal packages from Kishore.
            </p>
            <form onSubmit={handleNewsletter} className="flex space-x-1.5">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full text-xs px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <button
                type="submit"
                className="bg-[#E91E63] hover:bg-[#D81B60] text-white px-3.5 py-2 rounded-md text-xs font-semibold shadow-sm transition-colors"
              >
                Submit
              </button>
            </form>
            {newsletterSubmitted && (
              <p className="text-xs text-green-600 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Thank you! We will be in touch.</span>
              </p>
            )}
            <div className="pt-1">
              <Link
                to="/admin/login"
                className="inline-block text-xs font-medium text-gray-500 hover:text-[#E91E63] transition-colors"
              >
                Vendor Management Portal →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-1">
            <span>© 2026 Future Event Organization. All rights reserved. Built with</span>
            <Heart className="w-3.5 h-3.5 text-[#E91E63] fill-[#E91E63]" />
            <span>for Kishore & Family.</span>
          </div>
          <div className="flex space-x-4">
            <a href="#about-section" className="hover:underline">Cancellation Policy</a>
            <span>·</span>
            <a href="#about-section" className="hover:underline">Decor Policy</a>
            <span>·</span>
            <a href="#about-section" className="hover:underline">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
