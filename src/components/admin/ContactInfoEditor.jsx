import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  ExternalLink,
  Save,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function ContactInfoEditor() {
  const { contactData, updateContact } = useData();

  const [formData, setFormData] = useState({
    phoneNumber: contactData.phoneNumber || "+91 93604 55217",
    whatsappNumber: contactData.whatsappNumber || "+91 93604 55217",
    rawPhone: contactData.rawPhone || "+919360455217",
    email: contactData.email || "futureeventskishore@gmail.com",
    address: contactData.address || "11th Cross St, Venkateshwara Nagar, Ramapuram, Chennai, Tamil Nadu 600089",
    plusCode: contactData.plusCode || "25HF+XV Chennai, Tamil Nadu",
    googleMapsLink: contactData.googleMapsLink || "https://maps.google.com/?q=11th+Cross+St,+Venkateshwara+Nagar,+Ramapuram,+Chennai,+Tamil+Nadu+600089",
    instagram: contactData.instagram || "https://instagram.com/futureevents_chennai",
    facebook: contactData.facebook || "https://facebook.com/futureeventsorganization",
    workingHours: contactData.workingHours || "Open Daily · 7:00 AM – 10:00 PM"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Auto-extract raw numeric phone
      const cleanRaw = formData.phoneNumber.replace(/[^0-9+]/g, "");
      const finalData = {
        ...formData,
        rawPhone: cleanRaw.startsWith("+") ? cleanRaw : `+91${cleanRaw}`
      };

      await updateContact(finalData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      alert("Error saving contact info: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 dark:border-zinc-800 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Studio Contact Information Manager
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Configure direct client communication channels. Test each button to ensure links route properly.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Contact details updated successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Row 1: WhatsApp & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">
                WhatsApp Hotline <span className="text-[#E91E63]">*</span>
              </label>
              <a
                href={`https://wa.me/${formData.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E91E63] hover:underline flex items-center space-x-1 font-semibold"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                placeholder="+91 93604 55217"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">
                Direct Calling Phone <span className="text-[#E91E63]">*</span>
              </label>
              <a
                href={`tel:${formData.phoneNumber.replace(/[^0-9+]/g, "")}`}
                className="text-emerald-600 hover:underline flex items-center space-x-1 font-semibold"
              >
                <span>Test Dial</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="+91 93604 55217"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <Phone className="w-4 h-4 text-[#00A651] absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Row 2: Email & Working Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">
                Official Email Address
              </label>
              <a
                href={`mailto:${formData.email}`}
                className="text-[#E91E63] hover:underline flex items-center space-x-1 font-semibold"
              >
                <span>Test Mail</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="futureeventskishore@gmail.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <Mail className="w-4 h-4 text-[#E91E63] absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Operating Hours
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => handleInputChange("workingHours", e.target.value)}
                placeholder="Open Daily · 7:00 AM – 10:00 PM"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <Clock className="w-4 h-4 text-amber-500 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Row 3: Address & Google Maps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Studio Location Address
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="11th Cross St, Venkateshwara Nagar, Ramapuram, Chennai, Tamil Nadu 600089"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">
                Google Maps URL / Plus Code
              </label>
              <a
                href={formData.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E91E63] hover:underline flex items-center space-x-1 font-semibold"
              >
                <span>Open Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <textarea
              rows={2}
              value={formData.googleMapsLink}
              onChange={(e) => handleInputChange("googleMapsLink", e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>
        </div>

        {/* Row 4: Social Links (Instagram & Facebook) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">
                Instagram URL
              </label>
              {formData.instagram && (
                <a
                  href={formData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:underline flex items-center space-x-1 font-semibold"
                >
                  <span>Verify Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                placeholder="https://instagram.com/futureevents_chennai"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <Instagram className="w-4 h-4 text-pink-600 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">
                Facebook Page URL
              </label>
              {formData.facebook && (
                <a
                  href={formData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center space-x-1 font-semibold"
                >
                  <span>Verify Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                placeholder="https://facebook.com/futureeventsorganization"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
              />
              <Facebook className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#E91E63] hover:bg-[#D81B60] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-transform transform active:scale-95 flex items-center space-x-2 text-xs sm:text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Updating Contact..." : "Save Contact Information"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
