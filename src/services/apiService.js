// API Service - Centralized API calls and mock data
// This file contains all API endpoints and mock data for the plant monitoring system
// Note: User authentication APIs are handled separately in authService.js

// =============================================================================
// DEVICE APIs
// =============================================================================

// API Call for [devices] - Fetch all user devices
export const fetchUserDevices = async () => {
  try {
    // Force fallback to mock data for now
    throw new Error("API not implemented yet");

    // API Call for [devices] here
    // const response = await fetch("/api/user/devices", {
    //   method: "GET",
    //   credentials: "include",
    // });
    //
    // if (!response.ok) {
    //   throw new Error("Failed to fetch devices");
    // }
    //
    // const apiResponse = await response.json();
    // return apiResponse.data || [];
  } catch (error) {
    console.error("Error fetching user devices:", error);

    // Mock data fallback
    const mockDevices = [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
        user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        short_name: "Hydroponic Garden #1",
        model: "TabletopFarmV1",
        claimed_at: "2025-09-19T20:15:38.601Z",
        created: "2025-09-19T20:15:38.601Z",
        updated: "2025-09-19T20:15:38.601Z",
      },
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
        user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        short_name: "Lettuce Station",
        model: "TabletopFarmV1",
        claimed_at: "2025-09-18T15:30:20.401Z",
        created: "2025-09-18T15:30:20.401Z",
        updated: "2025-09-19T10:22:15.201Z",
      },
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa3",
        user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        short_name: "Herb Garden",
        model: "TabletopFarmV1",
        claimed_at: "2025-09-17T09:45:12.301Z",
        created: "2025-09-17T09:45:12.301Z",
        updated: "2025-09-17T09:45:12.301Z",
      },
    ];

    return mockDevices;
  }
};

// API Call for [device statuses] - Fetch statuses for all user devices
export const fetchDeviceStatuses = async () => {
  try {
    // Force fallback to mock data for now
    throw new Error("API not implemented yet");

    // API call to get device statuses
    // const response = await fetch("/api/user/devices/status", {
    //   method: "GET",
    //   credentials: "include",
    // });
    //
    // if (!response.ok) {
    //   throw new Error("Failed to fetch device statuses");
    // }
    //
    // const apiResponse = await response.json();
    // return apiResponse.data || [];
  } catch (error) {
    console.error("Error fetching device statuses:", error);

    // Mock status data fallback
    const mockStatuses = [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
        status: "Healthy",
      },
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
        status: "Warning",
      },
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa3",
        status: "Offline",
      },
    ];

    return mockStatuses;
  }
};

// Helper function to combine devices with their statuses
export const fetchDevicesWithStatus = async () => {
  try {
    // Fetch devices and statuses in parallel
    const [devices, statuses] = await Promise.all([
      fetchUserDevices(),
      fetchDeviceStatuses(),
    ]);

    // Create a status lookup map
    const statusMap = new Map(statuses.map((s) => [s.id, s.status]));

    // Combine devices with their status
    const devicesWithStatus = devices.map((device) => ({
      ...device,
      status: statusMap.get(device.id) || "Unknown",
    }));

    return devicesWithStatus;
  } catch (error) {
    console.error("Error fetching devices with status:", error);
    throw error;
  }
};

// API Call for [device details] - Fetch specific device information
export const fetchDeviceDetails = async (deviceId) => {
  try {
    // Force fallback to mock data for now
    throw new Error("API not implemented yet");

    // API call to get device information
    // const response = await fetch(`/api/devices/${deviceId}`, {
    //   method: "GET",
    //   credentials: "include",
    // });
    //
    // if (!response.ok) {
    //   throw new Error("Failed to fetch device data");
    // }
    //
    // const data = await response.json();
    // return data.data || data;
  } catch (error) {
    console.error("Error fetching device details:", error);

    // Mock data fallback
    const mockDevice = {
      id: deviceId,
      name: "Hydroponic Garden #1",
      location: "Greenhouse Bay 2",
      status: "healthy",
    };

    return mockDevice;
  }
};

// API Call for [device sensor data] - Get current sensor readings
export const fetchDeviceSensorData = async (deviceId) => {
  try {
    // Force fallback to mock data for now
    throw new Error("API not implemented yet");

    // API call to get current sensor readings
    // const response = await fetch(`/api/devices/${deviceId}/sensors`, {
    //   method: "GET",
    //   credentials: "include",
    // });
    //
    // if (!response.ok) {
    //   throw new Error("Failed to fetch sensor data");
    // }
    //
    // const data = await response.json();
    // return data.data || data;
  } catch (error) {
    console.error("Error fetching device sensor data:", error);

    // Mock sensor data fallback
    const mockSensorData = {
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
    };

    return mockSensorData;
  }
};

// API Call for [device logs] - Get recent log messages
export const fetchDeviceLogs = async (deviceId, limit = 10) => {
  try {
    // Force fallback to mock data for now
    throw new Error("API not implemented yet");

    // API call to get recent log messages
    // const response = await fetch(`/api/devices/${deviceId}/logs?limit=${limit}`, {
    //   method: "GET",
    //   credentials: "include",
    // });
    //
    // if (!response.ok) {
    //   throw new Error("Failed to fetch logs");
    // }
    //
    // const data = await response.json();
    // return data.data || data;
  } catch (error) {
    console.error("Error fetching device logs:", error);

    // Mock log data fallback
    const mockLogs = [
      {
        id: 1,
        message: "pH levels slightly acidic - monitoring closely",
        timestamp: Date.now() - 30000,
        type: "warning",
      },
      {
        id: 2,
        message: "System initialized successfully",
        timestamp: Date.now() - 60000,
        type: "success",
      },
      {
        id: 3,
        message: "Nutrient levels optimal",
        timestamp: Date.now() - 120000,
        type: "info",
      },
      {
        id: 4,
        message: "LED channels calibrated",
        timestamp: Date.now() - 180000,
        type: "success",
      },
    ];

    return mockLogs;
  }
};

// API Call for [device timeline] - Get timeline configurations
export const fetchDeviceTimeline = async (deviceId) => {
  try {
    // Force fallback to mock data for now
    throw new Error("API not implemented yet");

    // API call to get timeline configurations
    // const response = await fetch(`/api/devices/${deviceId}/timeline`, {
    //   method: "GET",
    //   credentials: "include",
    // });
    //
    // if (!response.ok) {
    //   throw new Error("Failed to fetch timeline");
    // }
    //
    // const data = await response.json();
    // return data.data || data;
  } catch (error) {
    console.error("Error fetching device timeline:", error);

    // Mock timeline data fallback
    const mockTimeline = [
      {
        id: 1,
        configName: "Lettuce - Vegetative Template",
        configId: "config_a",
        phases: [
          {
            name: "Seedling Phase",
            duration: { days: 7, hours: 0, minutes: 0 },
          },
          {
            name: "Growth Phase",
            duration: { days: 14, hours: 0, minutes: 0 },
          },
        ],
        status: "active",
        currentPhase: 0,
        startedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
      },
      {
        id: 2,
        configName: "Herbs - Quick Harvest",
        configId: "config_c",
        phases: [
          {
            name: "Rapid Growth",
            duration: { days: 10, hours: 12, minutes: 30 },
          },
        ],
        status: "upcoming",
        currentPhase: 0,
      },
    ];

    return mockTimeline;
  }
};

// =============================================================================
// CONFIGURATION APIs
// =============================================================================

// API Call for [configurations] - Fetch all configuration templates
export const fetchConfigurations = async () => {
  try {
    const response = await fetch("/api/user/configs", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch configurations");
    }
    const apiResponse = await response.json();
    const configs = apiResponse.data || [];

    // Transform API format (sections) to UI format (phases)
    const transformedConfigs = configs.map((config) => ({
      ...config,
      phases: config.sections
        ? config.sections
            .sort((a, b) => a.sequence - b.sequence) // Sort by sequence first!
            .map((section) => ({
              name: section.name,
              duration: {
                days: Math.floor(section.max_time / 86400),
                hours: Math.floor((section.max_time % 86400) / 3600),
                minutes: Math.floor((section.max_time % 3600) / 60),
              },
            }))
        : [],
    }));

    return transformedConfigs;
  } catch (error) {
    console.error("Error fetching configurations:", error);
    throw error;
  }
};

// API Call for [get specific configuration] - Fetch single configuration by ID
export const fetchConfigurationById = async (configId) => {
  try {
    const response = await fetch(`/api/user/config/${configId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch configuration");
    }
    const apiResponse = await response.json();
    const config = apiResponse.data;

    // Transform to match the other function's format
    return {
      ...config,
      phases: config.sections
        ? config.sections
            .sort((a, b) => a.sequence - b.sequence)
            .map((section) => ({
              name: section.name,
              duration: {
                days: Math.floor(section.max_time / 86400),
                hours: Math.floor((section.max_time % 86400) / 3600),
                minutes: Math.floor((section.max_time % 3600) / 60),
              },
            }))
        : [],
    };
  } catch (error) {
    console.error("Error fetching configuration by ID:", error);
    throw error;
  }
};

// API Call for [create/update configuration with phases] - Save configuration
export const saveConfiguration = async (
  configData,
  isNewConfig = true,
  configId = null
) => {
  try {
    const url = isNewConfig
      ? "/api/user/config"
      : `/api/user/config/${configId}`;
    const method = isNewConfig ? "POST" : "PUT";

    // API Call for [create/update configuration with phases] here
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: configData.phases[0]?.config?.name || "New Configuration",
        sections: configData.phases.map((phase, index) => ({
          // Include existing section ID for updates
          ...(phase.sectionId && !isNewConfig && { id: phase.sectionId }),
          name: phase.label,
          max_time:
            (phase.gapToNext?.days || 0) * 86400 +
            (phase.gapToNext?.hours || 0) * 3600 +
            (phase.gapToNext?.minutes || 0) * 60,
          // Include sequence for proper ordering
          sequence: phase.sequence !== undefined ? phase.sequence : index,
          // Include plan_id for updates if needed
          ...(configId && !isNewConfig && { plan_id: configId }),
          data: {
            aerator: { value: phase.config.aerator || 0 },
            humidity: {
              aggressiveness: 0,
              high: phase.config.humidityMax || 0,
              low: phase.config.humidityMin || 0,
            },
            ph: {
              aggressiveness: 0,
              high: phase.config.phMax || 0,
              low: phase.config.phMin || 0,
            },
            ec: {
              aggressiveness: 0,
              high: phase.config.ec || 0,
              low: phase.config.ec || 0,
            },
            blue_light: [
              {
                value: (phase.config.lighting?.dayChannels?.blue || 0) / 100,
                from: 0,
                to: 84399,
              },
            ],
            red_light: [
              {
                value: (phase.config.lighting?.dayChannels?.red || 0) / 100,
                from: 0,
                to: 84399,
              },
            ],
            white_light: [
              {
                value: (phase.config.lighting?.dayChannels?.white || 0) / 100,
                from: 0,
                to: 84399,
              },
            ],
            far_red_light: [
              {
                value: (phase.config.lighting?.dayChannels?.farRed || 0) / 100,
                from: 0,
                to: 84399,
              },
            ],
            uv_light: [
              {
                value: (phase.config.lighting?.dayChannels?.uv || 0) / 100,
                from: 0,
                to: 84399,
              },
            ],
          },
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to ${isNewConfig ? "create" : "update"} configuration`
      );
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error saving configuration:", error);

    // Mock response for development
    const mockResponse = {
      id: configId || `config_${Date.now()}`,
      ...configData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return mockResponse;
  }
};

// API Call for [delete configuration] - Delete configuration template
export const deleteConfiguration = async (configId) => {
  try {
    // API Call for [delete configuration] here
    const response = await fetch(`/api/user/config/${configId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete configuration");
    }

    return { success: true, message: "Configuration deleted successfully" };
  } catch (error) {
    console.error("Error deleting configuration:", error);

    // Mock response for development
    return {
      success: true,
      message: "Configuration deleted successfully (mock)",
    };
  }
};

// API Call for [duplicate configuration] - Duplicate existing configuration
export const duplicateConfiguration = async (configId) => {
  try {
    // Force fallback to mock data for now
    throw new Error("API not implemented yet");

    // API Call for [duplicate configuration] here
    // const response = await fetch(`/api/user/configs/${configId}/duplicate`, {
    //   method: "POST",
    //   credentials: "include"
    // });
    //
    // if (!response.ok) {
    //   throw new Error("Failed to duplicate configuration");
    // }
    //
    // const data = await response.json();
    // return data.data || data;
  } catch (error) {
    console.error("Error duplicating configuration:", error);

    // Mock response for development
    const mockDuplicate = {
      id: `config_${Date.now()}`,
      name: `Copy of Configuration`,
      phases: [],
      createdAt: new Date().toISOString(),
    };

    return mockDuplicate;
  }
};

// =============================================================================
// SESSION APIs
// =============================================================================

// Add this to apiService.js after the other session APIs:

// Mark session as complete and clear device configs
export const markSessionComplete = async (deviceId) => {
  try {
    // First, clear the device config
    const clearResponse = await fetch(`/api/device/${deviceId}/config`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        config_id: null, // We'll need to get the current config_id
        config_plan_id: null, // We'll need to get the current plan_id
      }),
    });

    if (!clearResponse.ok) {
      throw new Error("Failed to clear device configuration");
    }

    // TODO: When batch/session API is clarified, also call session completion endpoint

    return {
      success: true,
      message: "Session completed and configurations cleared",
    };
  } catch (error) {
    console.error("Error completing session:", error);
    // Mock response for development
    return {
      success: true,
      message: "Session completed (mock)",
    };
  }
};
