import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Chatbot from "../components/Chatbot";
import Notifications from "../components/Notifications";
import { useTheme } from "../context/ThemeContext";

const DashboardPage = () => {
  const { theme, toggleTheme } = useTheme(); // 🌙 theme context
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Loading...");
  const navigate = useNavigate();

  // 🔐 Fetch logged-in user
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          navigate("/login");
          return null;
        }
        setUser(data);
        setMessage("");
        } catch {
        setMessage("Network error");
      }
    };
     fetchMe();
  }, [navigate]);

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch {
      setMessage("Logout failed");
    }
  };

  // ⏳ Loading
  if (!user) {
    return (
      <div className="dashboard-root">
        <main className="dashboard-main">
          <div className="dashboard-content-card">
            <h2>{message}</h2>
          </div>
        </main>
      </div>
    );
  }

  const isStudent = user.role === "student";
  const isStudentClubAdmin = isStudent && user.isClubAdmin;
  const displayName = user.name || "Student";

  return (
    <div className="dashboard-root">
      {/* 🟦 Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Campus Buddy</div>

        <div>
          <div className="sidebar-section-title">General</div>
          <ul className="sidebar-menu">
            <li className="sidebar-item active">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/classes">Class Schedule</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/todo">To-Do List</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/events">Event Calendar</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/faq">Help / FAQ</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/report">Report Generator</Link>
            </li>
            <li className="sidebar-item" onClick={() => navigate('/assignments')} style={{ cursor: 'pointer' }}>📋 Assignments</li>
            <li className="sidebar-item" onClick={() => navigate('/gpa')} style={{ cursor: 'pointer' }}>📊 GPA Calculator</li>
            <li className="sidebar-item" onClick={() => navigate('/lost-found')} style={{ cursor: 'pointer' }}>🔍 Lost & Found</li>
          </ul>
        </div>

        <div style={{ marginTop: "auto" }}>
          <div className="sidebar-section-title">Settings</div>
          <ul className="sidebar-menu">
            <li className="sidebar-item disabled">General Settings</li>
            <li className="sidebar-item disabled">Get Help</li>
            <li className="sidebar-item" onClick={() => navigate('/profile-settings')} style={{ cursor: 'pointer' }}>⚙️ Profile Settings</li>
          </ul>
        </div>
      </aside>

      {/* 🟨 Main */}
      <main className="dashboard-main">
        {/* 🔝 Top bar */}
        <div className="dashboard-topbar">
          <div>
            <h1 style={{ margin: 0 }}>{displayName}&apos;s Dashboard</h1>
            <span className="dashboard-subtitle">
              Welcome back, {displayName}.
            </span>
          </div>

          {/* ✅ FIXED: Theme toggle + user chip */}
          <div className="dashboard-top-actions">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>

            <div className="user-chip">
              {isStudent ? "Student" : user.role} · {user.bracuId}
            </div>
          </div>
        </div>

        {/* 📦 Content */}
        <section className="dashboard-content-card">
          {/* ⬅ LEFT */}
          <div className="dashboard-main-left">
            {/* Welcome */}
            <div className="welcome-banner">
              <h2>Good day, {displayName}!</h2>
              <p>
                Your personalized Campus Buddy dashboard. Important tools and
                assistants are available below.
              </p>
            </div>


            {/* EVENT CALENDAR WIDGET */}
            <div
              style={{
                marginTop: 16,
                padding: 16,
                borderRadius: 16,
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ marginTop: 0 }}>📅 Upcoming Events</h3>

              <ul style={{ listStyle: "none", padding: 0 }}>
                <li>🎓 Career Fair – 10 Oct</li>
                <li>🎉 Club Fest – 15 Oct</li>
                <li>💻 Hackathon – 20 Oct</li>
              </ul>

              <button
                className="btn-secondary"
                onClick={() => navigate("/events")}
              >
                View full calendar
              </button>
            </div>

             {isStudentClubAdmin && (
              <div className="club-admin-info">
                <p>Club Admin Access</p>
                <button onClick={() => navigate("/club-admin")}>
                  View Club Dashboard
                </button>
              </div>
            )}



            {/* Placeholder */}
            <div className="empty-widgets-box">
              More widgets coming soon:
              <br />• Assignments
              <br />• To-dos
              <br />• Reports
            </div>
            {/* 🤖 Chatbot */}
            <div style={{ marginTop: 30 }}>
              <Chatbot />
            </div>
          

          {/* ➡ RIGHT */}
          <div className="dashboard-main-right">
            <h3>Student Details</h3>

            <h3>Student Details</h3>

            <div className="detail-row">
              <strong>Name:</strong> {user.name}
            </div>
            <div className="detail-row">
              <strong>ID:</strong> {user.bracuId}
            </div>
            <div className="detail-row">
              <strong>Email:</strong> {user.email}
            </div>
            <div className="detail-row">
              <strong>Role:</strong> {user.role}
            </div>

            {/* 🔔 Notifications */}
            <div style={{ marginTop: 24 }}>
              <Notifications />
            </div>

            <button
              className="btn-logout"
              style={{ marginTop: 20 }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
