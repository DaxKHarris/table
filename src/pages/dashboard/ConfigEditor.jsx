import React, { useState } from "react";
import {
  X,
  Save,
  Settings,
  Search,
  Plus,
  Sun,
  Moon,
  Edit,
  ArrowLeft,
  Trash2,
} from "lucide-react";

const HydroponicConfigPanel = ({ isOpen, onClose, onSave }) => {
  const [view, setView] = useState("list"); // 'list' or 'edit'
  const [activeTab, setActiveTab] = useState("environment");
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewConfig, setIsNewConfig] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [configToDelete, setConfigToDelete] = useState(null);

  // Mock existing configs - replace with your actual data
  const [existingConfigs] = useState([
    { id: 1, name: "Lettuce Standard", humidity: 65, ph: 6.0, ec: 1200 },
    { id: 2, name: "Tomato Flowering", humidity: 70, ph: 6.5, ec: 1800 },
    { id: 3, name: "Herb Mix", humidity: 60, ph: 6.2, ec: 1000 },
    { id: 4, name: "Seedling Start", humidity: 75, ph: 5.8, ec: 800 },
  ]);

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

  const editConfig = (configData) => {
    setConfig({
      name: configData.name,
      humidity: configData.humidity,
      ph: configData.ph,
      ec: configData.ec,
      lighting: configData.lighting || config.lighting,
    });
    setSelectedConfig(configData.id);
    setIsNewConfig(false);
    setView("edit");
  };

  const createNewConfig = () => {
    setConfig({
      name: "",
      humidity: 65,
      ph: 6.5,
      ec: 1200,
      lighting: {
        dayDuration: 16,
        nightDuration: 8,
        transitionTime: 30,
        dayChannels: { red: 80, blue: 75, white: 60, farRed: 20, uv: 15 },
        nightChannels: { red: 0, blue: 0, white: 0, farRed: 5, uv: 0 },
      },
    });
    setSelectedConfig(null);
    setIsNewConfig(true);
    setView("edit");
  };

  const backToList = () => {
    setView("list");
    setActiveTab("environment");
  };

  const confirmDelete = (configItem) => {
    setConfigToDelete(configItem);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (configToDelete) {
      try {
        const response = await fetch(`/api/config/${configToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          console.log("Configuration deleted:", configToDelete.name);
        }
      } catch (error) {
        console.error("Failed to delete configuration:", error);
      }
    }
    setShowDeleteConfirm(false);
    setConfigToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setConfigToDelete(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        onSave?.(config);
        backToList();
      }
    } catch (error) {
      console.error("Failed to save configuration:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredConfigs = existingConfigs.filter((config) =>
    config.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SliderInput = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    unit = "%",
  }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">
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
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #10b981 0%, #10b981 ${
            ((value - min) / (max - min)) * 100
          }%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );

  const NumberInput = ({ label, value, onChange, min, max, step, unit }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      />
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Configuration
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "
              <span className="font-medium">{configToDelete?.name}</span>"? This
              action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`
        fixed top-0 left-0 h-full w-96 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col
      `}
      >
        {view === "list" ? (
          // CONFIGURATION LIST - FULL HEIGHT
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-emerald-50">
              <h2 className="text-lg font-semibold text-gray-800">
                Configurations
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search configurations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={createNewConfig}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {filteredConfigs.map((configItem) => (
                  <div
                    key={configItem.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 mb-2 truncate">
                          {configItem.name}
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <div>pH: {configItem.ph}</div>
                          <div>EC: {configItem.ec} μS/cm</div>
                          <div>Humidity: {configItem.humidity}%</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-3">
                        <button
                          onClick={() => editConfig(configItem)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit configuration"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(configItem)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete configuration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredConfigs.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <div className="text-lg font-medium mb-2">
                      {searchTerm
                        ? "No configurations found"
                        : "No configurations yet"}
                    </div>
                    <div className="text-sm">
                      {searchTerm
                        ? "Try adjusting your search"
                        : "Create your first configuration to get started"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // EDIT VIEW - FULL HEIGHT
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-emerald-50">
              <h2 className="text-lg font-semibold text-gray-800">
                {isNewConfig ? "New Configuration" : "Edit Configuration"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={backToList}
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder="Configuration name..."
                  value={config.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="flex border-b border-gray-200">
              {[
                { id: "environment", label: "Environment" },
                { id: "lighting", label: "Lighting" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "environment" && (
                <div className="space-y-6">
                  <NumberInput
                    label="Humidity (%)"
                    value={config.humidity}
                    onChange={(value) => handleInputChange("humidity", value)}
                    min={0}
                    max={100}
                    step={1}
                  />

                  <NumberInput
                    label="pH Level"
                    value={config.ph}
                    onChange={(value) => handleInputChange("ph", value)}
                    min={0}
                    max={14}
                    step={0.1}
                  />

                  <NumberInput
                    label="EC - Electrical Conductivity (μS/cm)"
                    value={config.ec}
                    onChange={(value) => handleInputChange("ec", value)}
                    min={0}
                    max={3000}
                    step={10}
                  />
                </div>
              )}

              {activeTab === "lighting" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <NumberInput
                        label="Day Duration (hours)"
                        value={config.lighting.dayDuration}
                        onChange={(value) =>
                          handleInputChange("lighting.dayDuration", value)
                        }
                        min={1}
                        max={24}
                        step={1}
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
                      />
                    </div>

                    <NumberInput
                      label="Transition Time (minutes)"
                      value={config.lighting.transitionTime}
                      onChange={(value) =>
                        handleInputChange("lighting.transitionTime", value)
                      }
                      min={0}
                      max={120}
                      step={5}
                    />
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <Sun className="w-4 h-4 text-amber-600" />
                      <h3 className="font-medium text-gray-800">
                        Day Lighting
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <SliderInput
                        label="Red Channel"
                        value={config.lighting.dayChannels.red}
                        onChange={(value) =>
                          handleInputChange("day_red", value)
                        }
                      />
                      <SliderInput
                        label="Blue Channel"
                        value={config.lighting.dayChannels.blue}
                        onChange={(value) =>
                          handleInputChange("day_blue", value)
                        }
                      />
                      <SliderInput
                        label="White Channel"
                        value={config.lighting.dayChannels.white}
                        onChange={(value) =>
                          handleInputChange("day_white", value)
                        }
                      />
                      <SliderInput
                        label="Far Red Channel"
                        value={config.lighting.dayChannels.farRed}
                        onChange={(value) =>
                          handleInputChange("day_farRed", value)
                        }
                      />
                      <SliderInput
                        label="UV Channel"
                        value={config.lighting.dayChannels.uv}
                        onChange={(value) => handleInputChange("day_uv", value)}
                      />
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <Moon className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-medium text-gray-800">
                        Night Lighting
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <SliderInput
                        label="Red Channel"
                        value={config.lighting.nightChannels.red}
                        onChange={(value) =>
                          handleInputChange("night_red", value)
                        }
                      />
                      <SliderInput
                        label="Blue Channel"
                        value={config.lighting.nightChannels.blue}
                        onChange={(value) =>
                          handleInputChange("night_blue", value)
                        }
                      />
                      <SliderInput
                        label="White Channel"
                        value={config.lighting.nightChannels.white}
                        onChange={(value) =>
                          handleInputChange("night_white", value)
                        }
                      />
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
                        onChange={(value) =>
                          handleInputChange("night_uv", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleSave}
                disabled={isSaving || !config.name.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
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
        )}
      </div>
    </>
  );
};

export default HydroponicConfigPanel;
