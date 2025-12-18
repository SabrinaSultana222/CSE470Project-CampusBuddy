import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";          // reuse same basic styling
import { getUser, removeToken } from "../utils/api";
import { useNavigate } from "react-router-dom";

const FacultyNavbar = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    window.dispatchEvent(new CustomEvent("authChange", { detail: { user: null } }));
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <h1>🎓 CampusBuddy – Faculty</h1>
        </div>

        {/* Right side: theme + user + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="navbar-theme">
            <ThemeToggle />
          </div>

          <span className="navbar-user">
            👤 {user ? user.name : "Faculty"}
          </span>

          <button
            className="btn-logout"
            onClick={handleLogout}
            title="Logout from your account"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default FacultyNavbar;
