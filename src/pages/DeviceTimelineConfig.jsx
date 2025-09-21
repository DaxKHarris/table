import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";
import {
  fetchConfigurations,
  fetchDeviceTimeline,
  fetchDeviceDetails,
} from "../services/apiService";
import {
  ArrowLeft,
  Plus,
  Clock,
  Trash2,
  Play,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Calendar,
} from "lucide-react";

// ConfigCard component for displaying configuration details
export const ConfigCard = ({
  config,
  onDeleteConfig,
  onAddToTimeline,
  onEditConfig,
  onPhaseClick,
  theme,
  isDarkMode,
}) => {
  const formatDuration = (duration) => {
    const parts = [];
    if (duration.days > 0) parts.push(`${duration.days}d`);
    if (duration.hours > 0) parts.push(`${duration.hours}h`);
    if (duration.minutes > 0) parts.push(`${duration.minutes}m`);
    return parts.join(" ");
  };

  const calculateTotalTime = () => {
    const total = config.phases.reduce(
      (acc, phase) => ({
        days: acc.days + phase.duration.days,
        hours: acc.hours + phase.duration.hours,
        minutes: acc.minutes + phase.duration.minutes,
      }),
      { days: 0, hours: 0, minutes: 0 }
    );

    total.hours += Math.floor(total.minutes / 60);
    total.minutes = total.minutes % 60;
    total.days += Math.floor(total.hours / 24);
    total.hours = total.hours % 24;

    return formatDuration(total);
  };

  return (
    <div
      className={`border rounded-lg p-4 max-w-lg w-full transition-all duration-300 hover:shadow-md ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-600/50 hover:border-emerald-500/50"
          : "bg-white border-gray-300/50 hover:border-emerald-400/50"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className={`font-medium ${theme.textPrimary}`}>{config.name}</h4>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${theme.textSecondary}`}>
            {calculateTotalTime()}
          </span>
          <div className="flex gap-2">
            {onAddToTimeline && (
              <button
                onClick={() => onAddToTimeline(config)}
                className={`px-3 py-1 text-sm rounded transition-all duration-200 hover:shadow-sm ${
                  isDarkMode
                    ? "bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/70"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                Add
              </button>
            )}
            <button
              onClick={() => onEditConfig(config.id)}
              className={`px-3 py-1 text-white text-sm rounded transition-all duration-200 hover:shadow-sm ${
                isDarkMode
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Edit
            </button>
            {onDeleteConfig && (
              <button
                onClick={() => onDeleteConfig(config.id)}
                className={`px-3 py-1 text-sm rounded transition-all duration-200 hover:shadow-sm ${
                  isDarkMode
                    ? "bg-red-900/50 text-red-300 hover:bg-red-800/70"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {config.phases.map((phase, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-sm border transition-all duration-200 cursor-pointer ${
              isDarkMode
                ? "bg-emerald-900/30 text-emerald-300 border-emerald-700/50 hover:bg-emerald-800/50 hover:border-emerald-600"
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300"
            }`}
            onClick={() => onPhaseClick(config.id, index, phase)}
          >
            {phase.name}
          </span>
        ))}
      </div>
    </div>
  );
};

const DeviceTimelineConfig = ({ isDarkMode, setIsDarkMode }) => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [currentTimeline, setCurrentTimeline] = useState([]);
  const [availableConfigs, setAvailableConfigs] = useState([]);
  const [showRemoveDialog, setShowRemoveDialog] = useState(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const theme = {
    mainBg: isDarkMode
      ? "from-gray-900 via-emerald-950 to-gray-900"
      : "from-emerald-50 via-green-50 to-white",
    cardBg: isDarkMode ? "bg-gray-800/50" : "bg-white/70",
    cardBorder: isDarkMode ? "border-gray-700/50" : "border-gray-200/50",
    textPrimary: isDarkMode ? "text-gray-100" : "text-gray-800",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-600",
    buttonBg: isDarkMode
      ? "bg-emerald-500/20 hover:bg-emerald-500/40"
      : "bg-emerald-500/20 hover:bg-emerald-500/30",
    buttonText: isDarkMode ? "text-emerald-300" : "text-emerald-700",
    buttonBorder: isDarkMode
      ? "border-emerald-500/30"
      : "border-emerald-500/40",
    dangerBg: isDarkMode
      ? "bg-red-500/20 hover:bg-red-500/40"
      : "bg-red-500/20 hover:bg-red-500/30",
    dangerText: isDarkMode ? "text-red-300" : "text-red-700",
    dangerBorder: isDarkMode ? "border-red-500/30" : "border-red-500/40",
    activeBg: isDarkMode ? "bg-emerald-600/20" : "bg-emerald-100/80",
    activeBorder: isDarkMode ? "border-emerald-500" : "border-emerald-400",
    upcomingBg: isDarkMode ? "bg-blue-600/10" : "bg-blue-50",
    upcomingBorder: isDarkMode ? "border-blue-500/30" : "border-blue-300",
  };

  useEffect(() => {
    fetchDeviceInfo();
    fetchCurrentTimeline();
    fetchAvailableConfigs();
  }, [deviceId]);

  const fetchDeviceInfo = async () => {
    try {
      const device = await fetchDeviceDetails(deviceId);
      setDeviceInfo({
        id: device.id,
        name: device.short_name || "Unknown Device",
        location: device.model || "Unknown Model",
      });
    } catch (error) {
      console.error("Error fetching device info:", error);
    }
  };

  const fetchCurrentTimeline = async () => {
    try {
      const timeline = await fetchDeviceTimeline(deviceId);
      setCurrentTimeline(timeline);
      setCurrentPhaseIndex(0);

      // Calculate progress for active phase (existing logic)
      const activeConfig = timeline.find(
        (config) => config.status === "active"
      );
      if (activeConfig && activeConfig.phases[activeConfig.currentPhase]) {
        const elapsed = Date.now() - activeConfig.startedAt;
        const elapsedDays = Math.floor(elapsed / (24 * 60 * 60 * 1000));
        const elapsedHours = Math.floor(
          (elapsed % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
        );
        const elapsedMinutes = Math.floor(
          (elapsed % (60 * 60 * 1000)) / (60 * 1000)
        );
        setPhaseProgress({
          days: elapsedDays,
          hours: elapsedHours,
          minutes: elapsedMinutes,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      setLoading(false);
    }
  };

  const fetchAvailableConfigs = async () => {
    try {
      const configs = await fetchConfigurations();
      setAvailableConfigs(configs);
    } catch (error) {
      console.error("Error fetching configs:", error);
    }
  };

  const handleAddConfig = (config) => {
    // Add config to end of timeline
    const newPhase = {
      id: Date.now(),
      configName: config.name,
      configId: config.id,
      phases: config.phases,
      status: "upcoming",
      currentPhase: 0,
    };

    setCurrentTimeline([...currentTimeline, newPhase]);
  };

  const handleEditConfig = (configId) => {
    navigate(`/dashboard/configurations/edit/${configId}`);
  };

  const handlePhaseClick = (configId, phaseIndex, phase) => {
    // Navigate to configuration editor with specific phase focus
    navigate(`/dashboard/configurations/edit/${configId}?phase=${phaseIndex}`);
  };

  const handleRemoveConfig = (configId) => {
    const config = currentTimeline.find((c) => c.id === configId);
    if (config.status === "active") {
      setShowRemoveDialog(config);
    } else {
      setCurrentTimeline(currentTimeline.filter((c) => c.id !== configId));
    }
  };

  const confirmRemoveActiveConfig = () => {
    setCurrentTimeline(
      currentTimeline.filter((c) => c.id !== showRemoveDialog.id)
    );
    setShowRemoveDialog(null);
    // Would need to handle stopping current config and potentially starting next one
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const formatDuration = (duration) => {
    const parts = [];
    if (duration.days > 0) parts.push(`${duration.days}d`);
    if (duration.hours > 0) parts.push(`${duration.hours}h`);
    if (duration.minutes > 0) parts.push(`${duration.minutes}m`);
    return parts.join(" ") || "0m";
  };

  const getPhaseStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4 text-emerald-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br ${theme.mainBg} min-h-screen`}>
        <Sidebar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          currentView="device-config"
          onNavigate={handleNavigate}
        />
        <main className="ml-16 min-h-screen flex items-center justify-center">
          <div className={`text-xl ${theme.textPrimary}`}>
            Loading device configuration...
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
        currentView="device-config"
        onNavigate={handleNavigate}
      />

      <main className="ml-16 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate(`/devices/${deviceId}`)}
                className={`p-2 ${theme.buttonBg} ${theme.buttonText} rounded-lg border ${theme.buttonBorder} transition-all duration-300 hover:scale-105`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>
                  Configuration Timeline
                </h1>
                <p className={`${theme.textSecondary}`}>
                  {deviceInfo?.name} - Manage applied configurations
                </p>
              </div>
            </div>
          </div>

          {/* Current Status Card */}
          {currentTimeline.length > 0 ? (
            <div
              className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} p-6 mb-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className={`text-xl font-bold ${theme.textPrimary} mb-2`}>
                    Current Status
                  </h2>
                  <div className="flex items-center gap-3">
                    {getPhaseStatusIcon("active")}
                    <span className={`text-lg ${theme.textPrimary}`}>
                      {currentTimeline[0]?.configName} -{" "}
                      {
                        currentTimeline[0]?.phases[
                          currentTimeline[0]?.currentPhase || 0
                        ]?.name
                      }
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/configurations/edit/${currentTimeline[0]?.configId}`
                    )
                  }
                  className={`px-3 py-2 ${theme.buttonBg} ${theme.buttonText} rounded-lg border ${theme.buttonBorder} transition-all duration-300 flex items-center gap-2 text-sm`}
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700/30" : "bg-gray-100/50"
                  }`}
                >
                  <div className={`text-sm ${theme.textSecondary} mb-1`}>
                    Progress
                  </div>
                  <div className={`text-lg font-bold ${theme.textPrimary}`}>
                    Day {phaseProgress.days + 1} of{" "}
                    {
                      currentTimeline[0]?.phases[
                        currentTimeline[0]?.currentPhase || 0
                      ]?.duration.days
                    }
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700/30" : "bg-gray-100/50"
                  }`}
                >
                  <div className={`text-sm ${theme.textSecondary} mb-1`}>
                    Time Remaining
                  </div>
                  <div className={`text-lg font-bold ${theme.textPrimary}`}>
                    {formatDuration({
                      days:
                        (currentTimeline[0]?.phases[
                          currentTimeline[0]?.currentPhase || 0
                        ]?.duration.days || 0) -
                        phaseProgress.days -
                        1,
                      hours: 24 - phaseProgress.hours,
                      minutes: 60 - phaseProgress.minutes,
                    })}
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700/30" : "bg-gray-100/50"
                  }`}
                >
                  <div className={`text-sm ${theme.textSecondary} mb-1`}>
                    Next Phase
                  </div>
                  <div className={`text-lg font-bold ${theme.textPrimary}`}>
                    {currentTimeline[0]?.phases[
                      currentTimeline[0]?.currentPhase + 1
                    ]?.name ||
                      currentTimeline[1]?.configName ||
                      "Timeline Complete"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} p-12 text-center mb-6`}
            >
              <Calendar
                className={`w-16 h-16 ${theme.textSecondary} mx-auto mb-4`}
              />
              <h2 className={`text-2xl font-bold ${theme.textPrimary} mb-2`}>
                No Configuration Applied
              </h2>
              <p className={`${theme.textSecondary} mb-6`}>
                This device doesn't have any configuration timeline set up yet.
                Select a configuration from the available templates to get
                started.
              </p>
            </div>
          )}

          {/* Two Column Layout - Full Height */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-20rem)]">
            {/* Available Templates - Left Column */}
            <div
              className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} p-6 flex flex-col`}
            >
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className={`text-xl font-bold ${theme.textPrimary}`}>
                  Available Templates
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/dashboard/configurations/new")}
                    className={`px-4 py-2 ${theme.buttonBg} ${theme.buttonText} rounded-lg border ${theme.buttonBorder} transition-all duration-300 inline-flex items-center gap-2 text-sm`}
                  >
                    <Plus className="w-4 h-4" />
                    Create New
                  </button>
                  <button
                    onClick={() => navigate("/dashboard/configurations")}
                    className={`px-4 py-2 ${theme.buttonBg} ${theme.buttonText} rounded-lg border ${theme.buttonBorder} transition-all duration-300 inline-flex items-center gap-2 text-sm`}
                  >
                    <Edit3 className="w-4 h-4" />
                    Manage All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1 items-start auto-rows-min">
                {availableConfigs.map((config) => (
                  <ConfigCard
                    key={config.id}
                    config={config}
                    onAddToTimeline={handleAddConfig}
                    onEditConfig={handleEditConfig}
                    onPhaseClick={handlePhaseClick}
                    theme={theme}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>

            {/* Timeline Overview - Right Column */}
            <div
              className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} p-6 flex flex-col`}
            >
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className={`text-xl font-bold ${theme.textPrimary}`}>
                  Applied Timeline
                </h2>
                <div className={`text-sm ${theme.textSecondary}`}>
                  {currentTimeline.length} configuration
                  {currentTimeline.length !== 1 ? "s" : ""} applied
                </div>
              </div>

              {currentTimeline.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Clock
                      className={`w-12 h-12 ${theme.textSecondary} mx-auto mb-4`}
                    />
                    <p className={`${theme.textSecondary}`}>
                      No configurations applied yet. Select a template from the
                      left to get started.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto flex-1">
                  {currentTimeline.map((config, configIndex) => (
                    <div
                      key={config.id}
                      className={`border rounded-xl overflow-hidden ${
                        config.status === "active"
                          ? theme.activeBorder
                          : isDarkMode
                          ? "border-gray-600/50"
                          : "border-gray-300/50"
                      }`}
                    >
                      {/* Configuration Header Banner */}
                      <div
                        className={`px-4 py-3 ${
                          config.status === "active"
                            ? isDarkMode
                              ? "bg-emerald-800/30 border-b border-emerald-700/50"
                              : "bg-emerald-100/80 border-b border-emerald-300/50"
                            : isDarkMode
                            ? "bg-blue-800/20 border-b border-blue-700/30"
                            : "bg-blue-50/80 border-b border-blue-300/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                config.status === "active"
                                  ? "bg-emerald-500 text-white"
                                  : "bg-blue-500 text-white"
                              }`}
                            >
                              {configIndex + 1}
                            </div>
                            <h3
                              className={`font-semibold ${theme.textPrimary}`}
                            >
                              {config.configName}
                              {config.status === "active" && (
                                <span className="ml-2 text-xs text-emerald-500">
                                  • Active
                                </span>
                              )}
                            </h3>
                          </div>
                          <button
                            onClick={() => handleRemoveConfig(config.id)}
                            className={`p-1.5 ${theme.dangerBg} ${theme.dangerText} rounded-lg border ${theme.dangerBorder} transition-all duration-300`}
                            title="Remove Configuration"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Phases List */}
                      <div className="p-3 space-y-2">
                        {config.phases.map((phase, phaseIndex) => (
                          <div
                            key={phaseIndex}
                            className={`flex items-center justify-between p-2 rounded-lg ${
                              config.status === "active" &&
                              phaseIndex === config.currentPhase
                                ? isDarkMode
                                  ? "bg-emerald-700/20 border border-emerald-600/30"
                                  : "bg-emerald-100/60 border border-emerald-300/60"
                                : isDarkMode
                                ? "bg-gray-700/30"
                                : "bg-gray-100/50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {config.status === "active" &&
                                phaseIndex === config.currentPhase && (
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                )}
                              <span className={`text-sm ${theme.textPrimary}`}>
                                {phase.name}
                              </span>
                            </div>
                            <span className={`text-sm ${theme.textSecondary}`}>
                              {formatDuration(phase.duration)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Remove Confirmation Dialog */}
      {showRemoveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} p-6 max-w-md w-full`}
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className={`text-lg font-bold ${theme.textPrimary} mb-2`}>
                  Remove Active Configuration?
                </h3>
                <p className={`${theme.textSecondary} text-sm`}>
                  Your device is currently running "
                  {showRemoveDialog.configName}". Removing this configuration
                  will stop the current phase. Are you sure you want to
                  continue?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRemoveDialog(null)}
                className={`px-4 py-2 ${theme.buttonBg} ${theme.buttonText} rounded-lg border ${theme.buttonBorder} transition-all duration-300`}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveActiveConfig}
                className={`px-4 py-2 ${theme.dangerBg} ${theme.dangerText} rounded-lg border ${theme.dangerBorder} transition-all duration-300`}
              >
                Remove Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceTimelineConfig;
