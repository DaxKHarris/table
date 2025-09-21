// New file: src/pages/ForgotPassword/ForgotPasswordForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import login from "../assets/login.png";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API
      setSubmitted(true);
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
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
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "500px" : "80vw",
          height: isMobile ? "auto" : "75vh",
          minHeight: isMobile ? "500px" : "500px",
          background: isMobile
            ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
            : "rgba(255, 255, 255, 0.95)",
          borderRadius: isMobile ? "30px" : "40px",
          display: "flex",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        {/* Left Side - Form */}
        <div
          style={{
            flex: isMobile ? "1" : "0 0 35%",
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            padding: isMobile ? "40px 30px" : "80px 60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            width: isMobile ? "100%" : "35%",
          }}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            style={{
              position: "absolute",
              top: "30px",
              left: "30px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              padding: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
          >
            <ArrowLeft color="white" size={20} />
          </button>

          {!submitted ? (
            <>
              {/* Header */}
              <div style={{ marginBottom: isMobile ? "40px" : "50px" }}>
                <h1
                  style={{
                    fontSize: isMobile ? "36px" : "48px",
                    fontWeight: "bold",
                    color: "white",
                    margin: "0 0 15px 0",
                    lineHeight: "1.1",
                  }}
                >
                  Forgot Password?
                </h1>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.85)",
                    fontSize: isMobile ? "16px" : "18px",
                    margin: "0",
                    lineHeight: "1.5",
                  }}
                >
                  No worries! Enter your email address and we'll send you
                  instructions to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div style={{ marginBottom: "30px" }}>
                  <label
                    style={{
                      display: "block",
                      color: "white",
                      fontSize: isMobile ? "14px" : "16px",
                      marginBottom: "10px",
                      fontWeight: "500",
                    }}
                  >
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: isMobile
                          ? "14px 16px 14px 45px"
                          : "16px 20px 16px 50px",
                        background: "rgba(255, 255, 255, 0.15)",
                        border: `1px solid ${
                          error
                            ? "rgba(239, 68, 68, 0.5)"
                            : "rgba(255, 255, 255, 0.3)"
                        }`,
                        borderRadius: "12px",
                        color: "white",
                        fontSize: isMobile ? "16px" : "16px",
                        outline: "none",
                        transition: "all 0.3s ease",
                        backdropFilter: "blur(10px)",
                      }}
                      placeholder="Enter your email"
                      onFocus={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.2)";
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                      }}
                      onBlur={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.15)";
                        e.target.style.borderColor = error
                          ? "rgba(239, 68, 68, 0.5)"
                          : "rgba(255, 255, 255, 0.3)";
                      }}
                    />
                    <Mail
                      style={{
                        position: "absolute",
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                      size={20}
                    />
                  </div>
                  {error && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "10px 14px",
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: "8px",
                        color: "#fca5a5",
                        fontSize: "14px",
                      }}
                    >
                      {error}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
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
                    marginBottom: "30px",
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
                  {loading ? "Sending..." : "Send Reset Email"}
                </button>
              </form>

              {/* Links */}
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "15px" }}>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: isMobile ? "14px" : "16px",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Back to Login
                  </button>
                </div>
                <div>
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                  >
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
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
                      Sign Up
                    </button>
                  </span>
                </div>
              </div>
            </>
          ) : (
            // Success State
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "rgba(255, 255, 255, 0.15)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 30px",
                }}
              >
                <Mail size={40} color="white" />
              </div>
              <h2
                style={{
                  fontSize: isMobile ? "32px" : "40px",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "20px",
                }}
              >
                Check Your Email
              </h2>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: isMobile ? "16px" : "18px",
                  marginBottom: "40px",
                  lineHeight: "1.6",
                }}
              >
                We've sent password reset instructions to:
                <br />
                <strong>{email}</strong>
              </p>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "14px",
                  marginBottom: "30px",
                }}
              >
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => navigate("/login")}
                style={{
                  width: "100%",
                  padding: isMobile ? "14px" : "16px",
                  background: "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) e.target.style.background = "#047857";
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) e.target.style.background = "#059669";
                }}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Image (Hidden on Mobile) */}
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
            <img
              src={login}
              alt="Growing plants"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "20px",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
