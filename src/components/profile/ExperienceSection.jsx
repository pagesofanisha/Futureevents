import React from "react";
import { Award, Calendar, CheckCircle2, Clock, MapPin, ShieldCheck, Users, Sparkles } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function ExperienceSection() {
  const { businessData } = useData();

  const planningSince = businessData.planningSince || 2018;
  const years = businessData.yearsOfExperience || 6;
  const eventsCount = businessData.stats?.eventsCompleted || 180;
  const satisfiedClients = businessData.stats?.satisfiedClients || 350;

  const milestones = [
    {
      icon: Calendar,
      title: `${years}+ Years Planning`,
      subtitle: `Since ${planningSince}`,
      desc: "Years of specialized event planning in South Indian weddings and social celebrations."
    },
    {
      icon: Award,
      title: `${eventsCount}+ Events Delivered`,
      subtitle: "Weddings, Decors & Galas",
      desc: "From intimate traditional baby showers to grand luxury banquet hall weddings."
    },
    {
      icon: Users,
      title: `${satisfiedClients}+ Happy Families`,
      subtitle: "5.0 ★ Client Satisfaction",
      desc: "Direct reviews and recommendations praising personal hospitality and neat execution."
    },
    {
      icon: ShieldCheck,
      title: "100% On-Time Delivery",
      subtitle: "Hands-on Coordination",
      desc: "Kishore is personally present at the venue to ensure timely rituals and guest delight."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Consultation & Vision",
      desc: "Discuss your date, guest count, traditional preferences, and budget expectations directly with Kishore."
    },
    {
      step: "02",
      title: "Custom Decor & Menu Planning",
      desc: "Detailed selection of stage mandap themes, flower color palettes, and authentic feast menus."
    },
    {
      step: "03",
      title: "Vendor Lock-In & Rehearsal",
      desc: "Complete booking of photography, DJ sound, makeup artists, and venue liaison with fixed timelines."
    },
    {
      step: "04",
      title: "Flawless Event Day Coordination",
      desc: "Relax and celebrate with your guests while Kishore’s team handles everything from entrance to muhurtham."
    }
  ];

  return (
    <section id="experience-section" className="py-6 scroll-mt-20">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 dark:border-zinc-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#E91E63]" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Experience & Track Record
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Led personally by Kishore, Future Event Organization brings 6+ years of specialized wedding and celebration expertise in Chennai.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified 5.0 ★ Rated Planner</span>
          </div>
        </div>

        {/* 4 Milestones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {milestones.map((m, idx) => {
            const IconComponent = m.icon;
            return (
              <div
                key={idx}
                className="bg-gray-50/70 dark:bg-zinc-800/40 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-pink-200 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-[#E91E63] flex items-center justify-center mb-3">
                  <IconComponent className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  {m.title}
                </h3>
                <span className="text-[11px] text-[#E91E63] font-semibold block mb-1">
                  {m.subtitle}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* 4 Steps Process */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 block">
            How Kishore Orchestrates Your Event
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map((p, idx) => (
              <div
                key={idx}
                className="relative p-4 rounded-xl bg-pink-50/30 dark:bg-zinc-800/20 border border-pink-100/60 dark:border-zinc-800"
              >
                <span className="text-2xl font-black text-[#E91E63]/30 dark:text-pink-400/20 block mb-1">
                  {p.step}
                </span>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                  {p.title}
                </h4>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
