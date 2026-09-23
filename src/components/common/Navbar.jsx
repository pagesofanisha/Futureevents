import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Moon,
  Sun,
  Shield,
  Menu,
  X,
  Sparkles,
  Edit3,
  Smartphone
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAdminLoggedIn } = useAuth();
  const { businessData } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Chennai");

  const cities = ["Chennai", "Ramapuram", "Porur", "Coimbatore", "Madurai", "All Cities"];

  return (
    <header className="sticky top-0 z-40 shadow-sm transition-colors duration-200">
      {/* Top micro bar matching WedMeGood */}
      <div className="bg-[#B7154A] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="font-medium tracking-wide">India's Favourite Wedding Planning Platform</span>
            <span className="opacity-60">|</span>
            <div className="flex items-center space-x-1 cursor-pointer hover:opacity-90">
              <MapPin className="w-3.5 h-3.5 text-pink-200" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                aria-label="Select City"
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="text-gray-900 bg-white">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <a href="#reviews-section" className="flex items-center space-x-1 hover:text-pink-100 transition-colors">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write A Review</span>
            </a>
            <span className="opacity-60">|</span>
            <span className="flex items-center space-x-1 hover:text-pink-100 cursor-pointer">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Download App</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Pink Header */}
      <div className="bg-[#E91E63] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo / Brand Name */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <Link to="/" className="flex items-center space-x-2 group min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-[#E91E63] font-black text-lg sm:text-xl leading-none">∞</span>
                </div>
                <div className="min-w-0">
                  <span className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight block leading-tight text-white truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none">
                    {businessData.businessName || "Future Event Organization"}
                  </span>
                  <span className="hidden sm:block text-[11px] font-normal tracking-wider uppercase text-pink-100 opacity-90 truncate">
                    WedMeGood Certified Partner · Ramapuram
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              <a href="#projects-section" className="hover:text-pink-100 transition-colors">Portfolios</a>
              <a href="#albums-section" className="hover:text-pink-100 transition-colors">Albums</a>
              <a href="#about-section" className="hover:text-pink-100 transition-colors">About</a>
              <a href="#reviews-section" className="hover:text-pink-100 transition-colors">Reviews</a>
              <span className="flex items-center space-x-1 bg-pink-700/60 hover:bg-pink-700 px-2.5 py-1 rounded-full text-xs font-semibold text-yellow-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Genie</span>
              </span>
            </nav>

            {/* Right Action Icons: Dark Mode & Admin Button */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full bg-pink-700/50 hover:bg-pink-700 text-white transition-all focus:outline-none"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />}
              </button>

              {/* Admin Portal Button */}
              <Link
                to={isAdminLoggedIn ? "/admin" : "/admin/login"}
                className="flex items-center space-x-1 bg-white text-[#E91E63] hover:bg-pink-50 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-sm transition-all"
              >
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{isAdminLoggedIn ? "Admin" : "Login"}</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 rounded-md hover:bg-pink-700 text-white focus:outline-none"
                aria-label="Open Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#D81B60] px-4 pt-2 pb-4 space-y-2 border-t border-pink-400/40 fade-in">
            <a
              href="#projects-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-pink-700"
            >
              Portfolios & Gallery
            </a>
            <a
              href="#albums-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-pink-700"
            >
              Albums
            </a>
            <a
              href="#about-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-pink-700"
            >
              About Kishore & Policies
            </a>
            <a
              href="#reviews-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-pink-700"
            >
              Customer Reviews (5.0 ★)
            </a>
            <div className="pt-2 border-t border-pink-400/30 flex justify-between items-center text-xs">
              <span>Location: Ramapuram, Chennai</span>
              <span className="font-semibold">+91 93604 55217</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
