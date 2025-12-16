import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // ignore network error here
    }
    navigate("/login");
  };

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-main">
        <header className="admin-topbar">
          <h1 className="admin-topbar-title">Admin Panel</h1>
          <button type="button" className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="admin-main-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
