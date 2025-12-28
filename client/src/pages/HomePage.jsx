import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const HomePage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`home-root ${theme}`}>
      {/* Top navigation bar */}
      <header className="home-nav">
        <div className="home-logo-wrapper">
          <span className="home-logo-icon">🎓</span>
          <div className="home-logo">Campus Buddy</div>
        </div>

        <nav className="home-links">
          <Link to="/">Home</Link>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
          <button className="home-theme-btn" onClick={toggleTheme}>
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>
        </nav>
      </header>

      {/* Hero section */}
      <main className="home-hero">
        <div className="home-hero-left">
          <p className="home-pill">🎓 Smart campus life assistant</p>
          <h1>Stay on top of classes, clubs, and campus life.</h1>
          <p className="home-hero-sub">
            Campus Buddy helps students manage schedules, assignments, club
            events, and discussions in one clean dashboard.
          </p>
          <div className="home-hero-actions">
            <button
              className="home-primary-btn"
              onClick={() => navigate("/register")}
            >
              Get started
            </button>
            <button
              className="home-ghost-btn"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>
      </main>

      {/* About section */}
      <section className="home-about">
        <h2>About Campus Buddy</h2>
        <p>
         Campus Buddy is a smart student life companion that brings schedules, assignments, clubs, and discussions into one organized hub, helping students stay on top of campus life with less stress and more clarity.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
