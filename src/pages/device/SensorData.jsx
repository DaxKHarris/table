import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
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
  ArrowLeft,
} from "lucide-react";

const SensorData = ({ isDarkMode, setIsDarkMode }) => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [sensorData, setSensorData] = useState({});
  const [logMessages, setLogMessages] = useState([]);
  const [timelineConfigs, setTimelineConfigs] = useState([]);
  const [countdowns, setCountdowns] = useState([]);

  // CONFIGURATION VARIABLES
  const sizing = {
    iconSize: "w-8 h-8",
    textBase: "text-xl",
    textLarge: "text-2xl",
    textValue: "text-xl",
    headerText: "text-2xl",
  };

  const getTheme = (isDark) => ({
    mainBg: isDark
      ? "from-gray-900 via-emerald-950 to-gray-900"
      : "from-emerald-50 via-green-50 to-white",
    cardBg: isDark ? "bg-gray-800/50" : "bg-white/70",
    cardBorder: isDark ? "border-gray-700/50" : "border-gray-200/50",
    goodStatus: isDark
      ? "text-green-400 border-green-500/30 bg-green-500/5"
      : "text-green-600 border-green-500/30 bg-green-500/10",
    warningStatus: isDark
      ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/5"
      : "text-yellow-600 border-yellow-500/30 bg-yellow-500/10",
    activeStatus: isDark
      ? "text-blue-400 border-blue-500/30 bg-blue-500/5"
      : "text-blue-600 border-blue-500/30 bg-blue-500/10",
    primary: isDark ? "text-emerald-400" : "text-emerald-600",
    secondary: isDark ? "text-purple-400" : "text-purple-600",
    accent: isDark ? "text-blue-400" : "text-blue-600",
    textPrimary: isDark ? "text-gray-100" : "text-gray-800",
    textSecondary: isDark ? "text-gray-400" : "text-gray-600",
    logSuccess: isDark
      ? "border-l-green-500 bg-green-500/5 text-green-300"
      : "border-l-green-500 bg-green-500/10 text-green-700",
    logWarning: isDark
      ? "border-l-yellow-500 bg-yellow-500/5 text-yellow-300"
      : "border-l-yellow-500 bg-yellow-500/10 text-yellow-700",
    logError: isDark
      ? "border-l-red-500 bg-red-500/5 text-red-300"
      : "border-l-red-500 bg-red-500/10 text-red-700",
    logInfo: isDark
      ? "border-l-blue-500 bg-blue-500/5 text-blue-300"
      : "border-l-blue-500 bg-blue-500/10 text-blue-700",
    buttonBg: isDark
      ? "bg-emerald-500/20 hover:bg-emerald-500/40"
      : "bg-emerald-500/20 hover:bg-emerald-500/30",
    buttonText: isDark ? "text-emerald-300" : "text-emerald-700",
    buttonBorder: isDark ? "border-emerald-500/30" : "border-emerald-500/40",
  });

  const theme = getTheme(isDarkMode);

  useEffect(() => {
    // Commented out API calls for now - using default data
    // fetchDeviceData();
    // fetchSensorData();
    // fetchLogMessages();
    // fetchTimelineConfigs();

    // Set default data
    setDeviceInfo({
      name: "Hydroponic Garden #1",
      location: "Greenhouse Bay 2",
    });

    setSensorData({
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

    setLogMessages([
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

    const defaultConfigs = [
      { id: 1, name: "Phase 1", days: 10, hours: 12, minutes: 45, seconds: 30 },
      { id: 2, name: "Flowering", days: 25, hours: 8, minutes: 15, seconds: 0 },
      { id: 3, name: "Harvest", days: 45, hours: 0, minutes: 0, seconds: 0 },
    ];

    setTimelineConfigs(defaultConfigs);

    const initialCountdowns = defaultConfigs.map((config) => ({
      id: config.id,
      totalSeconds:
        config.days * 86400 +
        config.hours * 3600 +
        config.minutes * 60 +
        config.seconds,
    }));
    setCountdowns(initialCountdowns);

    setLoading(false);
  }, [deviceId]);

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
        return isDarkMode
          ? "text-gray-400 border-gray-500/30 bg-gray-500/5"
          : "text-gray-500 border-gray-400/30 bg-gray-400/5";
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

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br ${theme.mainBg} min-h-screen`}>
        <Sidebar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          currentView="sensors"
          onNavigate={handleNavigate}
        />
        <main className="ml-16 min-h-screen flex items-center justify-center">
          <div className={`text-xl ${theme.textPrimary}`}>
            Loading sensor data...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-br ${theme.mainBg} min-h-screen`}>
        <Sidebar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          currentView="sensors"
          onNavigate={handleNavigate}
        />
        <main className="ml-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">
              Error loading device data
            </div>
            <div className={`${theme.textSecondary} mb-4`}>{error}</div>
            <button
              onClick={() => navigate("/dashboard")}
              className={`px-4 py-2 ${theme.buttonBg} ${theme.buttonText} rounded-lg border ${theme.buttonBorder} transition-all duration-300`}
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${theme.mainBg} min-h-screen`}>
      <Sidebar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentView="sensors"
        onNavigate={handleNavigate}
      />

      <main className="ml-16 min-h-screen">
        <div className="p-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate("/dashboard")}
                className={`p-2 ${theme.buttonBg} ${theme.buttonText} rounded-lg border ${theme.buttonBorder} transition-all duration-300 hover:scale-105`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>
                  {deviceInfo?.name || "Device Sensors"}
                </h1>
                <p className={`${theme.textSecondary}`}>
                  {deviceInfo?.location || "Real-time sensor monitoring"}
                </p>
              </div>
            </div>
          </div>

          {/* Horizontal Layout */}
          <div className="grid grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
            {/* Sensors - Left Third */}
            <div
              className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} p-4 flex flex-col`}
            >
              <h2
                className={`${sizing.headerText} font-bold mb-3 text-center ${theme.textPrimary}`}
              >
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
                      <div
                        className={`${sizing.textBase} ${theme.textSecondary}`}
                      >
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
                <h2
                  className={`${sizing.headerText} font-bold ${theme.textPrimary}`}
                >
                  Configs & Phases
                </h2>
                <button
                  onClick={() => navigate(`/devices/${deviceId}/config`)}
                  className={`ml-2 px-3 py-1 ${theme.buttonBg} ${theme.buttonText} rounded-lg border ${theme.buttonBorder} transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center text-sm font-semibold group relative`}
                  title="Manage configurations"
                >
                  <span className="mr-1">+</span>
                  Config
                  <div
                    className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 ${theme.cardBg} ${theme.textPrimary} text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border ${theme.cardBorder} shadow-lg z-10`}
                  >
                    Manage configurations
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
                      className={`${
                        isDarkMode ? "bg-gray-700/30" : "bg-gray-100/50"
                      } rounded-lg p-3 border ${
                        isDarkMode ? "border-gray-600/30" : "border-gray-200/30"
                      }`}
                    >
                      <div className="text-center mb-2">
                        <h3
                          className={`font-semibold ${sizing.textBase} ${theme.buttonText}`}
                        >
                          {config.name}
                        </h3>
                      </div>

                      <div className="grid grid-cols-4 gap-1 text-center">
                        <div
                          className={`${
                            isDarkMode ? "bg-gray-600/30" : "bg-gray-200/50"
                          } rounded p-1`}
                        >
                          <div
                            className={`${sizing.textBase} font-bold ${theme.secondary}`}
                          >
                            {time.days}
                          </div>
                          <div className={`text-xs ${theme.textSecondary}`}>
                            d
                          </div>
                        </div>
                        <div
                          className={`${
                            isDarkMode ? "bg-gray-600/30" : "bg-gray-200/50"
                          } rounded p-1`}
                        >
                          <div
                            className={`${sizing.textBase} font-bold ${theme.secondary}`}
                          >
                            {time.hours}
                          </div>
                          <div className={`text-xs ${theme.textSecondary}`}>
                            h
                          </div>
                        </div>
                        <div
                          className={`${
                            isDarkMode ? "bg-gray-600/30" : "bg-gray-200/50"
                          } rounded p-1`}
                        >
                          <div
                            className={`${sizing.textBase} font-bold ${theme.secondary}`}
                          >
                            {time.minutes}
                          </div>
                          <div className={`text-xs ${theme.textSecondary}`}>
                            m
                          </div>
                        </div>
                        <div
                          className={`${
                            isDarkMode ? "bg-gray-600/30" : "bg-gray-200/50"
                          } rounded p-1`}
                        >
                          <div
                            className={`${sizing.textBase} font-bold ${theme.secondary}`}
                          >
                            {time.seconds}
                          </div>
                          <div className={`text-xs ${theme.textSecondary}`}>
                            s
                          </div>
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
                <h2
                  className={`${sizing.headerText} font-bold ${theme.textPrimary}`}
                >
                  Live Log
                </h2>
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
                        <div className={`text-xs ${theme.textSecondary} mt-1`}>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status indicator at bottom */}
              <div
                className={`mt-3 p-2 ${
                  isDarkMode ? "bg-gray-700/30" : "bg-gray-100/50"
                } rounded-lg border ${
                  isDarkMode ? "border-gray-600/30" : "border-gray-200/30"
                }`}
              >
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
      </main>

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

export default SensorData;
