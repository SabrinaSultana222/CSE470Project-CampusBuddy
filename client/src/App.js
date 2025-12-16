import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

// Your components
import Chatbot from "./components/Chatbot";
import Notifications from "./components/Notifications";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FacultyDashboardPlaceholder from "./pages/FacultyDashboardPlaceholder";
import ClubAdminDashboardPage from "./pages/ClubAdminDashboardPage";
import AdminClubPostsPage from "./pages/AdminClubPostsPage";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminUserDetailsPage from "./pages/AdminUserDetailsPage";

/* Auth layout (Sabrina) + your theme toggle */
const AuthLayout = ({ children, isDark, setIsDark }) => (
  <div className={isDark ? "app dark" : "app light"}>
    <div className="auth-container">
      <header className="top-nav">
        <h1 style={{ fontSize: 18, margin: 0 }}>Campus Buddy</h1>

        <nav className="nav-links">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </nav>

        <button onClick={() => setIsDark(!isDark)}>
          {isDark ? "Light" : "Dark"} Mode
        </button>
      </header>

      {children}

      {/* Your features */}
      <Chatbot />
      <Notifications />
    </div>
  </div>
);

const App = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Auth pages */}
        <Route
          path="/login"
          element={
            <AuthLayout isDark={isDark} setIsDark={setIsDark}>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout isDark={isDark} setIsDark={setIsDark}>
              <RegisterPage />
            </AuthLayout>
          }
        />

        {/* Dashboards */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/faculty" element={<FacultyDashboardPlaceholder />} />
        <Route path="/club-admin" element={<ClubAdminDashboardPage />} />
        <Route path="/admin/club-posts" element={<AdminClubPostsPage />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <AdminLayout>
              <AdminUserDetailsPage />
            </AdminLayout>
          }
        />

        {/* Default */}
        <Route
          path="/"
          element={
            <AuthLayout isDark={isDark} setIsDark={setIsDark}>
              <LoginPage />
            </AuthLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
