import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          navigate("/login");
          return;
        }

        setUser(data);
        setMessage("");
      } catch {
        setMessage("Network error");
      }
    };

    fetchMe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setMessage("Logged out");
      navigate("/login");
    } catch {
      setMessage("Logout failed");
    }
  };

  // While loading or unauthenticated, show a simple card
  if (!user) {
    return (
      <div className="dashboard-root">
        <aside className="dashboard-sidebar">
          <div className="sidebar-logo">Campus Buddy</div>

          <div>
            <div className="sidebar-section-title">General</div>
            <ul className="sidebar-menu">
              <li className="sidebar-item">
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
              <li className="sidebar-item">
               <Link to="/faq">Get Help</Link>
              </li>

              <li className="sidebar-item disabled">Profile Settings</li>
            </ul>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-content-card">
            <div className="dashboard-main-left">
              <div className="welcome-banner">
                <h2>Student Dashboard</h2>
                <p>{message}</p>
              </div>
            </div>
            <div className="dashboard-main-right">
              <h3>Student details</h3>
              <p className="detail-row">{message}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isStudent = user.role === "student";
  const isStudentClubAdmin = isStudent && user.isClubAdmin; // NEW
  const displayName = user.name || "Student";

  return (
    <div className="dashboard-root">
      {/* Left sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Campus Buddy</div>

        <div>
          <div className="sidebar-section-title">General</div>
          <ul className="sidebar-menu">
            <li className="sidebar-item active">
              <Link to="/dashboard">Dashboard</Link>
            </li>

            <li className="sidebar-item">
              <Link to="/faq">Help / FAQ</Link>
            </li>

            <li className="sidebar-item">
              <Link to="/todo">To-Do List</Link>
            </li>

            <li className="sidebar-item">
              <Link to="/classes">Class Schedule</Link>
            </li>
          </ul>




        </div>

        <div style={{ marginTop: "auto" }}>
          <div className="sidebar-section-title">Settings</div>
          <ul className="sidebar-menu">
            <li className="sidebar-item disabled">General Settings</li>
            <li className="sidebar-item disabled">Get Help</li>
            <li className="sidebar-item disabled">Profile Settings</li>
          </ul>
        </div>
      </aside>

      {/* Right main area */}
      <main className="dashboard-main">
        {/* Top bar */}
        <div className="dashboard-topbar">
          <div className="dashboard-top-left">
            <h1 style={{ margin: 0, fontSize: 24 }}>
              {displayName}&apos;s Dashboard
            </h1>
            <span className="dashboard-subtitle">
              Welcome back, {displayName}. Here is an overview of your student
              account.
            </span>
          </div>
          <div className="dashboard-top-right">
            <div className="user-chip">
              {isStudent ? "Student" : user.role} · {user.bracuId}
            </div>
          </div>
        </div>

        {/* Main content card */}
        <section className="dashboard-content-card">
          {/* Left column: welcome and placeholders */}
          <div className="dashboard-main-left">
            <div className="welcome-banner">
              <h2>Good day, {displayName}!</h2>
              <p>
                Your personalized Campus Buddy space. Class schedule,
                assignments, events and more will appear here as you build the
                next features.
              </p>
            </div>

            {/* NEW: student + club admin message and link */}
            {isStudentClubAdmin && (
              <div
                className="club-admin-info"
                style={{
                  marginTop: "16px",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#eef2ff",
                }}
              >
                <p style={{ margin: 0, marginBottom: 8, fontWeight: 500 }}>
                  Admin of BRAC University Computer Club
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: "auto" }}
                  onClick={() => navigate("/club-admin")}
                >
                  View club dashboard
                </button>
              </div>
            )}

            <div className="empty-widgets-box">
              This area will later show widgets such as:
              <br />
              • Today&apos;s classes / schedule
              <br />
              • Upcoming assignments and to‑dos
              <br />
              • Event calendar, lost &amp; found, and other modules
            </div>
          </div>

          {/* Right column: student details */}
          <div className="dashboard-main-right">
            <h3>Student details</h3>
            <div className="detail-row">
              <span className="detail-label">Name: </span>
              <span>{user.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Student ID: </span>
              <span>{user.bracuId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email: </span>
              <span>{user.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role: </span>
              <span>{user.role}</span>
            </div>

            <button type="button" className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
