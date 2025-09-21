// Updated CreateAccountForm.jsx with better spacing
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import login from "../assets/login.png";

export default function CreateAccountForm() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const passwordRequirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[A-Z]/, text: "One uppercase letter" },
    { regex: /[a-z]/, text: "One lowercase letter" },
    { regex: /[0-9]/, text: "One number" },
    { regex: /[^A-Za-z0-9]/, text: "One special character" },
  ];

  const validatePassword = (password) => {
    return passwordRequirements.map((req) => ({
      ...req,
      met: req.regex.test(password),
    }));
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
      6,
      10
    )}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    const digitsOnly = formData.phone.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    const passwordChecks = validatePassword(formData.password);
    if (!passwordChecks.every((check) => check.met)) {
      newErrors.password = "Password doesn't meet all requirements";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/login?registered=true");
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
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
          minHeight: isMobile ? "600px" : "600px",
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
            padding: isMobile ? "40px 30px" : "60px 50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            width: isMobile ? "100%" : "35%",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: isMobile ? "35px" : "40px" }}>
            <h1
              style={{
                fontSize: isMobile ? "36px" : "48px",
                fontWeight: "bold",
                color: "white",
                margin: "0 0 10px 0",
                lineHeight: "1.1",
              }}
            >
              Join Us
            </h1>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: isMobile ? "16px" : "18px",
                margin: "0",
              }}
            >
              Start growing smarter today
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "20px" : "24px",
            }}
          >
            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "white",
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: isMobile ? "12px 16px" : "14px 18px",
                  background: "rgba(255, 255, 255, 0.15)",
                  border: `1px solid ${
                    errors.email
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
                placeholder="you@example.com"
                onFocus={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  e.target.style.borderColor = errors.email
                    ? "rgba(239, 68, 68, 0.5)"
                    : "rgba(255, 255, 255, 0.3)";
                }}
              />
              {errors.email && (
                <span
                  style={{
                    color: "#fca5a5",
                    fontSize: "13px",
                    marginTop: "6px",
                    display: "block",
                  }}
                >
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "white",
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                style={{
                  width: "100%",
                  padding: isMobile ? "12px 16px" : "14px 18px",
                  background: "rgba(255, 255, 255, 0.15)",
                  border: `1px solid ${
                    errors.phone
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
                placeholder="(555) 123-4567"
                onFocus={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  e.target.style.borderColor = errors.phone
                    ? "rgba(239, 68, 68, 0.5)"
                    : "rgba(255, 255, 255, 0.3)";
                }}
              />
              {errors.phone && (
                <span
                  style={{
                    color: "#fca5a5",
                    fontSize: "13px",
                    marginTop: "6px",
                    display: "block",
                  }}
                >
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Username */}
            <div>
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
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: isMobile ? "12px 16px" : "14px 18px",
                  background: "rgba(255, 255, 255, 0.15)",
                  border: `1px solid ${
                    errors.username
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
                placeholder="Choose a username"
                onFocus={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  e.target.style.borderColor = errors.username
                    ? "rgba(239, 68, 68, 0.5)"
                    : "rgba(255, 255, 255, 0.3)";
                }}
              />
            </div>

            {/* Password */}
            <div>
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
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: isMobile
                      ? "12px 45px 12px 16px"
                      : "14px 50px 14px 18px",
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: isMobile ? "16px" : "16px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)",
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
                    padding: "5px",
                  }}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "white",
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: isMobile
                      ? "12px 45px 12px 16px"
                      : "14px 50px 14px 18px",
                    background: "rgba(255, 255, 255, 0.15)",
                    border: `1px solid ${
                      errors.confirmPassword
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
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: isMobile ? "12px" : "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.7)",
                    cursor: "pointer",
                    padding: "5px",
                  }}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span
                  style={{
                    color: "#fca5a5",
                    fontSize: "13px",
                    marginTop: "6px",
                    display: "block",
                  }}
                >
                  {errors.confirmPassword}
                </span>
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
                marginTop: "10px",
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <span
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
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
                Log In
              </button>
            </span>
          </div>
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
