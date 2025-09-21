import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { markSessionComplete } from "../../services/apiService";
import {
  Settings,
  History,
  Navigation,
  Trash2,
  Plus,
  Droplet,
  Sun,
  AlertCircle,
  CheckCircle,
  WifiOff,
} from "lucide-react";

const PlantDeviceCard = ({
  plantName,
  location,
  status,
  onCardClick,
  onHistoryClick,
  onConfigClick,
  onNavigateClick,
  onRemoveClick,
  onAddDevice,
  isAddCard = false,
  isDarkMode = false,
}) => {
  const [showSessionEndDialog, setShowSessionEndDialog] = useState(false);
  const navigate = useNavigate();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const handleMarkSessionDone = async () => {
    try {
      const result = await markSessionComplete(deviceId); // You'll need to pass deviceId as a prop
      if (result.success) {
        // Notify parent component to refresh device list
        if (onSessionComplete) onSessionComplete();
        setShowSessionEndDialog(false);
      }
    } catch (error) {
      console.error("Failed to complete session:", error);
      alert("Failed to complete session. Please try again.");
    }
  };

  // Add Device Card (early return)
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

  // Status configurations
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
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Mark Session Done",
      action: () => setShowSessionEndDialog(true),
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

  const handleMouseEnter = () => {
    setIsMenuVisible(true);
  };

  const handleMouseLeave = (e) => {
    // Only hide if mouse is not moving to the menu area
    const rect = e.currentTarget.getBoundingClientRect();
    const menuArea = {
      left: rect.right,
      right: rect.right + 200, // Generous menu area
      top: rect.top,
      bottom: rect.bottom,
    };

    setTimeout(() => {
      // Check if mouse is still in the extended area
      if (
        e.clientX < menuArea.left ||
        e.clientX > menuArea.right ||
        e.clientY < menuArea.top ||
        e.clientY > menuArea.bottom
      ) {
        setIsMenuVisible(false);
        setHoveredIcon(null);
      }
    }, 100);
  };

  // Plant Device Card
  return (
    <div className="relative" style={{ zIndex: isMenuVisible ? 1000 : 1 }}>
      {/* Extended hover detection area */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
              </g>
            </svg>

            {/* Indicators */}
            <div
              className={`absolute top-2 right-2 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-full p-1.5 shadow-sm`}
            >
              <Droplet className="w-4 h-4 text-blue-400 fill-blue-400" />
            </div>
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

            {/* Plant Info */}
            <h3
              className={`font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              } text-sm truncate`}
            >
              {plantName}
            </h3>
          </div>
        </div>
        {/* Navigation Menu - Positioned relative to card */}
        {isMenuVisible && (
          <div
            className="nav-menu absolute left-full top-1/2 -translate-y-1/2 ml-2"
            style={{ zIndex: 9999 }}
            onMouseEnter={() => setIsMenuVisible(true)}
            onMouseLeave={() => {
              setIsMenuVisible(false);
              setHoveredIcon(null);
            }}
          >
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-2xl border ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              } p-1 flex flex-col gap-1`}
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
                      setIsMenuVisible(false);
                    }}
                  >
                    {item.icon}
                  </button>

                  {/* Tooltip */}
                  {hoveredIcon === index && (
                    <div
                      className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap"
                      style={{ zIndex: 10000 }}
                    >
                      <div
                        className={`${
                          isDarkMode
                            ? "bg-gray-700 text-gray-100"
                            : "bg-gray-800 text-white"
                        } text-xs px-2 py-1 rounded`}
                      >
                        {item.label}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {showSessionEndDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
            <div
              className={`${
                isDarkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-800"
              } rounded-2xl max-w-md w-full p-6 shadow-2xl`}
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">
                  End Current Grow Session?
                </h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  This will archive your current plant data and clear all
                  configurations.
                </p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-blue-950/30" : "bg-blue-50"
                } border border-blue-500 rounded-lg p-4 mb-4`}
              >
                <h3 className="font-semibold text-blue-600 mb-2">
                  After confirming:
                </h3>
                <ol className="space-y-1 text-sm list-decimal list-inside">
                  <li>Current grow data will be saved to archives</li>
                  <li>All configurations will be cleared</li>
                  <li>
                    You'll need to reset your grow box before starting a new
                    session
                  </li>
                </ol>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-yellow-950/30" : "bg-yellow-50"
                } border border-yellow-500 rounded-lg p-3 mb-4`}
              >
                <p className="text-sm">
                  <strong className="text-yellow-600">Reminder:</strong> Please
                  handle any nutrient solutions safely when resetting your box.
                  Refer to your owner's manual if needed.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSessionEndDialog(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkSessionDone}
                  className={`px-4 py-2 ${
                    isDarkMode
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white rounded-lg transition-colors`}
                >
                  End Session
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDeviceCard;
