// New file: src/pages/dashboard/SessionArchives.jsx
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Leaf, Package } from "lucide-react";

const SessionArchives = ({ isDarkMode }) => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    setArchives([
      {
        id: "session_001",
        plantName: "Lettuce Batch #3",
        deviceName: "Hydroponic Garden #1",
        startDate: "2024-08-15",
        endDate: "2024-10-02",
        duration: "48 days",
        configsUsed: ["Lettuce - Vegetative", "Lettuce - Harvest"],
      },
      {
        id: "session_002",
        plantName: "Basil Grow",
        deviceName: "Herb Garden",
        startDate: "2024-07-01",
        endDate: "2024-08-10",
        duration: "40 days",
        configsUsed: ["Herbs - Quick Harvest"],
      },
    ]);
    setLoading(false);
  }, []);

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

  if (archives.length === 0) {
    return (
      <div
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        } rounded-2xl shadow-lg p-12 border text-center`}
      >
        <Package
          className={`w-16 h-16 ${
            isDarkMode ? "text-gray-600" : "text-gray-400"
          } mx-auto mb-4`}
        />
        <h2
          className={`text-xl font-bold ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          } mb-2`}
        >
          No Archived Sessions Yet
        </h2>
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Completed grow sessions will appear here
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } rounded-2xl shadow-lg p-6 border`}
    >
      <h2
        className={`text-xl font-semibold ${
          isDarkMode ? "text-gray-100" : "text-gray-800"
        } mb-6`}
      >
        Archived Grow Sessions
      </h2>

      <div className="space-y-4">
        {archives.map((session) => (
          <div
            key={session.id}
            className={`${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-200"
            } border rounded-lg p-4`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  />
                  <h3
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {session.plantName}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      Device:
                    </span>
                    <span
                      className={`ml-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {session.deviceName}
                    </span>
                  </div>
                  <div>
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      Duration:
                    </span>
                    <span
                      className={`ml-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {session.duration}
                    </span>
                  </div>
                  <div>
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      Started:
                    </span>
                    <span
                      className={`ml-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {session.startDate}
                    </span>
                  </div>
                  <div>
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      Ended:
                    </span>
                    <span
                      className={`ml-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {session.endDate}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Configs used:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {session.configsUsed.map((config, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-1 rounded ${
                          isDarkMode
                            ? "bg-emerald-900/30 text-emerald-300"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {config}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionArchives;
