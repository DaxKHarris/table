import React, { useState, useEffect } from "react";
import Sidebar from "./dashboard/Sidebar";
import ConfigurationsList from "./dashboard/ConfigurationsList";
import ConfigEditor from "./dashboard/ConfigEditor";
import PlantDeviceCard from "./dashboard/DeviceCards";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchDevicesWithStatus } from "../services/apiService";
import SessionArchives from "./dashboard/SessionArchives";
import {
  TreePine,
  AlertCircle,
  CheckCircle,
  Plus,
  Loader2,
} from "lucide-react";

export default function Dashboard({ isDarkMode, setIsDarkMode }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const location = useLocation();
  const navigate = useNavigate();
  const { configId } = useParams();

  // Determine view based on route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/configurations/new")) {
      setCurrentView("config-new");
    } else if (path.includes("/configurations/edit")) {
      setCurrentView("config-edit");
    } else if (path.includes("/configurations")) {
      setCurrentView("configurations");
    } else if (path.includes("/archives")) {
      setCurrentView("archives");
    } else {
      setCurrentView("dashboard");
    }
  }, [location]);

  useEffect(() => {
    if (currentView === "dashboard") {
      fetchDevices();
    }
  }, [currentView]);

  const fetchDevices = async () => {
    try {
      const devicesWithStatus = await fetchDevicesWithStatus();

      const formattedDevices = devicesWithStatus.map((device) => ({
        id: device.id,
        name: device.short_name || "Unnamed Plant",
        location: device.model || "Not Set",
        status: device.status?.toLowerCase() || "offline",
      }));

      setDevices(formattedDevices);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching devices:", err);
      setError(err.message);
      setDevices([]);
      setLoading(false);
    }
  };

  const handleCardClick = (device) => {
    navigate(`/dashboard/devices/${device.id}`);
  };

  const handleHistoryClick = (device) => {
    console.log("View history:", device);
  };

  const handleConfigClick = (device) => {
    navigate(`/devices/${device.id}/config`);
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

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isFullConfigView =
    currentView === "config-new" || currentView === "config-edit";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900"
          : "bg-gradient-to-br from-emerald-50 via-green-50 to-white"
      }`}
    >
      <Sidebar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      <main className="ml-16 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {!isFullConfigView && (
            <div className="mb-6 sm:mb-8">
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                } mb-2`}
              >
                {currentView === "configurations"
                  ? "Configuration Templates"
                  : currentView === "archives"
                  ? "Session Archives"
                  : "Plant Dashboard"}
              </h1>
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } text-sm sm:text-base`}
              >
                {currentView === "configurations"
                  ? "Manage your device configuration templates"
                  : "Monitor and manage all your plant devices in one place"}
              </p>
            </div>
          )}

          {/* Main Content Area */}
          {isFullConfigView ? (
            // Full screen config editor
            <div className="max-w-4xl mx-auto">
              <ConfigEditor isDarkMode={isDarkMode} />
            </div>
          ) : currentView === "configurations" ? (
            // Configuration list view
            <ConfigurationsList isDarkMode={isDarkMode} />
          ) : currentView === "archives" ? (
            <SessionArchives isDarkMode={isDarkMode} />
          ) : (
            // Devices Grid
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
                // Fixed spacing grid with consistent card sizes
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_200px))] gap-6 justify-center sm:justify-start">
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
