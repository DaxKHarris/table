import { useState, useEffect } from "react";
import MainBoard from "./pages/Dashboard";
import Login from "./pages/Login";
import DevicePage from "./pages/DevicePage";
import { checkAuthStatus, logoutUser } from "./services/authService"; // Adjust path as needed

export default function App() {
  const [userAuthed, setUserAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Check auth status on mount (session cookie validation)
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // This should check if the session cookie is valid
        // The cookie is automatically included in the request
        const isAuthenticated = await checkAuthStatus();
        setUserAuthed(isAuthenticated);
      } catch (error) {
        console.error("Auth check failed:", error);
        setUserAuthed(false);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Handler for successful login
  const handleLoginSuccess = () => {
    // The login process should have already set the session cookie
    setUserAuthed(true);
    setCurrentPage("dashboard");
  };

  // Handler for navigating to device page
  const handleDeviceSelect = (deviceData) => {
    setSelectedDevice(deviceData);
    setCurrentPage("device");
  };

  // Handler for going back to dashboard
  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
    setSelectedDevice(null);
  };

  // Handler for logout
  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear the session cookie
      await logoutUser();
      setUserAuthed(false);
      setCurrentPage("dashboard");
      setSelectedDevice(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, clear local state
      setUserAuthed(false);
      setCurrentPage("dashboard");
      setSelectedDevice(null);
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #86C5B1 0%, #4A9C7F 50%, #2D5D4A 100%)",
        }}
      >
        <div style={{ color: "white", fontSize: "20px" }}>Loading...</div>
      </div>
    );
  }

  // If not authenticated, show login
  if (!userAuthed) {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  // If authenticated, show appropriate page
  if (currentPage === "device" && selectedDevice) {
    return (
      <DevicePage
        device={selectedDevice}
        onBack={handleBackToDashboard}
        onLogout={handleLogout}
      />
    );
  }

  // Default to dashboard
  return (
    <MainBoard onDeviceSelect={handleDeviceSelect} onLogout={handleLogout} />
  );
}
