// client/src/pages/AdminDashboardPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// ✅ ADD THIS IMPORT (make sure file exists in components folder)
import ClubNotificationBell from "../components/ClubNotificationBell";

const AdminDashboardPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Logout failed. Please try again.");
    }
  };

  return (
    <div
      className="admin-dashboard-root"
      style={{
        minHeight: "100vh",
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #e0f2fe 100%)",
        padding: "2rem 0",
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div
        className="admin-dashboard-container"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 5%",
        }}
      >
        {/* Header with Controls */}
        <div
          className="admin-dashboard-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "3rem",
            backdropFilter: "blur(20px)",
            background:
              theme === "dark"
                ? "rgba(15,23,42,0.8)"
                : "rgba(255,255,255,0.9)",
            padding: "2rem",
            borderRadius: "24px",
            border:
              theme === "dark"
                ? "1px solid rgba(148,163,184,0.3)"
                : "1px solid rgba(0,0,0,0.05)",
            boxShadow:
              theme === "dark"
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                fontWeight: "900",
                color: theme === "dark" ? "#60a5fa" : "#1e40af",
                textShadow:
                  theme === "dark"
                    ? "0 0 20px rgba(96, 165, 250, 0.6)"
                    : "0 0 20px rgba(30, 64, 175, 0.4)",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Admin Panel
            </h1>
            <p
              style={{
                fontSize: "1rem",
                color: theme === "dark" ? "#e2e8f0" : "#64748b",
                margin: "1rem 0 0 0",
                lineHeight: 1.6,
              }}
            >
              Welcome back, admin. Manage your platform from here.
            </p>
          </div>

          {/* Toggle + Notification Bell + Logout Buttons */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {/* ✅ REAL NOTIFICATION BELL (WebSocket + Card UI) */}
            <div style={{ position: "relative", zIndex: 2000 }}>
              <ClubNotificationBell />
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                padding: "0.75rem 1.5rem",
                background:
                  theme === "dark"
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(30,41,59,0.15)",
                color: theme === "dark" ? "#f8fafc" : "#1e293b",
                border: "2px solid",
                borderColor:
                  theme === "dark"
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(30,41,59,0.4)",
                borderRadius: "2rem",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  theme === "dark"
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(30,41,59,0.25)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  theme === "dark"
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(30,41,59,0.15)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              {theme === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: "0.75rem 1.5rem",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white",
                border: "none",
                borderRadius: "2rem",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 14px rgba(239,68,68,0.4)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(239,68,68,0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 14px rgba(239,68,68,0.4)";
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Toast Message */}
        {message && (
          <div
            style={{
              textAlign: "center",
              padding: "1rem 2rem",
              backdropFilter: "blur(20px)",
              background:
                theme === "dark"
                  ? "rgba(239,68,68,0.2)"
                  : "rgba(239,68,68,0.1)",
              borderRadius: "16px",
              marginBottom: "2rem",
              color: "#ef4444",
              border: `1px solid ${
                theme === "dark"
                  ? "rgba(239,68,68,0.4)"
                  : "rgba(239,68,68,0.2)"
              }`,
              maxWidth: "500px",
              margin: "0 auto 2rem auto",
            }}
          >
            {message}
          </div>
        )}

        {/* Welcome Section */}
        <div
          style={{
            backdropFilter: "blur(20px)",
            background:
              theme === "dark"
                ? "rgba(30,41,59,0.6)"
                : "rgba(255,255,255,0.8)",
            borderRadius: "24px",
            padding: "3rem 2.5rem",
            border:
              theme === "dark"
                ? "1px solid rgba(148,163,184,0.3)"
                : "1px solid rgba(0,0,0,0.05)",
            textAlign: "center",
            boxShadow:
              theme === "dark"
                ? "0 25px 50px -12px rgba(0,0,0,0.5)"
                : "0 25px 50px -12px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎛️</div>
          <h2
            style={{
              fontSize: "1.75rem",
              color: theme === "dark" ? "#f8fafc" : "#1e293b",
              margin: "0 0 1rem 0",
              fontWeight: "800",
            }}
          >
            Welcome to Admin Dashboard
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: theme === "dark" ? "#94a3b8" : "#64748b",
              lineHeight: 1.7,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Admin panel ready. Use the toggle, notifications, and logout controls above.
          </p>
        </div>

        {/* Export Data Section */}
        <div
          style={{
            backdropFilter: "blur(20px)",
            background:
              theme === "dark"
                ? "rgba(30,41,59,0.6)"
                : "rgba(255,255,255,0.8)",
            borderRadius: "24px",
            padding: "3rem 2.5rem",
            border:
              theme === "dark"
                ? "1px solid rgba(148,163,184,0.3)"
                : "1px solid rgba(0,0,0,0.05)",
            marginTop: "2rem",
            boxShadow:
              theme === "dark"
                ? "0 25px 50px -12px rgba(0,0,0,0.5)"
                : "0 25px 50px -12px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📥</div>
            <h2
              style={{
                fontSize: "1.5rem",
                color: theme === "dark" ? "#f8fafc" : "#1e293b",
                margin: "0 0 0.5rem 0",
                fontWeight: "800",
              }}
            >
              Export System Data
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: theme === "dark" ? "#94a3b8" : "#64748b",
                lineHeight: 1.6,
              }}
            >
              Download system data as CSV files for reporting and analysis
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {/* Export Users */}
            <button
              onClick={() => {
                window.location.href = "http://localhost:5001/api/admin/export/users";
                showToast("Downloading users data...");
              }}
              style={{
                padding: "1.25rem 1.5rem",
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                    : "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "16px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 15px 35px rgba(59, 130, 246, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 25px rgba(59, 130, 246, 0.3)";
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>👥</span>
              <span>Export Users</span>
            </button>

            {/* Export Assignments */}
            <button
              onClick={() => {
                window.location.href = "http://localhost:5001/api/admin/export/assignments";
                showToast("Downloading assignments data...");
              }}
              style={{
                padding: "1.25rem 1.5rem",
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                    : "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "16px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 15px 35px rgba(139, 92, 246, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 25px rgba(139, 92, 246, 0.3)";
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>📝</span>
              <span>Export Assignments</span>
            </button>

            {/* Export GPA Reports */}
            <button
              onClick={() => {
                window.location.href = "http://localhost:5001/api/admin/export/gpa-reports";
                showToast("Downloading GPA reports...");
              }}
              style={{
                padding: "1.25rem 1.5rem",
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "16px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 15px 35px rgba(16, 185, 129, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 25px rgba(16, 185, 129, 0.3)";
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>📊</span>
              <span>Export GPA Reports</span>
            </button>

            {/* Export Lost & Found */}
            <button
              onClick={() => {
                window.location.href = "http://localhost:5001/api/admin/export/lostfound";
                showToast("Downloading lost & found data...");
              }}
              style={{
                padding: "1.25rem 1.5rem",
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "16px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 15px 35px rgba(245, 158, 11, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 25px rgba(245, 158, 11, 0.3)";
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>🔍</span>
              <span>Export Lost & Found</span>
            </button>

            {/* Export All Data */}
            <button
              onClick={() => {
                window.location.href = "http://localhost:5001/api/admin/export/all";
                showToast("Downloading complete system data...");
              }}
              style={{
                padding: "1.25rem 1.5rem",
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                    : "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "16px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                gridColumn: "span 2",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 15px 35px rgba(239, 68, 68, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 25px rgba(239, 68, 68, 0.3)";
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>💾</span>
              <span>Export All Data (Complete)</span>
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "2rem",
              fontSize: "0.875rem",
              color: theme === "dark" ? "#94a3b8" : "#64748b",
            }}
          >
            Files will be downloaded in CSV format with timestamp
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;