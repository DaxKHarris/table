import React, { useState } from "react";
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
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Status configurations
  const statusConfigs = {
    healthy: {
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      label: "Healthy",
    },
    warning: {
      icon: <AlertCircle className="w-4 h-4" />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      label: "Needs Attention",
    },
    offline: {
      icon: <WifiOff className="w-4 h-4" />,
      color: "text-gray-400",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      label: "Offline",
    },
  };

  const statusConfig = statusConfigs[status] || statusConfigs.healthy;

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
    // Don't trigger card click if clicking on nav menu
    if (!e.target.closest(".nav-menu") && onCardClick) {
      onCardClick();
    }
  };

  // Add Device Card
  if (isAddCard) {
    return (
      <div
        onClick={onAddDevice}
        className="w-48 h-56 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 hover:border-green-400 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      >
        <div className="h-full flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 group-hover:bg-green-50 rounded-full flex items-center justify-center transition-colors duration-300 mb-3">
            <Plus className="w-8 h-8 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
          </div>
          <p className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors duration-300">
            Add Device
          </p>
          <p className="text-xs text-gray-400 mt-1">Connect new plant</p>
        </div>
      </div>
    );
  }

  // Plant Device Card
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsMenuVisible(true)}
      onMouseLeave={() => {
        setIsMenuVisible(false);
        setHoveredIcon(null);
      }}
    >
      <div
        onClick={handleCardClick}
        className={`w-48 h-56 bg-white rounded-xl shadow-lg transition-all duration-300 cursor-pointer hover:shadow-xl ${statusConfig.borderColor} border-2`}
      >
        {/* Plant Image Container */}
        <div className="h-32 bg-gradient-to-br from-green-100 to-green-50 rounded-t-lg overflow-hidden flex items-center justify-center relative">
          {/* Your plant image */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(20, 15) scale(0.8)">
              {/* Main stem */}
              <path
                d="M25 45 Q25 35 25 25"
                stroke="#2d5016"
                strokeWidth="2"
                fill="none"
              />

              {/* Bottom left leaf */}
              <path
                d="M25 40 Q15 35 10 25 Q12 30 15 32 Q20 35 25 40"
                fill="#7cb342"
                opacity="0.9"
              />
              <path
                d="M25 40 Q15 35 10 25"
                stroke="#5b8c2a"
                strokeWidth="1"
                fill="none"
              />

              {/* Bottom right leaf */}
              <path
                d="M25 40 Q35 35 40 25 Q38 30 35 32 Q30 35 25 40"
                fill="#8bc34a"
                opacity="0.9"
              />
              <path
                d="M25 40 Q35 35 40 25"
                stroke="#5b8c2a"
                strokeWidth="1"
                fill="none"
              />

              {/* Middle left leaf */}
              <path
                d="M25 30 Q18 25 13 15 Q15 20 18 23 Q22 26 25 30"
                fill="#9ccc65"
                opacity="0.9"
              />
              <path
                d="M25 30 Q18 25 13 15"
                stroke="#689f38"
                strokeWidth="1"
                fill="none"
              />

              {/* Middle right leaf */}
              <path
                d="M25 30 Q32 25 37 15 Q35 20 32 23 Q28 26 25 30"
                fill="#9ccc65"
                opacity="0.9"
              />
              <path
                d="M25 30 Q32 25 37 15"
                stroke="#689f38"
                strokeWidth="1"
                fill="none"
              />

              {/* Top center leaf */}
              <path
                d="M25 25 Q25 15 25 5 Q24 12 23 16 Q24 20 25 25"
                fill="#aed581"
                opacity="0.95"
              />
              <path
                d="M25 25 Q25 15 25 5"
                stroke="#7cb342"
                strokeWidth="1"
                fill="none"
              />

              {/* Small detail leaves */}
              <path
                d="M25 35 Q20 32 18 28"
                stroke="#689f38"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M25 35 Q30 32 32 28"
                stroke="#689f38"
                strokeWidth="0.5"
                fill="none"
              />
            </g>
          </svg>

          {/* Water droplet indicator */}
          <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm">
            <Droplet className="w-4 h-4 text-blue-400 fill-blue-400" />
          </div>
          {/* Sun indicator */}
          <div className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow-sm">
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
          <h3 className="font-semibold text-gray-800 text-sm truncate">
            {plantName}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{location}</p>
        </div>
      </div>

      {/* Expandable Navigation Menu - now stays visible on hover */}
      <div
        className={`nav-menu absolute left-48 top-1/2 -translate-y-1/2 ml-2 transition-all duration-300 ${
          isMenuVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-2 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl p-1 flex flex-col gap-1">
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
                    ? "hover:bg-red-50 hover:text-red-500"
                    : "hover:bg-gray-100 hover:text-gray-700"
                } text-gray-600`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.action) item.action();
                }}
              >
                {item.icon}
              </button>

              {/* Tooltip */}
              <div
                className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 transition-all duration-200 ${
                  hoveredIcon === index
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 pointer-events-none"
                }`}
              >
                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantDeviceCard;
