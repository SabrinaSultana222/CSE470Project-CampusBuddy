import React from "react";
import FacultyNavbar from "../components/FacultyNavbar";
import Notifications from "../components/Notifications";
import FacultySidebar from "../components/FacultySidebar";

import { getUser, removeToken } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const FacultyDashboardPage = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    // broadcast logout to other tabs / navbar
    window.dispatchEvent(
      new CustomEvent("authChange", { detail: { user: null } })
    );
    navigate("/login");
  };

  const cardStyle = {
    padding: "18px",
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    textDecoration: "none",
    color: "#111827",
    fontWeight: 600,
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <div className="dashboard-root">
      {/* LEFT SIDEBAR */}
      <FacultySidebar />

      {/* RIGHT MAIN AREA */}
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="dashboard-top-left">
            <h1 style={{ margin: 0 }}>Faculty Dashboard</h1>
            <span className="dashboard-subtitle">
              Welcome back, {user?.name || "Faculty"}
            </span>
          </div>

          <div
            style={{
              padding: "16px 18px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              background: "rgba(15,23,42,0.02)",
            }}
          >
            <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Status</h2>
            <p style={{ margin: 0, fontSize: 14 }}>
              You are logged in as <strong>faculty</strong>. You can post
              announcements and notifications for students below.
            </p>
          </div>
        </div>

        {/* Notifications & Reminders Section */}
        <section
          style={{
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            background: "rgba(15,23,42,0.02)",
          }}
        >
          <Notifications isFaculty={true} />
        </section>

        {/* Faculty Details Section */}
        <section className="dashboard-content-card">
          {/* LEFT */}
          <div className="dashboard-main-left">
            <div className="welcome-banner">
              <h2>Hello, {user?.name || "Faculty"} 👋</h2>
              <p>
                Manage your classes, events, reports, and student information
                from here.
              </p>
            </div>

            <div className="empty-widgets-box">
              • View and manage class schedules
              <br />
              • Track events
              <br />
              • Generate reports
              <br />
              • Manage to-dos and FAQs
            </div>
          </div>

          {/* RIGHT */}
          <div className="dashboard-main-right">
            <h3>Your details</h3>
            <div className="detail-row">
              <span className="detail-label">Name: </span>
              {user?.name}
            </div>
            <div className="detail-row">
              <span className="detail-label">Email: </span>
              {user?.email}
            </div>
            <div className="detail-row">
              <span className="detail-label">Role: </span>Faculty
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

export default FacultyDashboardPage;
