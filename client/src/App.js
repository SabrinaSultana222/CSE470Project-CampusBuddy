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

import FaqPage from "./pages/FaqPage";
import TodoList from "./pages/TodoList";
import ClassSchedule from "./pages/ClassSchedule";
import EventCalendar from "./pages/EventCalendar";
import ReportPage from "./pages/ReportPage";


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

        {/* Student dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Student feature routes */}
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/classes" element={<ClassSchedule />} />
        <Route path="/events" element={<EventCalendar />} />
        <Route path="/report" element={<ReportPage />} />

        {/* Faculty & club admin */}
        <Route path="/faculty" element={<FacultyDashboardPlaceholder />} />
        <Route path="/club-admin" element={<ClubAdminDashboardPage />} />

        {/* Admin routes */}
        <Route path="/admin/club-posts" element={<AdminClubPostsPage />} />
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

        {/* Default route */}
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
