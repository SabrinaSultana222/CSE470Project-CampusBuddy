import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Admin Panel</h2>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <span className="sidebar-icon">📊</span>
          Dashboard
        </NavLink>

        <div className="admin-sidebar-section-title">Manage Users</div>
        
        {/* FIXED: Remove 'end' from parent route */}
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <span className="sidebar-icon">👥</span>
          All Users
        </NavLink>
        
        <NavLink 
          to="/admin/users/students" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <span className="sidebar-icon">🎓</span>
          View Students
        </NavLink>
        
        <NavLink 
          to="/admin/users/faculty" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <span className="sidebar-icon">👨‍🏫</span>
          View Faculty
        </NavLink>

        <div className="admin-sidebar-section-title">Moderation</div>
        <NavLink 
          to="/admin/club-posts" 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <span className="sidebar-icon">📝</span>
          Club posts moderation
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
