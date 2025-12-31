// Updated ClubAdminDashboardPage.jsx - Theme Toggle + Back Button + Notification Bell
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// ✅ ADD THIS IMPORT (make sure file exists in components folder)
import ClubNotificationBell from "../components/ClubNotificationBell";

const ClubAdminDashboardPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    clubName: "",
    title: "",
    description: "",
    eventDate: "",
    location: "",
    category: "event",
  });
  const [message, setMessage] = useState("");

  const fetchMyPosts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/club-posts/my", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Failed to load posts");
        return;
      }
      setPosts(data);
      setMessage("");
    } catch {
      setMessage("Network error loading posts");
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5001/api/club-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Failed to create post");
        return;
      }

      setMessage("Post created (pending approval).");
      setForm({
        clubName: "",
        title: "",
        description: "",
        eventDate: "",
        location: "",
        category: "event",
      });
      fetchMyPosts();
    } catch {
      setMessage("Network error creating post");
    }
  };

  return (
    <div
      className="dashboard-root"
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
            : "linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 50%, #e3f2fd 100%)",
        color: theme === "dark" ? "#f8fafc" : "#1e293b",
      }}
    >
      <style jsx>{`
        .dashboard-sidebar {
          width: 280px;
          background: ${theme === "dark" ? "#1e293b" : "#ffffff"} !important;
          box-shadow: 4px 0 25px rgba(0, 0, 0, 0.2);
          padding: 2.5rem 0;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          z-index: 100;
          border-right: 1px solid
            ${theme === "dark"
              ? "rgba(148,163,184,0.3)"
              : "#e2e8f0"};
        }

        .sidebar-logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: ${theme === "dark" ? "#60a5fa" : "#0ea5e9"};
          text-align: center;
          padding: 1.5rem 2rem;
          background: linear-gradient(
            135deg,
            ${theme === "dark" ? "#60a5fa, #3b82f6" : "#0ea5e9, #0284c7"}
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 2rem;
          border-bottom: 1px solid
            ${theme === "dark"
              ? "rgba(148,163,184,0.3)"
              : "#f1f5f9"};
        }

        .sidebar-section-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: ${theme === "dark" ? "#94a3b8" : "#64748b"};
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0 2.5rem 1.25rem;
          margin-bottom: 0;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-item {
          padding: 1rem 2.5rem;
          font-weight: 600;
          font-size: 0.95rem;
          color: ${theme === "dark" ? "#cbd5e1" : "#475569"};
          transition: all 0.2s ease;
          cursor: pointer;
          border-left: 4px solid transparent;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sidebar-item::before {
          content: "📋";
          font-size: 1.1rem;
        }

        .sidebar-item:hover {
          background: ${theme === "dark"
            ? "rgba(96,165,250,0.15)"
            : "#f0f9ff"};
          color: ${theme === "dark" ? "#60a5fa" : "#0ea5e9"};
          border-left-color: ${theme === "dark" ? "#60a5fa" : "#0ea5e9"};
        }

        .sidebar-item.active {
          background: ${theme === "dark"
            ? "rgba(96,165,250,0.2)"
            : "#e0f2fe"} !important;
          color: ${theme === "dark" ? "#60a5fa" : "#0ea5e9"} !important;
          border-left-color: ${theme === "dark" ? "#60a5fa" : "#0ea5e9"} !important;
          font-weight: 700;
        }

        .dashboard-main {
          margin-left: 280px;
          flex: 1;
          padding: 2.5rem;
          min-height: 100vh;
        }

        .dashboard-topbar {
          background: ${theme === "dark"
            ? "rgba(30,41,59,0.8)"
            : "rgba(255,255,255,0.95)"};
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2.5rem;
          box-shadow: ${theme === "dark"
            ? "0 25px 50px -12px rgba(0,0,0,0.5)"
            : "0 10px 40px rgba(0,0,0,0.08)"};
          border: 1px solid
            ${theme === "dark"
              ? "rgba(148,163,184,0.3)"
              : "rgba(255,255,255,0.3)"};
        }

        .dashboard-top-left h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: ${theme === "dark" ? "#60a5fa" : "#0369a1"};
          text-shadow: ${theme === "dark"
            ? "0 0 20px rgba(96,165,250,0.6)"
            : "none"};
        }

        .dashboard-subtitle {
          color: ${theme === "dark" ? "#e2e8f0" : "#64748b"};
          font-size: 0.9rem;
          font-weight: 400;
        }

        .dashboard-content-card {
          background: ${theme === "dark"
            ? "rgba(30,41,59,0.8)"
            : "rgba(255,255,255,0.95)"};
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: ${theme === "dark"
            ? "0 25px 60px rgba(0,0,0,0.5)"
            : "0 20px 60px rgba(0,0,0,0.08)"};
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          min-height: 700px;
          border: 1px solid
            ${theme === "dark"
              ? "rgba(148,163,184,0.3)"
              : "rgba(255,255,255,0.3)"};
        }

        .dashboard-main-left,
        .dashboard-main-right {
          padding: 2.5rem;
          border-right: 1px solid
            ${theme === "dark"
              ? "rgba(148,163,184,0.2)"
              : "rgba(0,0,0,0.05)"};
        }

        .dashboard-main-right {
          border-right: none;
        }

        .dashboard-main-left h3,
        .dashboard-main-right h3 {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          color: ${theme === "dark" ? "#f8fafc" : "#1e293b"};
        }

        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          color: ${theme === "dark" ? "#e2e8f0" : "#475569"};
          margin-bottom: 0.5rem;
          font-size: 0.8rem;
        }

        .form-control,
        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid
            ${theme === "dark"
              ? "rgba(148,163,184,0.3)"
              : "#e2e8f0"};
          border-radius: 12px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          background: ${theme === "dark"
            ? "rgba(15,23,42,0.8)"
            : "rgba(255,255,255,0.8)"};
          color: ${theme === "dark" ? "#f8fafc" : "#1e293b"};
          backdrop-filter: blur(10px);
        }

        .form-control:focus,
        .form-select:focus {
          outline: none;
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
          transform: translateY(-1px);
        }

        textarea.form-control {
          resize: vertical;
          min-height: 90px;
        }

        .btn-primary {
          width: 100%;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.75rem;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(96, 165, 250, 0.4);
        }

        .message {
          padding: 0.75rem;
          border-radius: 12px;
          font-weight: 500;
          margin-top: 1rem;
          text-align: center;
          font-size: 0.85rem;
        }

        .message:not(:empty) {
          background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.2),
            rgba(16, 185, 129, 0.2)
          );
          color: #059669;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .post-item {
          background: ${theme === "dark"
            ? "rgba(15,23,42,0.7)"
            : "rgba(255,255,255,0.9)"};
          border: 1px solid
            ${theme === "dark"
              ? "rgba(148,163,184,0.3)"
              : "#e2e8f0"};
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.25rem;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .post-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .post-title {
          font-size: 1rem;
          font-weight: 700;
          color: ${theme === "dark" ? "#f8fafc" : "#1e293b"};
          margin: 0 0 0.5rem 0;
        }

        .post-meta {
          color: ${theme === "dark" ? "#cbd5e1" : "#64748b"};
          font-size: 0.8rem;
          margin: 0.25rem 0;
        }

        .post-status {
          font-weight: 600;
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.75rem;
        }

        .status-pending {
          background: rgba(245, 158, 11, 0.2);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .status-approved {
          background: rgba(34, 197, 94, 0.2);
          color: #059669;
          border: 1px solid rgba(34, 197, 94, 0.4);
        }

        .no-posts {
          text-align: center;
          color: ${theme === "dark" ? "#94a3b8" : "#64748b"};
          font-style: italic;
          padding: 3rem 1rem;
          font-size: 0.95rem;
        }

        @media (max-width: 1024px) {
          .dashboard-sidebar {
            transform: translateX(-100%);
          }
          .dashboard-main {
            margin-left: 0;
          }
          .dashboard-content-card {
            grid-template-columns: 1fr;
          }
          .dashboard-main-left,
          .dashboard-main-right {
            border-right: none;
          }
        }
      `}</style>

      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Campus Buddy</div>
        <div>
          <div className="sidebar-section-title">Club Admin</div>
          <ul className="sidebar-menu">
            <li className="sidebar-item active">Dashboard</li>
          </ul>
        </div>
      </aside>

      <main className="dashboard-main">
        <div
          className="dashboard-topbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <div className="dashboard-top-left">
            <h1>Club Admin Dashboard</h1>
            <span className="dashboard-subtitle">
              Create events and announcements for your club.
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              marginTop: "0.5rem",
            }}
          >
            {/* Back to Dashboard Button */}
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "0.75rem 2rem",
                background: "transparent",
                color: theme === "dark" ? "#e2e8f0" : "#475569",
                border: "2px solid",
                borderColor:
                  theme === "dark"
                    ? "rgba(226,232,240,0.6)"
                    : "rgba(71,85,105,0.4)",
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
                    ? "rgba(226,232,240,0.2)"
                    : "rgba(71,85,105,0.1)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.transform = "translateY(0)";
              }}
            >
              ← Back to dashboard
            </button>

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
          </div>
        </div>

        <section className="dashboard-content-card">
          <div className="dashboard-main-left">
            <h3>Create new post</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Club name</label>
                <input
                  className="form-control"
                  name="clubName"
                  value={form.clubName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event date (optional)</label>
                <input
                  type="date"
                  className="form-control"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Location (optional)</label>
                <input
                  className="form-control"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="event">Event</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">
                Post to club board
              </button>
              {message && <p className="message">{message}</p>}
            </form>
          </div>

          <div className="dashboard-main-right">
            <h3>My club posts</h3>
            {posts.length === 0 ? (
              <div className="no-posts">No posts yet.</div>
            ) : (
              posts.map((p) => (
                <div key={p._id} className="post-item">
                  <div className="post-title">{p.title}</div>
                  <p className="post-meta">{p.clubName}</p>
                  {p.eventDate && (
                    <p className="post-meta">
                      📅 {new Date(p.eventDate).toLocaleDateString()}
                    </p>
                  )}
                  <p className="post-meta">
                    Status:{" "}
                    <span
                      className={`post-status status-${p.status.toLowerCase()}`}
                    >
                      {p.status}
                    </span>
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClubAdminDashboardPage;
