import { useRef, useState, useEffect } from "react";
import getUserAuth from "../../services/authService";

export default function LoginForm({ onSuccess }) {
  const userRef = useRef();
  const passRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const username = userRef.current.value.trim();
    const password = passRef.current.value;

    if (!username || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await getUserAuth(username, password);
      console.log("Login successful:", result);
      // The session cookie should be set by the server response
      onSuccess?.(); // This should call handleLoginSuccess from your main app
      if (passRef.current) passRef.current.value = "";
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "INVALID_CREDENTIALS") {
        setError("Invalid username or password");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #86C5B1 0%, #4A9C7F 50%, #2D5D4A 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Main Card Container */}
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "500px" : "1200px",
          height: isMobile ? "auto" : "700px",
          minHeight: isMobile ? "500px" : "auto",
          background: isMobile
            ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
            : "rgba(255, 255, 255, 0.95)",
          borderRadius: isMobile ? "30px" : "40px",
          display: "flex",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        {/* Left Side - Login Form */}
        <div
          style={{
            flex: isMobile ? "1" : "1",
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            padding: isMobile ? "40px 30px" : "80px 60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            width: isMobile ? "100%" : "auto",
          }}
        >
          {/* Welcome Text */}
          <div style={{ marginBottom: isMobile ? "30px" : "50px" }}>
            <h1
              style={{
                fontSize: isMobile ? "36px" : "48px",
                fontWeight: "bold",
                color: "white",
                margin: "0 0 10px 0",
                lineHeight: "1.1",
              }}
            >
              Welcome
              <br />
              Back!
            </h1>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: isMobile ? "16px" : "18px",
                margin: "0",
              }}
            >
              Please Enter Your Log In Information
            </p>
          </div>

          {/* Form */}
          <div style={{ marginBottom: isMobile ? "20px" : "40px" }}>
            {/* Username Field */}
            <div style={{ marginBottom: isMobile ? "20px" : "25px" }}>
              <label
                style={{
                  display: "block",
                  color: "white",
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Username
              </label>
              <input
                ref={userRef}
                type="text"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: isMobile ? "12px 16px" : "15px 20px",
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: isMobile ? "16px" : "16px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                  WebkitAppearance: "none",
                }}
                placeholder=""
                onFocus={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  color: "white",
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  ref={passRef}
                  type={showPassword ? "text" : "password"}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: isMobile
                      ? "12px 45px 12px 16px"
                      : "15px 50px 15px 20px",
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: isMobile ? "16px" : "16px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)",
                    WebkitAppearance: "none",
                  }}
                  placeholder=""
                  onFocus={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.2)";
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.15)";
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: isMobile ? "12px" : "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.7)",
                    cursor: "pointer",
                    fontSize: isMobile ? "16px" : "18px",
                    padding: "5px",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div
              style={{
                textAlign: "right",
                marginBottom: isMobile ? "20px" : "30px",
              }}
            >
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: isMobile ? "13px" : "14px",
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.5)",
                  color: "white",
                  padding: isMobile ? "10px 14px" : "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontSize: isMobile ? "13px" : "14px",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: isMobile ? "14px" : "16px",
                background: loading ? "rgba(5, 150, 105, 0.5)" : "#059669",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                marginBottom: isMobile ? "20px" : "30px",
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseEnter={(e) => {
                if (!loading && !isMobile)
                  e.target.style.background = "#047857";
              }}
              onMouseLeave={(e) => {
                if (!loading && !isMobile)
                  e.target.style.background = "#059669";
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Sign Up Link */}
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              Don't have an account yet?{" "}
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontWeight: "600",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                Sign Up!
              </button>
            </span>
          </div>
        </div>

        {/* Right Side - Image Placeholder (Hidden on Mobile) */}
        {!isMobile && (
          <div
            style={{
              flex: "1",
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px",
              position: "relative",
            }}
          >
            {/* IMAGE PLACEHOLDER - Replace this div with your image */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#e5e7eb",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: "#6b7280",
                textAlign: "center",
                border: "2px dashed #9ca3af",
              }}
            >
              Replace this div with:
              <br />
              <strong>
                &lt;img src="your-image.jpg" style=&#123;&#123;
                <br />
                width: '100%',
                <br />
                height: '100%',
                <br />
                objectFit: 'cover',
                <br />
                borderRadius: '20px'
                <br />
                &#125;&#125; /&gt;
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
