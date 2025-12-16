import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) {
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then(data => setUser(data));
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  if (!user) return <p style={{ padding: 24 }}>Loading...</p>;

  const displayName = user.name || "Student";

  return (
    <div className="dashboard-root">
      {/* SIDEBAR */}
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
          </ul>
        </div>

        <div style={{ marginTop: "auto" }}>
          <div className="sidebar-section-title">Settings</div>
          <ul className="sidebar-menu">
            <li className="sidebar-item disabled">General Settings</li>
            <li className="sidebar-item disabled">Profile Settings</li>
          </ul>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main">
        {/* TOP BAR */}
        <div className="dashboard-topbar">
          <div>
            <h1 style={{ margin: 0 }}>{displayName}'s Dashboard</h1>
            <span className="dashboard-subtitle">
              Welcome back, {displayName}
            </span>
          </div>

          <div className="user-chip">
            Student · {user.bracuId}
          </div>
        </div>

        {/* MAIN CARD */}
        <section className="dashboard-content-card">
          {/* LEFT COLUMN */}
          <div className="dashboard-main-left">
            {/* Welcome */}
            <div className="welcome-banner">
              <h2>Good day, {displayName}!</h2>
              <p>Your personalized Campus Buddy dashboard.</p>
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

            {/* Placeholder */}
            <div className="empty-widgets-box">
              More widgets coming soon:
              <br />• Assignments
              <br />• To-dos
              <br />• Reports
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="dashboard-main-right">
            <h3>Student Details</h3>

            <div className="detail-row">
              <span className="detail-label">Name:</span> {user.name}
            </div>
            <div className="detail-row">
              <span className="detail-label">ID:</span> {user.bracuId}
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span> {user.email}
            </div>

            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
