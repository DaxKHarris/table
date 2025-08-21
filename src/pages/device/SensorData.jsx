import React, { useState, useEffect } from "react";
import {
  Thermometer,
  Droplets,
  Wind,
  Zap,
  Activity,
  Sun,
  Moon,
  Eye,
  Lightbulb,
  Clock,
  Leaf,
} from "lucide-react";

const PlantDashboard = () => {
  // ==================== CONFIGURATION VARIABLES ====================

  // SIZE CONFIGURATION
  const sizing = {
    iconSize: "w-8 h-8", // Icon size (w-3 h-3, w-4 h-4, w-5 h-5, w-6 h-6)
    textBase: "text-xl", // Base text size (text-xs, text-sm, text-base, text-lg)
    textLarge: "text-2xl", // Large text size (text-sm, text-base, text-lg, text-xl)
    textValue: "text-xl", // Sensor value text size (text-base, text-lg, text-xl, text-2xl)
    headerText: "text-2xl", // Header text size (text-lg, text-xl, text-2xl)
  };

  // COLOR THEME CONFIGURATION
  const theme = {
    // Background colors
    mainBg: "from-gray-900 via-gray-800 to-gray-900",
    cardBg: "bg-gray-800/50",
    cardBorder: "border-gray-700/50",

    // Status colors
    goodStatus: "text-green-400 border-green-500/30 bg-green-500/5",
    warningStatus: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5",
    activeStatus: "text-blue-400 border-blue-500/30 bg-blue-500/5",

    // Accent colors
    primary: "text-green-400",
    secondary: "text-purple-400",
    accent: "text-blue-400",

    // Log message colors
    logSuccess: "border-l-green-500 bg-green-500/5 text-green-300",
    logWarning: "border-l-yellow-500 bg-yellow-500/5 text-yellow-300",
    logError: "border-l-red-500 bg-red-500/5 text-red-300",
    logInfo: "border-l-blue-500 bg-blue-500/5 text-blue-300",

    // Interactive elements
    buttonBg: "bg-purple-500/20 hover:bg-purple-500/40",
    buttonText: "text-purple-300",
    buttonBorder: "border-purple-500/30",
  };

  // ==================== END CONFIGURATION ====================
  // Sample sensor data - replace with real data
  const [sensorData] = useState({
    temperature: { value: 24.5, unit: "°C", status: "good" },
    humidity: { value: 65, unit: "%", status: "good" },
    co2: { value: 420, unit: "ppm", status: "good" },
    tvoc: { value: 15, unit: "ppb", status: "good" },
    ph: { value: 6.2, unit: "pH", status: "warning" },
    conductivity: { value: 1.8, unit: "mS/cm", status: "good" },
    waterTemp: { value: 22.1, unit: "°C", status: "good" },
    blueLed: { value: 85, unit: "%", status: "active" },
    whiteLed: { value: 75, unit: "%", status: "active" },
    redLed: { value: 90, unit: "%", status: "active" },
    uvLed: { value: 40, unit: "%", status: "active" },
    farRedLed: { value: 60, unit: "%", status: "active" },
    brightness: { value: 78, unit: "%", status: "active" },
  });

  // Live log system - messages appear at bottom and push up
  const [logMessages, setLogMessages] = useState([
    {
      id: 1,
      message: "pH levels slightly acidic - monitoring",
      timestamp: Date.now() - 30000,
      type: "warning",
    },
    {
      id: 2,
      message: "System initialized successfully",
      timestamp: Date.now(),
      type: "success",
    },
  ]);

  // Compact timeline configurations
  const [timelineConfigs] = useState([
    { id: 1, name: "Phase 1", days: 10, hours: 12, minutes: 45, seconds: 30 },
    { id: 2, name: "Flowering", days: 25, hours: 8, minutes: 15, seconds: 0 },
    { id: 3, name: "Harvest", days: 45, hours: 0, minutes: 0, seconds: 0 },
  ]);

  // Simulate countdown
  const [countdowns, setCountdowns] = useState(
    timelineConfigs.map((config) => ({
      id: config.id,
      totalSeconds:
        config.days * 86400 +
        config.hours * 3600 +
        config.minutes * 60 +
        config.seconds,
    }))
  );

  // Update countdowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prev) =>
        prev.map((countdown) => ({
          ...countdown,
          totalSeconds: Math.max(0, countdown.totalSeconds - 1),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate new log messages - they appear at the bottom and push older ones up
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% chance every 5 seconds
        const messages = [
          "Nutrient levels optimal",
          "LED cycle adjusted",
          "Watering initiated",
          "Temperature regulated",
          "Growth metrics updated",
          "CO2 levels stable",
          "Humidity adjusted",
        ];
        const types = ["info", "success", "warning"];

        setLogMessages((prev) =>
          [
            ...prev,
            {
              id: Date.now(),
              message: messages[Math.floor(Math.random() * messages.length)],
              timestamp: Date.now(),
              type: types[Math.floor(Math.random() * types.length)],
            },
          ].slice(-10)
        ); // Keep only last 5 messages, new ones at bottom
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSeconds) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  };

  const getSensorIcon = (sensor) => {
    const icons = {
      temperature: Thermometer,
      humidity: Droplets,
      co2: Wind,
      tvoc: Activity,
      ph: Zap,
      conductivity: Activity,
      waterTemp: Thermometer,
      blueLed: Sun,
      whiteLed: Sun,
      redLed: Sun,
      uvLed: Eye,
      farRedLed: Sun,
      brightness: Lightbulb,
    };
    return icons[sensor] || Activity;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "good":
        return theme.goodStatus;
      case "warning":
        return theme.warningStatus;
      case "active":
        return theme.activeStatus;
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-500/5";
    }
  };

  const getLogTypeColor = (type) => {
    switch (type) {
      case "success":
        return theme.logSuccess;
      case "warning":
        return theme.logWarning;
      case "error":
        return theme.logError;
      default:
        return theme.logInfo;
    }
  };

  const getSensorName = (key) => {
    const names = {
      temperature: "Temp",
      humidity: "Humidity",
      co2: "CO₂",
      tvoc: "TVOC",
      ph: "pH",
      conductivity: "EC",
      waterTemp: "Water",
      blueLed: "Blue",
      whiteLed: "White",
      redLed: "Red",
      uvLed: "UV",
      farRedLed: "Far Red",
      brightness: "Bright",
    };
    return names[key] || key;
  };

  return (
    <div
      className={`bg-gradient-to-br ${theme.mainBg} text-white p-4 min-h-screen`}
    >
      <div className="max-w-full mx-auto">
        {/* Horizontal Layout */}
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-6rem)]">
          <div
            className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} p-4 flex flex-col`}
          >
            <h2 className={`${sizing.headerText} font-bold mb-3 text-center`}>
              Sensors
            </h2>
            <div className="grid grid-cols-3 gap-2 flex-1 overflow-y-auto">
              {Object.entries(sensorData).map(([key, data]) => {
                const Icon = getSensorIcon(key);
                const statusClass = getStatusColor(data.status);

                return (
                  <div
                    key={key}
                    className={`p-3 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${statusClass} flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className={sizing.iconSize} />
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          data.status === "good"
                            ? "bg-green-400"
                            : data.status === "warning"
                            ? "bg-yellow-400"
                            : data.status === "active"
                            ? "bg-blue-400"
                            : "bg-gray-400"
                        } animate-pulse`}
                      />
                    </div>
                    <div className={`${sizing.textValue} font-bold`}>
                      {data.value}
                      {data.unit}
                    </div>
                    <div className={`${sizing.textBase} text-gray-400`}>
                      {getSensorName(key)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline - Center Third */}
          <div
            className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} p-4`}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className={`${sizing.iconSize} ${theme.secondary}`} />
              <h2 className={`${sizing.headerText} font-bold`}>Timeline</h2>
              <button
                className={`ml-2 w-6 h-6 ${theme.buttonBg} ${theme.buttonText} rounded-lg border ${theme.buttonBorder} transition-all duration-300 hover:scale-110 flex items-center justify-center ${sizing.textBase} font-bold group relative`}
                title="Add new timeline configuration"
              >
                +
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Add Config
                </div>
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {timelineConfigs.map((config) => {
                const countdown = countdowns.find((c) => c.id === config.id);
                const time = formatCountdown(countdown?.totalSeconds || 0);

                return (
                  <div
                    key={config.id}
                    className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30"
                  >
                    <div className="text-center mb-2">
                      <h3
                        className={`font-semibold ${sizing.textBase} ${theme.buttonText}`}
                      >
                        {config.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-center">
                      <div className="bg-gray-600/30 rounded p-1">
                        <div
                          className={`${sizing.textBase} font-bold ${theme.secondary}`}
                        >
                          {time.days}
                        </div>
                        <div className={`text-xs text-gray-400`}>d</div>
                      </div>
                      <div className="bg-gray-600/30 rounded p-1">
                        <div
                          className={`${sizing.textBase} font-bold ${theme.secondary}`}
                        >
                          {time.hours}
                        </div>
                        <div className={`text-xs text-gray-400`}>h</div>
                      </div>
                      <div className="bg-gray-600/30 rounded p-1">
                        <div
                          className={`${sizing.textBase} font-bold ${theme.secondary}`}
                        >
                          {time.minutes}
                        </div>
                        <div className={`text-xs text-gray-400`}>m</div>
                      </div>
                      <div className="bg-gray-600/30 rounded p-1">
                        <div
                          className={`${sizing.textBase} font-bold ${theme.secondary}`}
                        >
                          {time.seconds}
                        </div>
                        <div className={`text-xs text-gray-400`}>s</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Log - Right Third */}
          <div
            className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} p-4 flex flex-col`}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Activity className={`${sizing.iconSize} ${theme.primary}`} />
              <h2 className={`${sizing.headerText} font-bold`}>Live Log</h2>
            </div>

            {/* Messages container - messages appear at bottom */}
            <div className="flex-1 flex flex-col justify-end overflow-hidden">
              <div className="space-y-2">
                {logMessages.map((log, index) => {
                  const isNewest = index === logMessages.length - 1;
                  return (
                    <div
                      key={log.id}
                      className={`p-2 rounded-lg border-l-4 transition-all duration-500 ease-out ${
                        isNewest ? "animate-slide-up" : ""
                      } ${getLogTypeColor(log.type)}`}
                    >
                      <div className={`${sizing.textBase} font-medium`}>
                        {log.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status indicator at bottom */}
            <div className="mt-3 p-2 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <div className="flex items-center justify-center gap-2">
                <div
                  className={`w-2 h-2 bg-green-400 rounded-full animate-pulse`}
                ></div>
                <span className={`${sizing.textBase} ${theme.primary}`}>
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PlantDashboard;
