import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Sun, Moon, ArrowLeft, Plus, Edit3 } from "lucide-react";

const makeDefaultConfig = () => ({
  name: "",
  humidityMin: 55,
  humidityMax: 70,
  phMin: 5.8,
  phMax: 6.6,
  ec: 1200,
  aerator: 50,
  lighting: {
    dayDuration: 16,
    nightDuration: 8,
    startMinutes: 8 * 60, // 08:00
    dayChannels: { red: 80, blue: 75, white: 60, farRed: 20, uv: 15 },
    nightChannels: { red: 0, blue: 0, white: 0, farRed: 5, uv: 0 },
  },
});

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const pad2 = (n) => String(n).padStart(2, "0");
const minutesToHHMM = (mins) => {
  const m = clamp(Math.round(mins), 0, 1439);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${pad2(h)}:${pad2(mm)}`;
};

/** Single value slider isolated from parent event handlers */
const IsolatedSlider = ({
  id,
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = "%",
  onChange,
  isDarkMode,
  formatValue, // optional formatter (e.g., minutes -> HH:MM)
}) => {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => setLocalValue(value), [value]);

  const handleInput = useCallback(
    (e) => {
      const newValue = e.currentTarget.valueAsNumber;
      setLocalValue(newValue);
      onChange(newValue);
    },
    [onChange]
  );

  const display =
    typeof formatValue === "function" ? formatValue(localValue) : localValue;

  return (
    <div className="mb-6" style={{ isolation: "isolate" }}>
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor={id}
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
          {display}
          {unit}
        </span>
      </div>
      <div style={{ position: "relative", isolation: "isolate" }}>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(localValue) ? localValue : 0}
          onInput={handleInput}
          onChange={handleInput}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            height: "20px",
            background: "transparent",
            outline: "none",
            zIndex: 10,
            position: "relative",
          }}
        />
      </div>
    </div>
  );
};

/** Min/Max dual slider */
const IsolatedRangeSlider = ({
  idMin,
  idMax,
  label,
  minValue,
  maxValue,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  onChange,
  isDarkMode,
}) => {
  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);

  useEffect(() => {
    setLocalMin(minValue);
    setLocalMax(maxValue);
  }, [minValue, maxValue]);

  const handleMinInput = useCallback(
    (e) => {
      const v = e.currentTarget.valueAsNumber;
      const nextMin = Math.min(v, localMax);
      if (nextMin !== localMin) {
        setLocalMin(nextMin);
        onChange({ min: nextMin, max: localMax });
      }
    },
    [localMax, localMin, onChange]
  );

  const handleMaxInput = useCallback(
    (e) => {
      const v = e.currentTarget.valueAsNumber;
      const nextMax = Math.max(v, localMin);
      if (nextMax !== localMax) {
        setLocalMax(nextMax);
        onChange({ min: localMin, max: nextMax });
      }
    },
    [localMin, localMax, onChange]
  );

  return (
    <div className="mb-6" style={{ isolation: "isolate" }}>
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor={idMin}
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
          {localMin}
          {unit} – {localMax}
          {unit}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2" style={{ isolation: "isolate" }}>
        <div style={{ position: "relative" }}>
          <input
            id={idMin}
            type="range"
            min={min}
            max={max}
            step={step}
            value={Number.isFinite(localMin) ? localMin : 0}
            onInput={handleMinInput}
            onChange={handleMinInput}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              height: "20px",
              background: "transparent",
              outline: "none",
              zIndex: 10,
              position: "relative",
            }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <input
            id={idMax}
            type="range"
            min={min}
            max={max}
            step={step}
            value={Number.isFinite(localMax) ? localMax : 0}
            onInput={handleMaxInput}
            onChange={handleMaxInput}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              height: "20px",
              background: "transparent",
              outline: "none",
              zIndex: 10,
              position: "relative",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const ConfigEditor = ({ isDarkMode = false }) => {
  const { configId } = useParams();
  const navigate = useNavigate();
  const isNewConfig = !configId;

  const [phases, setPhases] = useState([
    { id: 1, label: "Phase 1", config: makeDefaultConfig() },
  ]);
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("environment");
  const [isSaving, setIsSaving] = useState(false);

  /*
  {
  "name": "Conf name",
  "sections": [
    {
      "data": {
        "aerator": {
          "value": 0.1
        },
        "blue_light": [
          {
            "from": 0,
            "to": 8AM,
            "value": 0
          },
          {
            "from": 8AM,
            "to": 6pm,
            "value": 100000000000000
          },
          {
            "from": 6 pm,
            "to": 12,
            "value": 0
          }
        ],
        "ec": {
          "aggressiveness": 0,
          "high": 0.1,
          "low": 0.1
        },
        "far_red_light": [
          {
            "from": 0,
            "to": 0,
            "value": 0.1
          }
        ],
        "humidity": {
          "aggressiveness": 0,
          "high": 0.1,
          "low": 0.1
        },
        "ph": {
          "aggressiveness": 0,
          "high": 0.1,
          "low": 0.1
        },
        "red_light": [
          {
            "from": 0,
            "to": 0,
            "value": 0.1
          }
        ],
        "uv_light": [
          {
            "from": 0,
            "to": 0,
            "value": 0.1
          }
        ],
        "white_light": [
          {
            "from": 0,
            "to": 0,
            "value": 0.1
          }
        ]
      },
      "max_time": 0,
      "name": "string"
    }
  ]
}
  */

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { phases };
      const url = isNewConfig
        ? "/api/configurations"
        : `/api/configurations/${configId}`;
      const method = isNewConfig ? "POST" : "PUT";
      // API Call for [create/update configuration with phases] here
      console.log("SAVE payload (stub):", payload, method, url);
      navigate("/dashboard/configurations");
    } catch (e) {
      console.error("Save failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => navigate("/dashboard/configurations");

  const config = phases[activePhaseIdx]?.config || makeDefaultConfig();

  // Prevent event bubbling that might interfere
  const handleContainerClick = useCallback((e) => {
    if (e.target.type === "range") e.stopPropagation();
  }, []);

  const updateConfig = useCallback(
    (updater) => {
      setPhases((prev) => {
        const next = [...prev];
        const current = { ...next[activePhaseIdx] };
        current.config = updater({ ...current.config });
        next[activePhaseIdx] = current;
        return next;
      });
    },
    [activePhaseIdx]
  );

  const handleInputChange = useCallback(
    (field, value) => {
      if (field.startsWith("day_") || field.startsWith("night_")) {
        const [period, channel] = field.split("_");
        const channelKey = `${period}Channels`;
        updateConfig((prev) => ({
          ...prev,
          lighting: {
            ...prev.lighting,
            [channelKey]: {
              ...prev.lighting[channelKey],
              [channel]: value,
            },
          },
        }));
      } else if (field.startsWith("lighting.")) {
        const lightingField = field.replace("lighting.", "");
        if (lightingField === "dayDuration") {
          const day = clamp(value, 0, 24);
          const night = clamp(24 - day, 0, 24);
          updateConfig((prev) => ({
            ...prev,
            lighting: {
              ...prev.lighting,
              dayDuration: day,
              nightDuration: night,
            },
          }));
        } else if (lightingField === "nightDuration") {
          const night = clamp(value, 0, 24);
          const day = clamp(24 - night, 0, 24);
          updateConfig((prev) => ({
            ...prev,
            lighting: {
              ...prev.lighting,
              dayDuration: day,
              nightDuration: night,
            },
          }));
        } else if (lightingField === "startMinutes") {
          updateConfig((prev) => ({
            ...prev,
            lighting: { ...prev.lighting, startMinutes: clamp(value, 0, 1439) },
          }));
        }
      } else if (field === "humidityRange") {
        const { min, max } = value;
        updateConfig((prev) => ({
          ...prev,
          humidityMin: min,
          humidityMax: max,
        }));
      } else if (field === "phRange") {
        const { min, max } = value;
        updateConfig((prev) => ({ ...prev, phMin: min, phMax: max }));
      } else if (field === "name") {
        updateConfig((prev) => ({ ...prev, [field]: String(value) }));
      } else {
        updateConfig((prev) => ({ ...prev, [field]: value }));
      }
    },
    [updateConfig]
  );

  const addPhase = useCallback(() => {
    setPhases((prev) => {
      const next = [
        ...prev,
        {
          id: Date.now(),
          label: `Phase ${prev.length + 1}`,
          config: makeDefaultConfig(),
        },
      ];
      return next;
    });
    setActivePhaseIdx((idx) => idx + 1);
  }, []);

  const renameActivePhase = useCallback(
    (label) => {
      setPhases((prev) => {
        const next = [...prev];
        next[activePhaseIdx] = { ...next[activePhaseIdx], label };
        return next;
      });
    },
    [activePhaseIdx]
  );

  return (
    <div
      className="max-w-5xl mx-auto"
      onClick={handleContainerClick}
      style={{ isolation: "isolate" }}
    >
      {/* Cross-browser slider styling + Chrome centering fix */}
      <style>{`
        input[type="range"] { -webkit-appearance: none !important; appearance: none !important; background: transparent; }
        input[type="range"]::-webkit-slider-runnable-track { width: 100%; height: 4px; background: ${
          isDarkMode ? "#374151" : "#e5e7eb"
        }; border-radius: 2px; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none !important; appearance: none !important; height: 20px; width: 20px; border-radius: 50%; background: #10b981; cursor: pointer; border: none; margin-top: -8px; }
        input[type="range"]::-moz-range-track { width: 100%; height: 4px; background: ${
          isDarkMode ? "#374151" : "#e5e7eb"
        }; border-radius: 2px; }
        input[type="range"]::-moz-range-thumb { height: 20px; width: 20px; border-radius: 50%; background: #10b981; cursor: pointer; border: none; }
      `}</style>

      {/* Header with Back */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={handleBack}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? "text-gray-300 hover:text-white hover:bg-gray-700"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          }`}
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Configuration Editor
        </h1>
      </div>

      {/* Configuration Name */}
      <div
        className={`rounded-xl border mb-6 p-4 ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <label
          className={`block text-xs font-medium mb-1 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Configuration Name
        </label>
        <input
          type="text"
          placeholder="e.g., Lettuce - Veg Template"
          value={config.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`w-full text-base bg-transparent border rounded-md px-3 py-2 ${
            isDarkMode
              ? "text-gray-100 border-gray-700 placeholder-gray-500"
              : "text-gray-800 border-gray-300 placeholder-gray-400"
          }`}
        />
      </div>

      {/* Phases bar + add */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
        {phases.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setActivePhaseIdx(idx)}
            className={`px-3 py-1.5 rounded-lg border text-sm whitespace-nowrap transition-colors ${
              idx === activePhaseIdx
                ? isDarkMode
                  ? "bg-emerald-600/90 border-emerald-500 text-white"
                  : "bg-emerald-500 border-emerald-500 text-white"
                : isDarkMode
                ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            title={p.label}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={addPhase}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm ${
            isDarkMode
              ? "bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          title="Add Phase"
          aria-label="Add Phase"
        >
          <Plus className="w-4 h-4" /> Add Phase
        </button>
      </div>

      {/* Phase rename */}
      <div
        className={`rounded-xl border mb-6 p-4 ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-end gap-3">
          {/* Phase Title (long) */}
          <div className="flex-1">
            <label
              className={`block text-xs font-medium mb-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Phase Title
            </label>
            <input
              type="text"
              value={phases[activePhaseIdx]?.label || ""}
              onChange={(e) => renameActivePhase(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-600"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              placeholder="e.g., Seedling, Vegetative, Bloom"
            />
          </div>

          {/* Gap to Next: Days / Hours / Minutes */}
          {(() => {
            const g = phases[activePhaseIdx]?.gapToNext || {
              days: 0,
              hours: 0,
              minutes: 0,
            };
            return (
              <div className="flex items-end gap-2">
                <div className="w-20">
                  <label
                    className={`block text-[11px] font-medium mb-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Days
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={g.days}
                    onChange={(e) => setGapForActive("days", e.target.value)}
                    className={`no-spinners w-full px-2 py-2 rounded-md border text-sm ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    style={{}}
                  />
                </div>
                <div className="w-20">
                  <label
                    className={`no-spinners block text-[11px] font-medium mb-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Hours
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    step={1}
                    value={g.hours}
                    onChange={(e) => setGapForActive("hours", e.target.value)}
                    className={`no-spinners w-full px-2 py-2 rounded-md border text-sm ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div className="w-24">
                  <label
                    className={`block text-[11px] font-medium mb-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Minutes
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    step={1}
                    value={g.minutes}
                    onChange={(e) => setGapForActive("minutes", e.target.value)}
                    className={`no-spinners w-full px-2 py-2 rounded-md border text-sm ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            );
          })()}
        </div>
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
              <IsolatedRangeSlider
                idMin="humidityMin"
                idMax="humidityMax"
                label="Humidity Range"
                minValue={config.humidityMin}
                maxValue={config.humidityMax}
                min={0}
                max={100}
                step={1}
                unit="%"
                onChange={(r) => handleInputChange("humidityRange", r)}
                isDarkMode={isDarkMode}
              />
              <IsolatedRangeSlider
                idMin="phMin"
                idMax="phMax"
                label="pH Range"
                minValue={config.phMin}
                maxValue={config.phMax}
                min={0}
                max={14}
                step={0.1}
                unit=""
                onChange={(r) => handleInputChange("phRange", r)}
                isDarkMode={isDarkMode}
              />
            </div>
            <div>
              <IsolatedSlider
                id="ec"
                label="Minimum EC (μS/cm)"
                value={config.ec}
                min={0}
                max={3000}
                step={10}
                unit=""
                onChange={(v) => handleInputChange("ec", v)}
                isDarkMode={isDarkMode}
              />
              <IsolatedSlider
                id="aerator"
                label="Aerator"
                value={config.aerator}
                min={0}
                max={100}
                step={1}
                unit="%"
                onChange={(v) => handleInputChange("aerator", v)}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}

        {activeTab === "lighting" && (
          <div className="space-y-8">
            {/* Timing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <IsolatedSlider
                id="dayDuration"
                label="Day Duration (hours)"
                value={config.lighting.dayDuration}
                min={0}
                max={24}
                step={1}
                unit="h"
                onChange={(v) => handleInputChange("lighting.dayDuration", v)}
                isDarkMode={isDarkMode}
              />
              <IsolatedSlider
                id="nightDuration"
                label="Night Duration (hours)"
                value={config.lighting.nightDuration}
                min={0}
                max={24}
                step={1}
                unit="h"
                onChange={(v) => handleInputChange("lighting.nightDuration", v)}
                isDarkMode={isDarkMode}
              />
              <IsolatedSlider
                id="startMinutes"
                label="Lights On Time"
                value={config.lighting.startMinutes}
                min={0}
                max={1439}
                step={15}
                unit=""
                onChange={(v) => handleInputChange("lighting.startMinutes", v)}
                isDarkMode={isDarkMode}
                formatValue={minutesToHHMM}
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
                  <IsolatedSlider
                    id="day_red"
                    label="Red"
                    value={config.lighting.dayChannels.red}
                    onChange={(v) => handleInputChange("day_red", v)}
                    isDarkMode={isDarkMode}
                  />
                  <IsolatedSlider
                    id="day_blue"
                    label="Blue"
                    value={config.lighting.dayChannels.blue}
                    onChange={(v) => handleInputChange("day_blue", v)}
                    isDarkMode={isDarkMode}
                  />
                  <IsolatedSlider
                    id="day_white"
                    label="White"
                    value={config.lighting.dayChannels.white}
                    onChange={(v) => handleInputChange("day_white", v)}
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div>
                  <IsolatedSlider
                    id="day_farRed"
                    label="Far Red"
                    value={config.lighting.dayChannels.farRed}
                    onChange={(v) => handleInputChange("day_farRed", v)}
                    isDarkMode={isDarkMode}
                  />
                  <IsolatedSlider
                    id="day_uv"
                    label="UV"
                    value={config.lighting.dayChannels.uv}
                    onChange={(v) => handleInputChange("day_uv", v)}
                    isDarkMode={isDarkMode}
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
                    isDarkMode ? "text-indigo-600" : "text-indigo-700"
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
                  <IsolatedSlider
                    id="night_red"
                    label="Red"
                    value={config.lighting.nightChannels.red}
                    onChange={(v) => handleInputChange("night_red", v)}
                    isDarkMode={isDarkMode}
                  />
                  <IsolatedSlider
                    id="night_blue"
                    label="Blue"
                    value={config.lighting.nightChannels.blue}
                    onChange={(v) => handleInputChange("night_blue", v)}
                    isDarkMode={isDarkMode}
                  />
                  <IsolatedSlider
                    id="night_white"
                    label="White"
                    value={config.lighting.nightChannels.white}
                    onChange={(v) => handleInputChange("night_white", v)}
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div>
                  <IsolatedSlider
                    id="night_farRed"
                    label="Far Red"
                    value={config.lighting.nightChannels.farRed}
                    onChange={(v) => handleInputChange("night_farRed", v)}
                    isDarkMode={isDarkMode}
                  />
                  <IsolatedSlider
                    id="night_uv"
                    label="UV"
                    value={config.lighting.nightChannels.uv}
                    onChange={(v) => handleInputChange("night_uv", v)}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-8 py-3 font-medium rounded-lg transition-colors flex items-center gap-3 ${
            isSaving
              ? "bg-emerald-500/70 text-white cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <Save className="w-5 h-5" />
          <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
        </button>
      </div>
    </div>
  );
};

export default ConfigEditor;
