import React, { useState } from "react";
import {
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  ShieldCheck,
  Award
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function AboutSection() {
  const { businessData } = useData();
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaq(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="about-section" className="py-6 space-y-6">
      {/* Main About Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
        <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-gray-100 dark:border-zinc-800">
          <Award className="w-5 h-5 text-[#E91E63]" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            About {businessData.businessName || "Future Event Organization"} - Wedding Planners, Ramapuram, Chennai
          </h2>
        </div>

        {/* Business Description */}
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-6">
          {businessData.description}
        </p>

        {/* Services Provided List */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Services Provided by {businessData.businessName}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {businessData.servicesProvided?.map((srv, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 text-xs text-gray-800 dark:text-gray-200 bg-pink-50/50 dark:bg-zinc-800/60 p-2.5 rounded-lg border border-pink-100/50 dark:border-zinc-700/50"
              >
                <CheckCircle className="w-4 h-4 text-[#E91E63] flex-shrink-0 mt-0.5" />
                <span>{srv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata Grid matching screenshot: Been on WedMeGood, Fee Structure, Decor Policy, Cities, Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/60 text-xs">
          {/* Item 1: Experience */}
          <div>
            <span className="text-[#E91E63] font-bold block mb-1">
              Experience
            </span>
            <span className="font-semibold text-gray-900 dark:text-white block text-sm">
              Planning since {businessData.planningSince || 2018}
            </span>
            <span className="text-gray-500 text-[11px]">
              {businessData.yearsOfExperience || 6} years of excellence
            </span>
          </div>

          {/* Item 2: Fee Structure */}
          <div>
            <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-1">
              Fee Structure
            </span>
            <p className="font-medium text-gray-900 dark:text-white leading-snug">
              {businessData.feeStructure || "Starts from ₹ 50,000"}
            </p>
          </div>

          {/* Item 3: Decor Policy */}
          <div>
            <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-1">
              Decor Policy
            </span>
            <p className="font-medium text-gray-900 dark:text-white leading-snug">
              {businessData.decorPolicy || "Work with inhouse & outside decorators"}
            </p>
          </div>

          {/* Item 4: Key Cities */}
          <div>
            <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-1">
              Key Cities Planned Previously
            </span>
            <p className="font-medium text-gray-900 dark:text-white leading-snug">
              {businessData.serviceAreas?.join(", ") || "Chennai, Ramapuram, Coimbatore"}
            </p>
          </div>
        </div>

        {/* Team Members */}
        {businessData.teamMembers && businessData.teamMembers.length > 0 && (
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5 block">
              Core Planning Team
            </span>
            <div className="flex flex-wrap gap-2">
              {businessData.teamMembers.map((member, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-zinc-700"
                >
                  <Users className="w-3 h-3 text-[#E91E63]" />
                  <span>{member}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAQ & Policy Accordion Section matching screenshot */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
        <div className="flex items-center space-x-2 mb-4">
          <HelpCircle className="w-5 h-5 text-[#E91E63]" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            FAQ about {businessData.businessName || "Future Event Organization"}
          </h3>
        </div>

        <div className="space-y-3">
          {businessData.faqs?.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-4 py-3.5 flex justify-between items-center text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#E91E63] flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-zinc-800/60 bg-gray-50/50 dark:bg-zinc-800/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
