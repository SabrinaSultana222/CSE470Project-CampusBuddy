import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Admin Panel</h2>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>

        <div className="admin-sidebar-section-title">Manage Users</div>
        <NavLink to="/admin/users">All Users</NavLink>
        <NavLink to="/admin/users/students">View Students</NavLink>
        <NavLink to="/admin/users/faculty">View Faculty</NavLink>

        {/* NEW section for club posts moderation */}
        <div className="admin-sidebar-section-title">Moderation</div>
        <NavLink to="/admin/club-posts">Club posts moderation</NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
