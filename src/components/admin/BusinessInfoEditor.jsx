import React, { useState } from "react";
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  Briefcase,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Camera,
  Music,
  Utensils
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { uploadImageFile } from "../../services/storageService";

export default function BusinessInfoEditor() {
  const { businessData, updateBusiness } = useData();

  const [formData, setFormData] = useState({
    businessName: businessData.businessName || "Future Event Organization",
    manager: businessData.manager || "Kishore",
    logoUrl: businessData.logoUrl || "",
    description: businessData.description || "",
    yearsOfExperience: businessData.yearsOfExperience || 6,
    planningSince: businessData.planningSince || 2018,
    priceStarting: businessData.priceStarting || "₹ 99,000",
    decorPolicy: businessData.decorPolicy || "",
    cancellationPolicy: businessData.cancellationPolicy || "",
    feeStructure: businessData.feeStructure || "",
    servicesProvided: businessData.servicesProvided || [],
    serviceAreas: businessData.serviceAreas || [],
    teamMembers: businessData.teamMembers || [],
    vendors: businessData.vendors || []
  });

  const [newService, setNewService] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newTeamMember, setNewTeamMember] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Logo file upload handler
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const storagePath = `businesses/future_events_chennai/logo/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const downloadUrl = await uploadImageFile(file, storagePath);
      setFormData((prev) => ({ ...prev, logoUrl: downloadUrl }));
    } catch (err) {
      alert("Failed to upload logo: " + err.message);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Add / Remove Service
  const handleAddService = () => {
    if (!newService.trim()) return;
    setFormData((prev) => ({
      ...prev,
      servicesProvided: [...prev.servicesProvided, newService.trim()]
    }));
    setNewService("");
  };

  const handleRemoveService = (index) => {
    setFormData((prev) => ({
      ...prev,
      servicesProvided: prev.servicesProvided.filter((_, i) => i !== index)
    }));
  };

  // Add / Remove City
  const handleAddCity = () => {
    if (!newCity.trim()) return;
    setFormData((prev) => ({
      ...prev,
      serviceAreas: [...prev.serviceAreas, newCity.trim()]
    }));
    setNewCity("");
  };

  const handleRemoveCity = (index) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index)
    }));
  };

  // Add / Remove Team Member
  const handleAddTeamMember = () => {
    if (!newTeamMember.trim()) return;
    setFormData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newTeamMember.trim()]
    }));
    setNewTeamMember("");
  };

  const handleRemoveTeamMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  // Update Vendor Item
  const handleVendorChange = (index, field, value) => {
    const updated = [...formData.vendors];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, vendors: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateBusiness(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      alert("Error saving business info: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 dark:border-zinc-800 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Business Information & Logo Manager
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Edit business branding, uploaded logo, ₹ 99,000 starting pricing, vendor network, and event policies.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Information updated successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Brand Logo Upload & Preview Card */}
        <div className="p-4 rounded-xl bg-pink-50/40 dark:bg-zinc-800/50 border border-pink-200/60 dark:border-zinc-700">
          <label className="block text-gray-900 dark:text-white font-bold mb-2">
            Brand Logo (Displayed in Header Round Icon)
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Round Preview */}
            <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 border-2 border-[#E91E63] overflow-hidden flex items-center justify-center shadow-md flex-shrink-0">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#E91E63] font-black text-2xl leading-none">∞</span>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="bg-[#E91E63] hover:bg-[#D81B60] text-white px-3.5 py-1.5 rounded-lg font-bold cursor-pointer transition-transform active:scale-95 inline-flex items-center space-x-1.5 shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingLogo ? "Compressing & Uploading..." : "Upload Logo Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={isUploadingLogo}
                  />
                </label>

                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={() => handleInputChange("logoUrl", "")}
                    className="text-gray-500 hover:text-red-500 text-xs px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 hover:border-red-300"
                  >
                    Reset to Default Logo
                  </button>
                )}
              </div>

              <div>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                  placeholder="Or enter direct Logo Image URL (e.g. https://...)"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 1: Basic Identifiers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Business Name <span className="text-[#E91E63]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Manager / Lead Planner <span className="text-[#E91E63]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.manager}
              onChange={(e) => handleInputChange("manager", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Starting Price (Planning Fee) <span className="text-[#E91E63]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.priceStarting}
              onChange={(e) => handleInputChange("priceStarting", e.target.value)}
              placeholder="e.g. ₹ 99,000"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>
        </div>

        {/* Row 2: Description */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Business Description (Rich Summary)
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
          />
        </div>

        {/* Row 3: Experience & Financials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Planning Since (Year)
            </label>
            <input
              type="number"
              value={formData.planningSince}
              onChange={(e) => handleInputChange("planningSince", Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Total Years of Experience
            </label>
            <input
              type="number"
              value={formData.yearsOfExperience}
              onChange={(e) => handleInputChange("yearsOfExperience", Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Fee Structure Description
            </label>
            <input
              type="text"
              value={formData.feeStructure}
              onChange={(e) => handleInputChange("feeStructure", e.target.value)}
              placeholder="e.g. Flexible fee starting from ₹ 99,000"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>
        </div>

        {/* Row 4: Policies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Decor Policy
            </label>
            <textarea
              rows={2}
              value={formData.decorPolicy}
              onChange={(e) => handleInputChange("decorPolicy", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Cancellation / Rescheduling Policy
            </label>
            <textarea
              rows={2}
              value={formData.cancellationPolicy}
              onChange={(e) => handleInputChange("cancellationPolicy", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>
        </div>

        {/* Vendors Network Manager Section */}
        {formData.vendors && formData.vendors.length > 0 && (
          <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30 space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#E91E63]" />
              <h3 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                Vendors Network (Photography, DJ, Decor, Catering, Makeup)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.vendors.map((v, vIdx) => (
                <div key={v.id || vIdx} className="p-3 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">{v.category}</span>
                    <input
                      type="text"
                      value={v.priceStarting || ""}
                      onChange={(e) => handleVendorChange(vIdx, "priceStarting", e.target.value)}
                      placeholder="e.g. ₹ 45,000"
                      className="text-right text-[11px] font-semibold text-[#E91E63] w-28 px-2 py-0.5 border rounded dark:bg-zinc-900 dark:border-zinc-600"
                    />
                  </div>
                  <input
                    type="text"
                    value={v.name || ""}
                    onChange={(e) => handleVendorChange(vIdx, "name", e.target.value)}
                    placeholder="Vendor Name"
                    className="w-full text-xs px-2 py-1 border rounded dark:bg-zinc-900 dark:border-zinc-600 font-medium"
                  />
                  <textarea
                    rows={2}
                    value={v.description || ""}
                    onChange={(e) => handleVendorChange(vIdx, "description", e.target.value)}
                    placeholder="Services included..."
                    className="w-full text-xs px-2 py-1 border rounded dark:bg-zinc-900 dark:border-zinc-600"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Row 5: Dynamic List Management */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Services Provided */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1.5">
              Services Offered ({formData.servicesProvided.length})
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="e.g. Drone Videography"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="bg-[#E91E63] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#D81B60] flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {formData.servicesProvided.map((srv, idx) => (
                <span
                  key={idx}
                  className="bg-pink-50 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-[11px] px-2.5 py-1 rounded-full border border-pink-100 dark:border-zinc-700 flex items-center space-x-1"
                >
                  <span>{srv}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(idx)}
                    className="text-gray-400 hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Key Cities */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1.5">
              Service Areas ({formData.serviceAreas.length})
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="e.g. Madurai"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddCity}
                className="bg-[#E91E63] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#D81B60] flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {formData.serviceAreas.map((city, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-[11px] px-2.5 py-1 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center space-x-1"
                >
                  <span>{city}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCity(idx)}
                    className="text-gray-400 hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1.5">
              Team Members ({formData.teamMembers.length})
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTeamMember}
                onChange={(e) => setNewTeamMember(e.target.value)}
                placeholder="e.g. Kishore (Lead Planner)"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTeamMember}
                className="bg-[#E91E63] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#D81B60] flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {formData.teamMembers.map((member, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-[11px] px-2.5 py-1 rounded-full flex items-center space-x-1"
                >
                  <span>{member}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(idx)}
                    className="text-gray-400 hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
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
            <span>{isSaving ? "Saving Changes..." : "Save Business Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
