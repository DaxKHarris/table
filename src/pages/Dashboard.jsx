import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sprout,
  EllipsisVertical,
  Moon,
  Sun,
  Settings,
  Settings2,
  Home,
  Search,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  TreePine,
  Leaf,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import PlantDeviceCard from "./dashboard/DeviceCards";

// Sidebar Component
const Sidebar = ({ isDarkMode, setIsDarkMode }) => {
  const navItems = [
    { icon: Home, label: "Home" },
    { icon: Search, label: "Search" },
    { icon: Settings, label: "Configurations" },
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
          <div className="w-8 h-8 flex-shrink-0 relative">
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
          </div>
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

// Configuration List Component
const ConfigurationsList = ({ isDarkMode, onEditConfig, onNewConfig }) => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch("/api/configurations", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch configurations");
      }
      const data = await response.json();
      setConfigs(Array.isArray(data) ? data : data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching configurations:", err);
      setError(err.message);
      setConfigs([]);
      setLoading(false);
    }
  };

  const handleDeleteConfig = async (configId) => {
    if (
      !window.confirm("Are you sure you want to delete this configuration?")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/configurations/${configId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setConfigs(configs.filter((config) => config.id !== configId));
      }
    } catch (err) {
      console.error("Error deleting configuration:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2
          className={`w-8 h-8 ${
            isDarkMode ? "text-emerald-400" : "text-emerald-500"
          } animate-spin`}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Failed to load configurations
        </p>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          } mt-2`}
        >
          {error}
        </p>
      </div>
    );
  }

  if (configs.length === 0) {
    return (
      <div className="text-center py-20">
        <Settings
          className={`w-12 h-12 ${
            isDarkMode ? "text-gray-600" : "text-gray-400"
          } mx-auto mb-4`}
        />
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          } mb-6`}
        >
          No configurations found
        </p>
        <button
          onClick={onNewConfig}
          className={`px-4 py-2 ${
            isDarkMode
              ? "bg-emerald-700 hover:bg-emerald-600"
              : "bg-emerald-500 hover:bg-emerald-600"
          } text-white rounded-lg transition-colors inline-flex items-center gap-2`}
        >
          <Plus className="w-4 h-4" />
          Create Your First Configuration
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {configs.map((config) => (
        <div
          key={config.id}
          className={`${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } rounded-xl border p-6 hover:shadow-lg transition-all duration-300`}
        >
          <div className="flex items-start justify-between mb-4">
            <h3
              className={`font-semibold text-lg ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {config.name}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditConfig(config)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/50"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteConfig(config.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-red-400 hover:bg-red-950/50"
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Created
                </span>
                <div
                  className={`font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {new Date(config.created_at).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Version
                </span>
                <div
                  className={`font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {config.version}
                </div>
              </div>
              <div>
                <span
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Sections
                </span>
                <div
                  className={`font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {config.sections?.length || 0}
                </div>
              </div>
              <div>
                <span
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Status
                </span>
                <div
                  className={`font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Determine current view from URL
  const isConfigView = location.pathname.includes("/configurations");
  const isConfigEditor =
    location.pathname.includes("/edit") || location.pathname.includes("/new");

  useEffect(() => {
    if (!isConfigView) {
      fetchDevices();
    }
  }, [isConfigView]);

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

      const data = apiResponse.data || apiResponse;

      if (Array.isArray(data)) {
        const formattedDevices = data.map((device) => ({
          id: device.id || device.unique_id,
          name: device.short_name || device.name || "Unnamed Plant",
          location: device.location || "Not Set",
          status: device.status || "offline",
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
      setDevices([]);
      setLoading(false);
    }
  };

  const handleCardClick = (device) => {
    navigate(`/devices/${device.id}`);
  };

  const handleHistoryClick = (device) => {
    console.log("View history:", device);
  };

  const handleConfigClick = (device) => {
    navigate("/dashboard/configurations");
  };

  const handleNavigateClick = (device) => {
    navigate(`/devices/${device.id}`);
  };

  const handleRemoveClick = (device) => {
    console.log("Remove:", device);
    setDevices(devices.filter((d) => d.id !== device.id));
  };

  const handleAddDevice = () => {
    console.log("Add new device");
  };

  const handleNewConfig = () => {
    navigate("/dashboard/configurations/new");
  };

  const handleEditConfig = (config) => {
    navigate(`/dashboard/configurations/edit/${config.id}`);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const healthyCount = devices.filter((d) => d.status === "healthy").length;
  const warningCount = devices.filter((d) => d.status === "warning").length;

  // Don't show stats in config editor mode
  const showStats = !isConfigEditor;

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
            <div className="flex items-center gap-4 mb-2">
              {isConfigView && (
                <button
                  onClick={handleBackToDashboard}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {isConfigView ? "Device Configurations" : "Plant Dashboard"}
              </h1>
            </div>
            <p
              className={`${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              } text-sm sm:text-base`}
            >
              {isConfigView
                ? "Manage your device configuration templates"
                : "Monitor and manage all your plant devices in one place"}
            </p>
          </div>

          {/* Stats Cards - Hidden in config editor */}
          {showStats && (
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
                      {isConfigView ? "Total Configs" : "Total Plants"}
                    </p>
                    <p
                      className={`text-xl sm:text-2xl font-bold ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      {isConfigView ? "..." : devices.length}
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
                      {isConfigView ? "Active Configs" : "Healthy"}
                    </p>
                    <p
                      className={`text-xl sm:text-2xl font-bold ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      {isConfigView ? "..." : healthyCount}
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
                      {isConfigView ? "Recently Used" : "Need Attention"}
                    </p>
                    <p
                      className={`text-xl sm:text-2xl font-bold ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      {isConfigView ? "..." : warningCount}
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
          )}

          {/* Main Content Area */}
          {isConfigEditor ? (
            /* Config Editor takes full content area */
            <ConfigEditor isDarkMode={isDarkMode} />
          ) : (
            <div
              className={`${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              } rounded-2xl shadow-lg p-4 sm:p-6 border`}
            >
              {/* Content Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2
                  className={`text-lg sm:text-xl font-semibold ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {isConfigView ? "Configuration Templates" : "Your Plants"}
                </h2>
                <button
                  onClick={isConfigView ? handleNewConfig : handleAddDevice}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 ${
                    isDarkMode
                      ? "bg-emerald-700 hover:bg-emerald-600"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  } text-white rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base`}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">
                    {isConfigView ? "New Configuration" : "Add Plant"}
                  </span>
                  <span className="sm:hidden">
                    {isConfigView ? "New" : "Add"}
                  </span>
                </button>
              </div>

              {/* Content */}
              {isConfigView ? (
                <ConfigurationsList
                  isDarkMode={isDarkMode}
                  onEditConfig={handleEditConfig}
                  onNewConfig={handleNewConfig}
                />
              ) : loading ? (
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
                <div className="flex flex-wrap gap-4">
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
          )}
        </div>
      </main>
    </div>
  );
}
