import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FacultyDashboardPlaceholder from "./pages/FacultyDashboardPlaceholder";
// at the top with other imports
import ClubAdminDashboardPage from "./pages/ClubAdminDashboardPage";
import AdminClubPostsPage from "./pages/AdminClubPostsPage";


// NEW imports for admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminUserDetailsPage from "./pages/AdminUserDetailsPage";

const AuthLayout = ({ children }) => (
  <div className="app-shell">
    <div className="auth-container">
      <header className="top-nav">
        <h1 style={{ fontSize: 18, margin: 0 }}>Campus Buddy</h1>
        <nav className="nav-links">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </nav>
      </header>
      {children}
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth pages */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />

        {/* Student dashboard full-screen */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Faculty dashboard placeholder */}
        <Route path="/faculty" element={<FacultyDashboardPlaceholder />} />
        <Route path="/club-admin" element={<ClubAdminDashboardPage />} />
        <Route path="/admin/club-posts" element={<AdminClubPostsPage />} />

        {/* Admin dashboard and user management (with sidebar layout) */}
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
          path="/admin/users/students"
          element={
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users/faculty"
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

        {/* Default route -> login */}
        <Route
          path="/"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
