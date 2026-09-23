import React, { useState } from "react";
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function BusinessInfoEditor() {
  const { businessData, updateBusiness } = useData();

  const [formData, setFormData] = useState({
    businessName: businessData.businessName || "Future Event Organization",
    manager: businessData.manager || "Kishore",
    description: businessData.description || "",
    yearsOfExperience: businessData.yearsOfExperience || 6,
    planningSince: businessData.planningSince || 2018,
    priceStarting: businessData.priceStarting || "₹ 50,000",
    decorPolicy: businessData.decorPolicy || "",
    cancellationPolicy: businessData.cancellationPolicy || "",
    feeStructure: businessData.feeStructure || "",
    servicesProvided: businessData.servicesProvided || [],
    serviceAreas: businessData.serviceAreas || [],
    teamMembers: businessData.teamMembers || []
  });

  const [newService, setNewService] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newTeamMember, setNewTeamMember] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            Business Information Editor
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Edit business description, years of experience, fee structure, and policies displayed on the public profile.
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
        {/* Row 1: Business Name, Manager, Starting Price */}
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
              Starting Price (Planning Fee)
            </label>
            <input
              type="text"
              value={formData.priceStarting}
              onChange={(e) => handleInputChange("priceStarting", e.target.value)}
              placeholder="e.g. ₹ 50,000"
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

        {/* Row 3: Experience & Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min={1}
              value={formData.yearsOfExperience}
              onChange={(e) => handleInputChange("yearsOfExperience", Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              "Planning Since" Year
            </label>
            <input
              type="number"
              min={1990}
              max={2030}
              value={formData.planningSince}
              onChange={(e) => handleInputChange("planningSince", Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>
        </div>

        {/* Row 4: Policies & Fee Structure */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Decoration Policy
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
              Cancellation Policy
            </label>
            <textarea
              rows={2}
              value={formData.cancellationPolicy}
              onChange={(e) => handleInputChange("cancellationPolicy", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Fee Structure Details
            </label>
            <textarea
              rows={2}
              value={formData.feeStructure}
              onChange={(e) => handleInputChange("feeStructure", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#E91E63]"
            />
          </div>
        </div>

        {/* Dynamic Lists: Services, Cities, Team */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
          {/* Services Provided */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1.5">
              Services Provided ({formData.servicesProvided.length})
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="e.g. Sangeet DJ & Audio Setup"
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
            <div className="flex flex-wrap gap-2">
              {formData.servicesProvided.map((srv, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full flex items-center space-x-1.5"
                >
                  <span>{srv}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(idx)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Service Areas / Cities */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1.5">
              Service Areas / Cities ({formData.serviceAreas.length})
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="e.g. Pondicherry"
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
            <div className="flex flex-wrap gap-2">
              {formData.serviceAreas.map((city, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full flex items-center space-x-1.5"
                >
                  <span>{city}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCity(idx)}
                    className="text-gray-400 hover:text-red-500"
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
                placeholder="e.g. Dinesh (Decor & Production Lead)"
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
            <div className="flex flex-wrap gap-2">
              {formData.teamMembers.map((member, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full flex items-center space-x-1.5"
                >
                  <span>{member}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(idx)}
                    className="text-gray-400 hover:text-red-500"
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
            <span>{isSaving ? "Saving to Cloud..." : "Save Business Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
