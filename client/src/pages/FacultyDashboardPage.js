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

          {/* TOP-RIGHT LOGOUT (no overlap) */}
          <div className="dashboard-top-right">
            <button
              className="btn-logout"
              onClick={handleLogout}
              style={{ whiteSpace: "nowrap" }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Notifications & Reminders Section */}
        <section
          style={{
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            background: "rgba(15,23,42,0.02)",
            marginTop: "16px",
          }}
        >
          <Notifications isFaculty={true} />
        </section>
      </main>
    </div>
  );
};

export default FacultyDashboardPage;
