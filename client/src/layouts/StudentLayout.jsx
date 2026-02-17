import { NavLink, Outlet, useNavigate } from "react-router-dom";

const StudentLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    navigate("/login");
  };

  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Campus Buddy</div>

        <div>
          <div className="sidebar-section-title">General</div>
          <ul className="sidebar-menu">
            <NavLink className="sidebar-item" to="/dashboard">Dashboard</NavLink>
            <NavLink className="sidebar-item" to="/faq">Help / FAQ</NavLink>
            <NavLink className="sidebar-item" to="/todo">To-Do List</NavLink>
            <NavLink className="sidebar-item" to="/classes">Class Schedule</NavLink>
            <NavLink className="sidebar-item" to="/events">Event Calendar</NavLink>
            <NavLink className="sidebar-item" to="/report">Reports</NavLink>
          </ul>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
