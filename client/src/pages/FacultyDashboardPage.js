import React from "react";
import FacultyNavbar from "../components/FacultyNavbar";
import { getUser, removeToken } from "../utils/api";
import { useNavigate } from "react-router-dom";

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

  return (
    <>
      {/* top navbar with theme toggle + links */}
      <FacultyNavbar />
      <main
        style={{
          maxWidth: "960px",
          margin: "40px auto",
          padding: "24px 28px",
          borderRadius: "16px",
          background: "var(--card-bg, #ffffff)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <header style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>Faculty dashboard</h1>
          <p style={{ marginTop: "8px", color: "#6b7280", fontSize: 14 }}>
            Welcome back, {user?.name || "Faculty"}. Here is your account
            overview.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: "16px 18px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              background: "rgba(15,23,42,0.02)",
            }}
          >
            <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Your details</h2>
            <p><strong>Name:</strong> {user?.name || "-"}</p>
            <p><strong>Email:</strong> {user?.email || "-"}</p>
            {user?.studentId && (
              <p><strong>ID:</strong> {user.studentId}</p>
            )}
            <p><strong>Role:</strong> {user?.role || "faculty"}</p>
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
              You are logged in as <strong>faculty</strong>. Future features
              (course lists, submissions, etc.) can appear here.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default FacultyDashboardPage;
