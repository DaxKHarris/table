import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchConfigurations,
  deleteConfiguration,
} from "../../services/apiService";
import { ConfigCard } from "../DeviceTimelineConfig";
import { Plus, Settings, Leaf } from "lucide-react";

const ConfigurationsList = ({ isDarkMode }) => {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      const configs = await fetchConfigurations();
      setConfigurations(configs);
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
      try {
        await deleteConfiguration(configId);
        setConfigurations((prev) => prev.filter((c) => c.id !== configId));
      } catch (error) {
        console.error("Failed to delete configuration:", error);
      }
    }
  };

  const handleDuplicate = async (config) => {
    try {
      const duplicated = await duplicateConfiguration(config.id);
      setConfigurations((prev) => [...prev, duplicated]);
    } catch (error) {
      console.error("Failed to duplicate configuration:", error);
    }
  };

  const handleCreateNew = () => {
    navigate("/dashboard/configurations/new");
  };

  const handleEditConfig = (configId) => {
    navigate(`/dashboard/configurations/edit/${configId}`);
  };

  const handlePhaseClick = (configId, phaseIndex, phase) => {
    navigate(`/dashboard/configurations/edit/${configId}?phase=${phaseIndex}`);
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
      <div className="flex flex-wrap gap-6">
        {configurations.map((config) => (
          <ConfigCard
            key={config.id}
            config={config}
            onEditConfig={handleEditConfig}
            onPhaseClick={handlePhaseClick}
            onDeleteConfig={handleDelete}
            theme={{
              textPrimary: isDarkMode ? "text-gray-100" : "text-gray-800",
            }}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default ConfigurationsList;
