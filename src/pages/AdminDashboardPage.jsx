import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  Phone,
  MessageSquare,
  Settings,
  LogOut,
  Sun,
  Moon,
  ExternalLink,
  Shield,
  Menu,
  X,
  Database
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

import DashboardHome from "../components/admin/DashboardHome";
import GalleryManager from "../components/admin/GalleryManager";
import BusinessInfoEditor from "../components/admin/BusinessInfoEditor";
import ContactInfoEditor from "../components/admin/ContactInfoEditor";
import ReviewsManager from "../components/admin/ReviewsManager";
import SettingsManager from "../components/admin/SettingsManager";
import DatabaseManager from "../components/admin/DatabaseManager";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { adminUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { businessData } = useData();

  // Active Tab: "home" | "gallery" | "business" | "contact" | "reviews" | "settings"
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { id: "home", label: "Dashboard Home", icon: LayoutDashboard },
    { id: "gallery", label: "Gallery & Photos", icon: FolderOpen },
    { id: "business", label: "Business Details", icon: Briefcase },
    { id: "contact", label: "Studio Contacts", icon: Phone },
    { id: "reviews", label: "Client Reviews", icon: MessageSquare },
    { id: "database", label: "Database & Storage", icon: Database },
    { id: "settings", label: "Settings & Security", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col transition-colors">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#E91E63] text-white flex items-center justify-center font-black">
                ∞
              </div>
              <span className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white tracking-tight">
                {businessData.businessName || "Future Event Organization"}
              </span>
              <span className="hidden sm:inline text-[11px] bg-pink-100 dark:bg-pink-950/60 text-[#E91E63] font-bold px-2 py-0.5 rounded-full">
                Admin
              </span>
            </Link>
          </div>

          {/* Right Header Icons */}
          <div className="flex items-center space-x-3">
            {/* View Public Website */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#E91E63] p-2 rounded-lg"
              title="View Public Profile"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-yellow-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-zinc-800 pl-3">
              <div className="w-8 h-8 rounded-full bg-[#E91E63] text-white text-xs font-bold flex items-center justify-center">
                K
              </div>
              <div className="hidden md:block text-left text-xs leading-none">
                <span className="font-bold text-gray-900 dark:text-white block">
                  {adminUser?.name || "Kishore"}
                </span>
                <span className="text-[10px] text-gray-400">Owner</span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-1 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
                    isActive
                      ? "bg-[#E91E63] text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Slideout Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden bg-black/60 flex">
            <div className="w-64 bg-white dark:bg-zinc-900 p-5 space-y-2 h-full shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100 dark:border-zinc-800">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">Admin Navigation</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
                          isActive
                            ? "bg-[#E91E63] text-white"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === "home" && (
            <DashboardHome
              setActiveTab={setActiveTab}
              onOpenCreateAlbumModal={() => setActiveTab("gallery")}
            />
          )}
          {activeTab === "gallery" && <GalleryManager />}
          {activeTab === "business" && <BusinessInfoEditor />}
          {activeTab === "contact" && <ContactInfoEditor />}
          {activeTab === "reviews" && <ReviewsManager />}
          {activeTab === "database" && <DatabaseManager />}
          {activeTab === "settings" && <SettingsManager />}
        </main>
      </div>
    </div>
  );
}
