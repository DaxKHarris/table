import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkAuthStatus } from "./services/authService";

// Import pages
import MainBoard from "./pages/Dashboard";
import Login from "./pages/Login";
import DevicePage from "./pages/DevicePage";
import CreateAccount from "./pages/CreateAccount"; // You'll need to create this
import ForgotPassword from "./pages/ForgotPassword"; // You'll need to create this

// Protected Route wrapper component
function ProtectedRoute({ children }) {
  const [authStatus, setAuthStatus] = useState("loading");
  const [intendedPath, setIntendedPath] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus();
        setAuthStatus(isAuthenticated ? "authenticated" : "unauthenticated");

        // If not authenticated, save the current path to redirect back later
        if (!isAuthenticated) {
          setIntendedPath(window.location.pathname + window.location.search);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthStatus("unauthenticated");
        setIntendedPath(window.location.pathname + window.location.search);
      }
    };

    verifyAuth();
  }, []);

  if (authStatus === "loading") {
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

  if (authStatus === "unauthenticated") {
    // Redirect to login with return URL
    const returnUrl = intendedPath || window.location.pathname;
    return (
      <Navigate
        to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
        replace
      />
    );
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices/:deviceId"
          element={
            <ProtectedRoute>
              <DevicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices/:deviceId/config"
          element={
            <ProtectedRoute>
              {/* Add your config component here */}
              <div>Device Config Page (To be implemented)</div>
            </ProtectedRoute>
          }
        />

        {/* Fallback - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
