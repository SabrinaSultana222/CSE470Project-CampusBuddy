import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import { useTheme } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

// Pages
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

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminUserDetailsPage from "./pages/AdminUserDetailsPage";

/* Auth layout (Login/Register wrapper) */
const AuthLayout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",   // top-align the card
          paddingTop: "40px",         // small top spacing
        }}
      >
        <div className="auth-container">
          <header className="top-nav">
            <h1 style={{ fontSize: 18, margin: 0 }}>Campus Buddy</h1>

            <nav className="nav-links">
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </nav>

            <button onClick={toggleTheme}>
              {theme === "dark" ? "Light" : "Dark"} Mode
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

          {/* Dashboards */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/faculty" element={<FacultyDashboardPage />} />
          <Route path="/club-admin" element={<ClubAdminDashboardPage />} />
          <Route path="/admin/club-posts" element={<AdminClubPostsPage />} />

          {/* Feature pages */}
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/gpa" element={<GpaCalculator />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />

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
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
