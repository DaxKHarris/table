import React, { useState, useEffect } from "react";
import {
  Sprout,
  EllipsisVertical,
  Moon,
  Sun,
  History,
  Settings2,
  Home,
  Search,
  Settings,
  Navigation,
  Trash2,
  Plus,
  Droplet,
  AlertCircle,
  CheckCircle,
  WifiOff,
  Loader2,
  Leaf,
  TreePine,
} from "lucide-react";

// Note: In your actual app, you'd import this:
// import PlantDeviceCard from "./PlantDeviceCard";

// For this artifact, I'm including the PlantDeviceCard inline
const PlantDeviceCard = ({
  plantName = "Monstera Deliciosa",
  location = "Living Room",
  status = "healthy",
  onCardClick,
  onHistoryClick,
  onConfigClick,
  onNavigateClick,
  onRemoveClick,
  onAddDevice,
  isAddCard = false,
  isDarkMode = false,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Add Device Card (early return before statusConfig is needed)
  if (isAddCard) {
    return (
      <div
        onClick={onAddDevice}
        className={`w-48 h-56 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 hover:border-emerald-600"
            : "bg-white border-gray-300 hover:border-green-400"
        } rounded-xl shadow-lg border-2 border-dashed hover:shadow-xl transition-all duration-300 cursor-pointer group`}
      >
        <div className="h-full flex flex-col items-center justify-center">
          <div
            className={`w-16 h-16 ${
              isDarkMode
                ? "bg-gray-700 group-hover:bg-emerald-950"
                : "bg-gray-100 group-hover:bg-green-50"
            } rounded-full flex items-center justify-center transition-colors duration-300 mb-3`}
          >
            <Plus
              className={`w-8 h-8 ${
                isDarkMode
                  ? "text-gray-400 group-hover:text-emerald-400"
                  : "text-gray-400 group-hover:text-green-500"
              } transition-colors duration-300`}
            />
          </div>
          <p
            className={`text-sm font-medium ${
              isDarkMode
                ? "text-gray-300 group-hover:text-emerald-400"
                : "text-gray-600 group-hover:text-green-600"
            } transition-colors duration-300`}
          >
            Add Device
          </p>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            } mt-1`}
          >
            Connect new plant
          </p>
        </div>
      </div>
    );
  }

  // Status configurations (only needed for plant cards)
  const statusConfigs = {
    healthy: {
      icon: <CheckCircle className="w-4 h-4" />,
      color: isDarkMode ? "text-green-400" : "text-green-500",
      bgColor: isDarkMode ? "bg-green-950/50" : "bg-green-50",
      borderColor: isDarkMode ? "border-green-800" : "border-green-200",
      label: "Healthy",
    },
    warning: {
      icon: <AlertCircle className="w-4 h-4" />,
      color: isDarkMode ? "text-yellow-400" : "text-yellow-500",
      bgColor: isDarkMode ? "bg-yellow-950/50" : "bg-yellow-50",
      borderColor: isDarkMode ? "border-yellow-800" : "border-yellow-200",
      label: "Needs Attention",
    },
    offline: {
      icon: <WifiOff className="w-4 h-4" />,
      color: isDarkMode ? "text-gray-500" : "text-gray-400",
      bgColor: isDarkMode ? "bg-gray-800/50" : "bg-gray-50",
      borderColor: isDarkMode ? "border-gray-700" : "border-gray-200",
      label: "Offline",
    },
  };

  const statusConfig = statusConfigs[status] || statusConfigs.offline;

  const navItems = [
    {
      icon: <History className="w-5 h-5" />,
      label: "View History",
      action: onHistoryClick,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Configuration",
      action: onConfigClick,
    },
    {
      icon: <Navigation className="w-5 h-5" />,
      label: "Go to Plant",
      action: onNavigateClick,
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      label: "Remove",
      action: onRemoveClick,
      danger: true,
    },
  ];

  const handleCardClick = (e) => {
    if (!e.target.closest(".nav-menu") && onCardClick) {
      onCardClick();
    }
  };

  // Plant Device Card with extended hover area
  return (
    <div className="relative w-48" style={{ zIndex: isMenuVisible ? 50 : 1 }}>
      {/* Extended hover area that includes card + menu space */}
      <div
        className="relative"
        onMouseEnter={() => setIsMenuVisible(true)}
        onMouseLeave={() => setIsMenuVisible(false)}
      >
        {/* The actual card */}
        <div
          onClick={handleCardClick}
          className={`w-48 h-56 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg transition-all duration-300 cursor-pointer hover:shadow-xl ${
            statusConfig.borderColor
          } border-2`}
        >
          {/* Plant Image Container */}
          <div
            className={`h-32 ${
              isDarkMode
                ? "bg-gradient-to-br from-emerald-900 to-emerald-950"
                : "bg-gradient-to-br from-green-100 to-green-50"
            } rounded-t-lg overflow-hidden flex items-center justify-center relative`}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(20, 15) scale(0.8)">
                <path
                  d="M25 45 Q25 35 25 25"
                  stroke={isDarkMode ? "#4ade80" : "#2d5016"}
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M25 40 Q15 35 10 25 Q12 30 15 32 Q20 35 25 40"
                  fill={isDarkMode ? "#22c55e" : "#7cb342"}
                  opacity="0.9"
                />
                <path
                  d="M25 40 Q15 35 10 25"
                  stroke={isDarkMode ? "#16a34a" : "#5b8c2a"}
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M25 40 Q35 35 40 25 Q38 30 35 32 Q30 35 25 40"
                  fill={isDarkMode ? "#4ade80" : "#8bc34a"}
                  opacity="0.9"
                />
                <path
                  d="M25 40 Q35 35 40 25"
                  stroke={isDarkMode ? "#16a34a" : "#5b8c2a"}
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M25 30 Q18 25 13 15 Q15 20 18 23 Q22 26 25 30"
                  fill={isDarkMode ? "#86efac" : "#9ccc65"}
                  opacity="0.9"
                />
                <path
                  d="M25 30 Q18 25 13 15"
                  stroke={isDarkMode ? "#22c55e" : "#689f38"}
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M25 30 Q32 25 37 15 Q35 20 32 23 Q28 26 25 30"
                  fill={isDarkMode ? "#86efac" : "#9ccc65"}
                  opacity="0.9"
                />
                <path
                  d="M25 30 Q32 25 37 15"
                  stroke={isDarkMode ? "#22c55e" : "#689f38"}
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M25 25 Q25 15 25 5 Q24 12 23 16 Q24 20 25 25"
                  fill={isDarkMode ? "#bbf7d0" : "#aed581"}
                  opacity="0.95"
                />
                <path
                  d="M25 25 Q25 15 25 5"
                  stroke={isDarkMode ? "#4ade80" : "#7cb342"}
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M25 35 Q20 32 18 28"
                  stroke={isDarkMode ? "#22c55e" : "#689f38"}
                  strokeWidth="0.5"
                  fill="none"
                />
                <path
                  d="M25 35 Q30 32 32 28"
                  stroke={isDarkMode ? "#22c55e" : "#689f38"}
                  strokeWidth="0.5"
                  fill="none"
                />
              </g>
            </svg>

            {/* Water droplet indicator */}
            <div
              className={`absolute top-2 right-2 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-full p-1.5 shadow-sm`}
            >
              <Droplet className="w-4 h-4 text-blue-400 fill-blue-400" />
            </div>
            {/* Sun indicator */}
            <div
              className={`absolute top-2 left-2 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-full p-1.5 shadow-sm`}
            >
              <Sun className="w-4 h-4 text-yellow-400" />
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4">
            {/* Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color} mb-3`}
            >
              {statusConfig.icon}
              <span>{statusConfig.label}</span>
            </div>

            {/* Plant Name */}
            <h3
              className={`font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              } text-sm truncate`}
            >
              {plantName}
            </h3>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } mt-0.5`}
            >
              {location}
            </p>
          </div>
        </div>

        {/* Invisible hover extension area */}
        <div className="absolute left-full top-0 w-20 h-full" />

        {/* Navigation Menu */}
        <div
          className={`nav-menu absolute left-full top-1/2 -translate-y-1/2 ml-2 transition-all duration-300 ${
            isMenuVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 pointer-events-none"
          }`}
        >
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-xl p-1 flex flex-col gap-1`}
          >
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setHoveredIcon(index)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <button
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    item.danger
                      ? isDarkMode
                        ? "hover:bg-red-950/50 hover:text-red-400 text-gray-400"
                        : "hover:bg-red-50 hover:text-red-500 text-gray-600"
                      : isDarkMode
                      ? "hover:bg-gray-700 hover:text-gray-200 text-gray-400"
                      : "hover:bg-gray-100 hover:text-gray-700 text-gray-600"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.action) item.action();
                  }}
                >
                  {item.icon}
                </button>

                {/* Tooltip */}
                <div
                  className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 transition-all duration-200 z-[60] ${
                    hoveredIcon === index
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 pointer-events-none"
                  }`}
                >
                  <div
                    className={`${
                      isDarkMode
                        ? "bg-gray-700 text-gray-100"
                        : "bg-gray-800 text-white"
                    } text-xs px-2 py-1 rounded whitespace-nowrap`}
                  >
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component - KEEPING YOUR EXACT SIDEBAR
const Sidebar = ({ isDarkMode, setIsDarkMode }) => {
  const navItems = [
    { icon: Home, label: "Home" },
    { icon: Search, label: "Search" },
    { icon: History, label: "History" },
    { icon: Settings2, label: "Settings" },
    { icon: EllipsisVertical, label: "More" },
  ];

  const profile = {
    initials: "DH",
    username: "DaxKHarris",
  };

  return (
    <aside
      className={`group fixed left-0 top-0 h-full w-16 hover:w-64 ${
        isDarkMode
          ? "bg-emerald-950 border-emerald-900"
          : "bg-emerald-900 border-emerald-800"
      } border-r transition-all duration-300 ease-in-out flex flex-col z-50 shadow-lg`}
    >
      {/* Logo Section */}
      <div
        className={`p-4 ${
          isDarkMode ? "border-emerald-900" : "border-emerald-800"
        } border-b overflow-hidden`}
      >
        <div className="flex items-center gap-3">
          {/* Logo Icon - Always visible */}
          <div className="w-8 h-8 flex-shrink-0 relative">
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Logo Text - Only visible when expanded */}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-lg font-bold text-white">
            PlantCare Pro
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index}>
                <button
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "hover:bg-emerald-900/50 text-emerald-100 hover:text-white"
                      : "hover:bg-emerald-800/50 text-emerald-100 hover:text-white"
                  }`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="px-4 pb-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
            isDarkMode
              ? "hover:bg-emerald-900/50 text-emerald-100 hover:text-white"
              : "hover:bg-emerald-800/50 text-emerald-100 hover:text-white"
          }`}
        >
          <div className="relative w-5 h-5 flex-shrink-0">
            <Moon
              className={`absolute w-5 h-5 transition-opacity duration-300 ${
                isDarkMode ? "opacity-0" : "opacity-100"
              }`}
            />
            <Sun
              className={`absolute w-5 h-5 transition-opacity duration-300 ${
                isDarkMode ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>

      {/* Profile Section */}
      <div
        className={`p-4 ${
          isDarkMode ? "border-emerald-900" : "border-emerald-800"
        } border-t`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold shadow-md ring-2 ring-emerald-700/30">
            {profile.initials}
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium text-white">
            {profile.username}
          </span>
        </div>
      </div>
    </aside>
  );
};

// Main Dashboard Component - KEEPING YOUR EXACT LOGIC
export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch("/api/user/devices", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }
      const apiResponse = await response.json();
      console.log("API Response:", apiResponse); // Debug log

      // Extract the data array from the wrapped response
      const data = apiResponse.data || apiResponse;

      // Handle empty array or array of devices
      if (Array.isArray(data)) {
        // Map the actual API response to our component's expected format
        const formattedDevices = data.map((device) => ({
          id: device.id || device.unique_id, // Handle different id field names
          name: device.short_name || device.name || "Unnamed Plant",
          location: "Not Set", // Placeholder since API doesn't provide this yet
          status: device.status || "offline", // Default to offline if no status
        }));
        setDevices(formattedDevices);
      } else {
        console.error("Expected array but got:", typeof data, data);
        setDevices([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching devices:", err);
      setError(err.message);
      setDevices([]); // Set to empty array on error
      setLoading(false);
    }
  };

  const handleCardClick = (device) => {
    console.log("Card clicked:", device);
  };

  const handleHistoryClick = (device) => {
    console.log("View history:", device);
  };

  const handleConfigClick = (device) => {
    console.log("Configure:", device);
  };

  const handleNavigateClick = (device) => {
    console.log("Navigate to:", device);
  };

  const handleRemoveClick = (device) => {
    console.log("Remove:", device);
    setDevices(devices.filter((d) => d.id !== device.id));
  };

  const handleAddDevice = () => {
    console.log("Add new device");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900"
          : "bg-gradient-to-br from-emerald-50 via-green-50 to-white"
      }`}
    >
      <Sidebar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="ml-16 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1
              className={`text-2xl sm:text-3xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              } mb-2`}
            >
              Plant Dashboard
            </h1>
            <p
              className={`${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              } text-sm sm:text-base`}
            >
              Monitor and manage all your plant devices in one place
            </p>
          </div>

          {/* Stats Cards - KEEPING YOUR EXACT STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div
              className={`${
                isDarkMode
                  ? "bg-gray-800 border-emerald-800"
                  : "bg-white border-emerald-100"
              } rounded-xl shadow-md p-4 sm:p-6 border`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs sm:text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Total Plants
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {devices.length}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${
                    isDarkMode ? "bg-emerald-950" : "bg-emerald-100"
                  } rounded-full flex items-center justify-center`}
                >
                  <TreePine
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      isDarkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div
              className={`${
                isDarkMode
                  ? "bg-gray-800 border-green-800"
                  : "bg-white border-green-100"
              } rounded-xl shadow-md p-4 sm:p-6 border`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs sm:text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Healthy
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {devices.filter((d) => d.status === "healthy").length}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${
                    isDarkMode ? "bg-green-950" : "bg-green-100"
                  } rounded-full flex items-center justify-center`}
                >
                  <CheckCircle
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div
              className={`${
                isDarkMode
                  ? "bg-gray-800 border-amber-800"
                  : "bg-white border-amber-100"
              } rounded-xl shadow-md p-4 sm:p-6 border`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs sm:text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Need Attention
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {devices.filter((d) => d.status === "warning").length}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${
                    isDarkMode ? "bg-amber-950" : "bg-amber-100"
                  } rounded-full flex items-center justify-center`}
                >
                  <AlertCircle
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      isDarkMode ? "text-amber-400" : "text-amber-600"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Devices Grid - NOW USING THE MODULAR COMPONENT */}
          <div
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            } rounded-2xl shadow-lg p-4 sm:p-6 border`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2
                className={`text-lg sm:text-xl font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Your Plants
              </h2>
              <button
                onClick={handleAddDevice}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 ${
                  isDarkMode
                    ? "bg-emerald-700 hover:bg-emerald-600"
                    : "bg-emerald-500 hover:bg-emerald-600"
                } text-white rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base`}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Add Plant</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2
                  className={`w-8 h-8 ${
                    isDarkMode ? "text-emerald-400" : "text-emerald-500"
                  } animate-spin`}
                />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Failed to load devices
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  } mt-2`}
                >
                  {error}
                </p>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-20">
                <TreePine
                  className={`w-12 h-12 ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  } mx-auto mb-4`}
                />
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  } mb-6`}
                >
                  Add your first plant device to get started
                </p>
                <button
                  onClick={handleAddDevice}
                  className={`px-4 py-2 ${
                    isDarkMode
                      ? "bg-emerald-700 hover:bg-emerald-600"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  } text-white rounded-lg transition-colors inline-flex items-center gap-2`}
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Plant
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5">
                {devices.map((device) => (
                  <PlantDeviceCard
                    key={device.id}
                    plantName={device.name}
                    location={device.location}
                    status={device.status}
                    isDarkMode={isDarkMode}
                    onCardClick={() => handleCardClick(device)}
                    onHistoryClick={() => handleHistoryClick(device)}
                    onConfigClick={() => handleConfigClick(device)}
                    onNavigateClick={() => handleNavigateClick(device)}
                    onRemoveClick={() => handleRemoveClick(device)}
                  />
                ))}
                <PlantDeviceCard
                  isAddCard={true}
                  isDarkMode={isDarkMode}
                  onAddDevice={handleAddDevice}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
