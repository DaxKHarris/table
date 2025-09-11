import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Sun, Moon, ArrowLeft } from "lucide-react";

const ConfigEditor = ({ isDarkMode }) => {
  const { configId } = useParams();
  const navigate = useNavigate();
  const isNewConfig = !configId;

  const [activeTab, setActiveTab] = useState("environment");
  const [config, setConfig] = useState({
    name: "",
    humidity: 65,
    ph: 6.5,
    ec: 1200,
    lighting: {
      dayDuration: 16,
      nightDuration: 8,
      transitionTime: 30,
      dayChannels: {
        red: 80,
        blue: 75,
        white: 60,
        farRed: 20,
        uv: 15,
      },
      nightChannels: {
        red: 0,
        blue: 0,
        white: 0,
        farRed: 5,
        uv: 0,
      },
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(!isNewConfig);

  useEffect(() => {
    if (configId) {
      fetchConfig();
    }
  }, [configId]);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`/api/configurations/${configId}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch configuration:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith("day_") || field.startsWith("night_")) {
      const [period, channel] = field.split("_");
      const channelKey = `${period}Channels`;
      setConfig((prev) => ({
        ...prev,
        lighting: {
          ...prev.lighting,
          [channelKey]: {
            ...prev.lighting[channelKey],
            [channel]: parseFloat(value) || 0,
          },
        },
      }));
    } else if (field.startsWith("lighting.")) {
      const lightingField = field.replace("lighting.", "");
      setConfig((prev) => ({
        ...prev,
        lighting: {
          ...prev.lighting,
          [lightingField]: parseFloat(value) || value,
        },
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        [field]: field === "name" ? value : parseFloat(value) || 0,
      }));
    }
  };

  const handleSave = async () => {
    if (!config.name.trim()) {
      alert("Please enter a configuration name");
      return;
    }

    setIsSaving(true);
    try {
      const url = isNewConfig
        ? "/api/configurations"
        : `/api/configurations/${configId}`;
      const method = isNewConfig ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
      });

      if (response.ok) {
        navigate("/dashboard/configurations");
      } else {
        throw new Error("Failed to save configuration");
      }
    } catch (error) {
      console.error("Failed to save configuration:", error);
      alert("Failed to save configuration. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard/configurations");
  };

  const SliderInput = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    unit = "%",
  }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <label
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </label>
        <span
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        }`}
        style={{
          background: `linear-gradient(to right, #10b981 0%, #10b981 ${
            ((value - min) / (max - min)) * 100
          }%, ${isDarkMode ? "#374151" : "#e5e7eb"} ${
            ((value - min) / (max - min)) * 100
          }%, ${isDarkMode ? "#374151" : "#e5e7eb"} 100%)`,
        }}
      />
    </div>
  );

  const NumberInput = ({ label, value, onChange, min, max, step, unit }) => (
    <div className="mb-6">
      <label
        className={`block text-sm font-medium ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        } mb-3`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-gray-100"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        />
        {unit && (
          <span
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className={`w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin`}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBack}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Configuration name..."
            value={config.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`flex-1 text-2xl font-bold bg-transparent border-none outline-none ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            } placeholder-gray-400`}
          />
        </div>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          } ml-14`}
        >
          {isNewConfig
            ? "Create a new device configuration template"
            : "Edit configuration template"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-8">
        {[
          { id: "environment", label: "Environment" },
          { id: "lighting", label: "Lighting" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "text-emerald-600 border-emerald-600"
                : isDarkMode
                ? "text-gray-400 border-transparent hover:text-gray-300"
                : "text-gray-600 border-transparent hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mb-8">
        {activeTab === "environment" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <NumberInput
                label="Humidity (%)"
                value={config.humidity}
                onChange={(value) => handleInputChange("humidity", value)}
                min={0}
                max={100}
                step={1}
                unit="%"
              />

              <NumberInput
                label="pH Level"
                value={config.ph}
                onChange={(value) => handleInputChange("ph", value)}
                min={0}
                max={14}
                step={0.1}
              />
            </div>

            <div>
              <NumberInput
                label="EC - Electrical Conductivity"
                value={config.ec}
                onChange={(value) => handleInputChange("ec", value)}
                min={0}
                max={3000}
                step={10}
                unit="μS/cm"
              />
            </div>
          </div>
        )}

        {activeTab === "lighting" && (
          <div className="space-y-8">
            {/* Timing Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NumberInput
                label="Day Duration (hours)"
                value={config.lighting.dayDuration}
                onChange={(value) =>
                  handleInputChange("lighting.dayDuration", value)
                }
                min={1}
                max={24}
                step={1}
                unit="h"
              />
              <NumberInput
                label="Night Duration (hours)"
                value={config.lighting.nightDuration}
                onChange={(value) =>
                  handleInputChange("lighting.nightDuration", value)
                }
                min={0}
                max={23}
                step={1}
                unit="h"
              />
              <NumberInput
                label="Transition Time (minutes)"
                value={config.lighting.transitionTime}
                onChange={(value) =>
                  handleInputChange("lighting.transitionTime", value)
                }
                min={0}
                max={120}
                step={5}
                unit="min"
              />
            </div>

            {/* Day Lighting */}
            <div
              className={`p-6 rounded-xl ${
                isDarkMode
                  ? "bg-amber-950/30 border border-amber-800/50"
                  : "bg-amber-50 border border-amber-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Sun
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-amber-400" : "text-amber-600"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Day Lighting Channels
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <SliderInput
                    label="Red Channel"
                    value={config.lighting.dayChannels.red}
                    onChange={(value) => handleInputChange("day_red", value)}
                  />
                  <SliderInput
                    label="Blue Channel"
                    value={config.lighting.dayChannels.blue}
                    onChange={(value) => handleInputChange("day_blue", value)}
                  />
                  <SliderInput
                    label="White Channel"
                    value={config.lighting.dayChannels.white}
                    onChange={(value) => handleInputChange("day_white", value)}
                  />
                </div>
                <div>
                  <SliderInput
                    label="Far Red Channel"
                    value={config.lighting.dayChannels.farRed}
                    onChange={(value) => handleInputChange("day_farRed", value)}
                  />
                  <SliderInput
                    label="UV Channel"
                    value={config.lighting.dayChannels.uv}
                    onChange={(value) => handleInputChange("day_uv", value)}
                  />
                </div>
              </div>
            </div>

            {/* Night Lighting */}
            <div
              className={`p-6 rounded-xl ${
                isDarkMode
                  ? "bg-indigo-950/30 border border-indigo-800/50"
                  : "bg-indigo-50 border border-indigo-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Moon
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Night Lighting Channels
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <SliderInput
                    label="Red Channel"
                    value={config.lighting.nightChannels.red}
                    onChange={(value) => handleInputChange("night_red", value)}
                  />
                  <SliderInput
                    label="Blue Channel"
                    value={config.lighting.nightChannels.blue}
                    onChange={(value) => handleInputChange("night_blue", value)}
                  />
                  <SliderInput
                    label="White Channel"
                    value={config.lighting.nightChannels.white}
                    onChange={(value) =>
                      handleInputChange("night_white", value)
                    }
                  />
                </div>
                <div>
                  <SliderInput
                    label="Far Red Channel"
                    value={config.lighting.nightChannels.farRed}
                    onChange={(value) =>
                      handleInputChange("night_farRed", value)
                    }
                  />
                  <SliderInput
                    label="UV Channel"
                    value={config.lighting.nightChannels.uv}
                    onChange={(value) => handleInputChange("night_uv", value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || !config.name.trim()}
          className={`px-8 py-3 font-medium rounded-lg transition-colors flex items-center gap-3 ${
            isSaving || !config.name.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <Save className="w-5 h-5" />
          <span>
            {isSaving
              ? "Saving..."
              : isNewConfig
              ? "Save New Configuration"
              : "Update Configuration"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ConfigEditor;
