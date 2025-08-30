import React, { useState } from "react";
import myImage from "../../assets/combined_icon.png";
import {
  Sprout,
  EllipsisVertical,
  Moon,
  Sun,
  History,
  Settings2,
  Home,
  Search,
  // Add more icon imports as needed
} from "lucide-react";
// Import your images here
import myIcon from "../../assets/dax_icon.jpg";

export default function Sidebar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ========== CUSTOMIZATION SECTION ==========

  // Colors - Edit these to change the color scheme
  const colors = {
    primary: "emerald-500",
    primaryHover: "emerald-600",
    bgHover: "gray-100",
    border: "gray-200",
    textPrimary: "gray-700",
    textSecondary: "gray-600",
    ring: "emerald-500/20",
  };

  // Profile Information - Edit user details here
  const profile = {
    initials: "DH",
    username: "DaxKHarris",
    // Add more profile fields as needed
  };

  // Text Sizes - Edit these to change text sizing
  const textSizes = {
    username: "text-sm",
    navItems: "text-sm",
    logoText: "text-lg",
  };

  // Navigation Items - Edit icons and labels here
  const navItems = [
    { icon: Home, label: "Home" },
    { icon: Search, label: "Search" },
    { icon: History, label: "History" },
    { icon: Settings2, label: "Settings" },
    { icon: EllipsisVertical, label: "More" },
    // Add or remove navigation items as needed
  ];

  // ========== END CUSTOMIZATION SECTION ==========

  return (
    <aside
      className={`group fixed left-0 top-0 h-full w-16 hover:w-64 bg-gray border-r border-${colors.border} transition-all duration-300 ease-in-out flex flex-col z-50 shadow-lg`}
    >
      {/* Logo Section - Top with overflow hidden for text */}
      <div className="p-4 border-b border-gray-200 overflow-hidden">
        <div className="relative h-12">
          {/* Logo image - positioned to show icon in collapsed state, full image when expanded */}
          <img
            src={myImage}
            className="absolute left-[-4px] top-1/2 -translate-y-1/2 h-[90px] w-auto"
            style={{
              objectFit: "contain",
              objectPosition: "left center",
              minWidth: "200px", // Adjust based on your logo width
            }}
            alt="Logo"
          />
          {/* Fallback if you want to keep the placeholder */}
          {/* <div className="w-8 h-8 flex-shrink-0 relative">
            <div className={`w-full h-full bg-${colors.primary} rounded-lg flex items-center justify-center`}>
              <Sprout className="w-5 h-5 text-white" />
            </div>
          </div> */}
        </div>
      </div>

      {/* Navigation Items - Main content area */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index}>
                <button
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-${colors.bgHover} transition-colors`}
                >
                  <IconComponent
                    className={`w-5 h-5 text-${colors.textSecondary} flex-shrink-0`}
                  />
                  <span
                    className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${textSizes.navItems} text-${colors.textPrimary}`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Toggle - Above profile */}
      <div className="px-4 pb-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-${colors.bgHover} transition-colors`}
        >
          <div className="relative w-5 h-5 flex-shrink-0">
            <Moon
              className={`absolute w-5 h-5 text-${
                colors.textSecondary
              } transition-opacity duration-300 ${
                isDarkMode ? "opacity-0" : "opacity-100"
              }`}
            />
            <Sun
              className={`absolute w-5 h-5 text-${
                colors.textSecondary
              } transition-opacity duration-300 ${
                isDarkMode ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <span
            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${textSizes.navItems} text-${colors.textPrimary}`}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>

      {/* Profile Section - Bottom */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          {/* Profile image */}
          <img
            src={myIcon}
            className={`w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-${colors.ring} object-cover`}
            alt="Profile"
          />
          <span
            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${textSizes.username} font-medium text-${colors.textPrimary}`}
          >
            {profile.username}
          </span>
        </div>
      </div>
    </aside>
  );
}
