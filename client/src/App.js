import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { useTheme } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
//faculty
import FacultyEventCalendar from "./pages/faculty/FacultyEventCalendar";
import FacultyClassSchedule from "./pages/faculty/FacultyClassSchedule";
import FacultyTodoList from "./pages/faculty/FacultyTodoList";
import FacultyFaqPage from "./pages/faculty/FacultyFaqPage";
import FacultyReportPage from "./pages/faculty/FacultyReportPage";


// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ClubAdminDashboardPage from "./pages/ClubAdminDashboardPage";
import AdminClubPostsPage from "./pages/AdminClubPostsPage";
import Assignments from "./pages/Assignments";
import GpaCalculator from "./pages/GpaCalculator";
import LostFound from "./pages/LostFound";
import ProfileSettings from "./pages/ProfileSettings";
import FacultyDashboardPage from "./pages/FacultyDashboardPage";
import ClubsPage from "./pages/ClubsPage.jsx";
import DiscussionsPage from "./pages/DiscussionsPage";
import DiscussionDetailPage from "./pages/DiscussionDetailPage";
import NewDiscussionPage from "./pages/NewDiscussionPage";

import FacultyLayout from "./layouts/FacultyLayout";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminUserDetailsPage from "./pages/AdminUserDetailsPage";
import FaqPage from "./pages/FaqPage";
import TodoList from "./pages/TodoList";
import ClassSchedule from "./pages/ClassSchedule";
import EventCalendar from "./pages/EventCalendar";
import ReportPage from "./pages/ReportPage";

/* Auth layout (Login/Register wrapper) */
const AuthLayout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`app ${theme}`}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start", // top-align the card
          paddingTop: "40px", // small top spacing
        }}
      >
        <div className="auth-container">
          <header className="top-nav">
            {/* Back button on the left */}
            <button
              className="auth-back-btn"
              onClick={() => navigate("/")}
            >
              ← Home
            </button>

            {/* Center title + tabs */}
            <div className="auth-header-center">
              <h1 style={{ fontSize: 18, margin: 0 }}>Campus Buddy</h1>
              <nav className="nav-links">
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </nav>
            </div>

            {/* Theme toggle on the right, same style as home */}
            <button className="home-theme-btn" onClick={toggleTheme}>
              {theme === "dark" ? "☀" : "🌙"}
            </button>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Home page */}
          <Route path="/" element={<HomePage />} />

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
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/discussions" element={<DiscussionsPage />} />
          <Route path="/discussions/:id" element={<DiscussionDetailPage />} />
          <Route path="/discussions/new" element={<NewDiscussionPage />} />

          {/* Faculty & club admin */}
          <Route path="/faculty" element={<FacultyDashboardPage />} />
          <Route path="/club-admin" element={<ClubAdminDashboardPage />} />
          <Route path="/faculty/events" element={<FacultyEventCalendar />} />


          <Route
            path="/faculty/classes"
            element={
              <FacultyLayout>
                <FacultyClassSchedule />
              </FacultyLayout>
            }
          />

          <Route
            path="/faculty/todo"
            element={
              <FacultyLayout>
                <FacultyTodoList />
              </FacultyLayout>
            }
          />

          <Route
            path="/faculty/faq"
            element={
              <FacultyLayout>
                <FacultyFaqPage />
              </FacultyLayout>
            }
          />

          <Route
            path="/faculty/report"
            element={
              <FacultyLayout>
                <FacultyReportPage />
              </FacultyLayout>
            }
          />



          {/* Feature pages */}
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/gpa" element={<GpaCalculator />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />

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
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
