import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const HomePage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      className={`home-root ${theme}`}
      style={{
        minHeight: "100vh",
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #e0f2fe 100%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* NAVBAR */}
      <header
        className="home-nav"
        style={{
          padding: "1rem 5%",
          backdropFilter: "blur(20px)",
          background:
            theme === "dark"
              ? "rgba(15,23,42,0.95)"
              : "rgba(255,255,255,0.95)",
          borderBottom:
            theme === "dark"
              ? "1px solid rgba(148,163,184,0.3)"
              : "1px solid rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div
            className="home-logo-wrapper"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <span
              className="home-logo-icon"
              style={{
                fontSize: "2rem",
                filter:
                  theme === "dark"
                    ? "drop-shadow(0 2px 4px rgba(255,255,255,0.5))"
                    : "drop-shadow(0 4px 8px rgba(59,130,246,0.4))",
              }}
            >
              🎓
            </span>
            <div
              className="home-logo"
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                // ✅ FIXED: Solid color + glow (no more gradient text bug)
                color: theme === "dark" ? "#60a5fa" : "#1e40af",
                textShadow: theme === "dark" 
                  ? "0 0 15px rgba(96, 165, 250, 0.6)" 
                  : "0 0 15px rgba(30, 64, 175, 0.4)",
              }}
            >
              Campus Buddy
            </div>
          </div>

          <nav
            className="home-links"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <Link
              to="/"
              style={{
                color: theme === "dark" ? "#e2e8f0" : "#475569",
                fontWeight: "500",
                fontSize: "0.95rem",
                textDecoration: "none",
                padding: "0.5rem 1rem",
                borderRadius: "1.5rem",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background =
                  theme === "dark"
                    ? "rgba(148,163,184,0.3)"
                    : "rgba(71,85,105,0.1)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "transparent")
              }
            >
              Home
            </Link>

            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "0.5rem 1.25rem",
                background: "transparent",
                color: theme === "dark" ? "#e2e8f0" : "#475569",
                border: "2px solid",
                borderColor:
                  theme === "dark"
                    ? "rgba(226,232,240,0.6)"
                    : "rgba(71,85,105,0.4)",
                borderRadius: "1.75rem",
                fontWeight: "600",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  theme === "dark"
                    ? "rgba(226,232,240,0.2)"
                    : "rgba(71,85,105,0.1)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "0.75rem 2rem",
                background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                color: "white",
                border: "none",
                borderRadius: "2rem",
                fontWeight: "600",
                fontSize: "0.95rem",
                cursor: "pointer",
                boxShadow: "0 8px 25px rgba(59,130,246,0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 12px 35px rgba(59,130,246,0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 8px 25px rgba(59,130,246,0.4)";
              }}
            >
              Register
            </button>

            <button
              className="home-theme-btn"
              onClick={toggleTheme}
              style={{
                padding: "0.5rem 1.25rem",
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
                borderRadius: "1.75rem",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  theme === "dark"
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(30,41,59,0.25)";
                e.target.style.transform = "translateY(-1px)";
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
          </nav>
        </div>
      </header>

      {/* HERO */}
      <main
        className="home-hero"
        style={{
          padding: "4rem 5% 3rem",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          maxHeight: "50vh",
        }}
      >
        <div className="home-hero-left" style={{ flex: 1 }}>
          <p
            className="home-pill"
            style={{
              background:
                theme === "dark"
                  ? "rgba(59,130,246,0.25)"
                  : "rgba(59,130,246,0.15)",
              color: theme === "dark" ? "#93c5fd" : "#2563eb",
              padding: "0.5rem 1.25rem",
              borderRadius: "2.5rem",
              fontSize: "0.85rem",
              fontWeight: "600",
              display: "inline-block",
              marginBottom: "1.5rem",
              backdropFilter: "blur(10px)",
              border:
                theme === "dark"
                  ? "1px solid rgba(147,197,253,0.4)"
                  : "1px solid rgba(37,99,235,0.2)",
            }}
          >
            🎓 Smart campus life assistant
          </p>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 2.5rem)",
              fontWeight: "900",
              lineHeight: 1.2,
              color: theme === "dark" ? "#60a5fa" : "#1e40af",
              textShadow: theme === "dark" 
                ? "0 0 20px rgba(96, 165, 250, 0.5)" 
                : "0 0 20px rgba(30, 64, 175, 0.3)",
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Stay on top of classes,<br />
            clubs, and campus life.
          </h1>

          <p
            className="home-hero-sub"
            style={{
              fontSize: "1rem",
              color: theme === "dark" ? "#e2e8f0" : "#475569",
              lineHeight: 1.6,
              marginBottom: "2rem",
              maxWidth: "500px",
            }}
          >
            Campus Buddy helps students manage schedules, assignments, club
            events, and discussions in one clean dashboard.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              className="home-primary-btn"
              onClick={() => navigate("/register")}
              style={{
                padding: "0.875rem 2.25rem",
                background: "linear-gradient(135deg, #3b82f6, #1e40af)",
                color: "white",
                border: "none",
                borderRadius: "2rem",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(59,130,246,0.4)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow =
                  "0 15px 40px rgba(59,130,246,0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 10px 30px rgba(59,130,246,0.4)";
              }}
            >
              🚀 Get started
            </button>
          </div>
        </div>
      </main>

      {/* ABOUT */}
      <section
        className="home-about"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 5%",
          background:
            theme === "dark"
              ? "rgba(30,41,59,0.6)"
              : "rgba(255,255,255,0.8)",
          backdropFilter: "blur(20px)",
          minHeight: "30vh",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "2.25rem",
              fontWeight: "800",
              color: theme === "dark" ? "#60a5fa" : "#1e40af",
              textShadow: theme === "dark" 
                ? "0 0 20px rgba(96, 165, 250, 0.5)" 
                : "0 0 20px rgba(30, 64, 175, 0.3)",
              marginBottom: "1.5rem",
            }}
          >
            About Campus Buddy
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: theme === "dark" ? "#e2e8f0" : "#64748b",
              maxWidth: "650px",
              margin: "0 auto",
            }}
          >
            Campus Buddy is a smart student life companion that brings
            schedules, assignments, clubs, and discussions into one organized
            hub, helping students stay on top of campus life with less stress
            and more clarity.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
