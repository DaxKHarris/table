import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Settings,
  Leaf,
  Droplets,
  Zap,
  Activity,
} from "lucide-react";

const ConfigurationsList = ({ isDarkMode }) => {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      // API Call for [configurations] here
      // Example:
      // const res = await fetch("/api/configurations", { credentials: "include" });
      // const data = await res.json();
      // setConfigurations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch configurations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (configId) => {
    navigate(`/dashboard/configurations/edit/${configId}`);
  };

  const handleDelete = async (configId) => {
    if (window.confirm("Are you sure you want to delete this configuration?")) {
      // API Call for [delete configuration] here
      setConfigurations((prev) => prev.filter((c) => c.id !== configId));
    }
  };

  const handleDuplicate = (config) => {
    // API Call for [duplicate configuration] here
    // For now, optimistic UI can be implemented after API exists
    console.log("Duplicate configuration:", config);
  };

  const handleCreateNew = () => {
    navigate("/dashboard/configurations/new");
  };

  // Loading state
  if (loading) {
    return (
      <div
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        } rounded-2xl shadow-lg p-8 border`}
      >
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Empty state
  if (configurations.length === 0) {
    return (
      <div
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        } rounded-2xl shadow-lg p-8 sm:p-12 border text-center`}
      >
        <div className="max-w-md mx-auto">
          <div
            className={`w-24 h-24 ${
              isDarkMode ? "bg-emerald-950" : "bg-emerald-100"
            } rounded-full flex items-center justify-center mx-auto mb-6`}
          >
            <Settings
              className={`w-12 h-12 ${
                isDarkMode ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>

          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            } mb-3`}
          >
            No Configuration Templates Yet
          </h2>

          <p
            className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-8`}
          >
            Configuration templates help you quickly set up new devices with
            pre-defined settings for different plant types. Create your first
            template to get started!
          </p>

          <div className="text-left mb-8 space-y-3">
            {[
              "Set optimal humidity, pH, and EC levels",
              "Configure custom lighting schedules",
              "Save templates for different plant types",
              "Apply configurations to multiple devices",
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full ${
                    isDarkMode ? "bg-emerald-950" : "bg-emerald-100"
                  } flex items-center justify-center flex-shrink-0 mt-0.5`}
                >
                  <Leaf
                    className={`w-3 h-3 ${
                      isDarkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleCreateNew}
            className={`px-6 py-3 ${
              isDarkMode
                ? "bg-emerald-700 hover:bg-emerald-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            } text-white rounded-lg transition-colors inline-flex items-center gap-2 font-medium`}
          >
            <Plus className="w-5 h-5" />
            Create Your First Configuration
          </button>
        </div>
      </div>
    );
  }

  // Configurations list
  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } rounded-2xl shadow-lg p-4 sm:p-6 border`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-lg sm:text-xl font-semibold ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Configuration Templates
        </h2>
        <button
          onClick={handleCreateNew}
          className={`px-4 py-2 ${
            isDarkMode
              ? "bg-emerald-700 hover:bg-emerald-600"
              : "bg-emerald-500 hover:bg-emerald-600"
          } text-white rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base`}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Template</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configurations.map((config) => (
          <div
            key={config.id}
            className={`${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600 hover:border-emerald-700"
                : "bg-gray-50 border-gray-200 hover:border-emerald-400"
            } border rounded-xl p-4 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3
                  className={`font-semibold ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  } mb-1`}
                >
                  {config.name}
                </h3>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {config.devices} device{config.devices !== 1 ? "s" : ""} using
                  this
                </p>
              </div>
              <div
                className={`w-10 h-10 ${
                  isDarkMode ? "bg-emerald-950/50" : "bg-emerald-100"
                } rounded-lg flex items-center justify-center`}
              >
                <Leaf
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Droplets
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-blue-400" : "text-blue-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Humidity: {config.humidity}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-yellow-400" : "text-yellow-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  pH: {config.ph}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-purple-400" : "text-purple-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  EC: {config.ec} μS/cm
                </span>
              </div>
            </div>

            <div
              className={`text-xs ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              } mb-3`}
            >
              Modified: {config.lastModified}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(config.id)}
                className={`flex-1 p-2 ${
                  isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                } rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDuplicate(config)}
                className={`p-2 ${
                  isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500 text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                } rounded-lg transition-colors`}
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(config.id)}
                className={`p-2 ${
                  isDarkMode
                    ? "bg-red-900/50 hover:bg-red-800/50 text-red-400"
                    : "bg-red-50 hover:bg-red-100 text-red-500"
                } rounded-lg transition-colors`}
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigurationsList;
