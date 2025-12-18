import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';
import { getToken, getUser, removeToken } from '../utils/api';
import { useEffect, useState } from 'react';

const Navbar = ({ title = 'CampusBuddy' }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());
  const navigate = useNavigate();

  // Update auth state on mount and when auth events occur
  useEffect(() => {
    // Initial auth check
    setToken(getToken());
    setUser(getUser());

    const updateAuth = () => {
      setToken(getToken());
      setUser(getUser());
    };

    // Listen for storage events (cross-tab sync)
    const handleStorage = (e) => {
      if (e.key && e.key.startsWith('campusbuddy.')) {
        updateAuth();
      }
    };

    // Listen for custom auth events (same-tab login/logout)
    const handleAuthChange = () => {
      updateAuth();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []); // Empty deps - only set up listeners once

  const handleLogout = () => {
    // Remove token and update local state first
    removeToken();
    setToken(null);
    setUser(null);

    // Dispatch event after state update, then navigate
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('authChange', { detail: { user: null } }));
      navigate('/auth');
    }, 0);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🎓 {title}</h1>
        </div>

        <ul className="navbar-menu">
          <li><Link to="/">📝 Profile</Link></li>
          <li><Link to="/assignments">📋 Assignments</Link></li>
          <li><Link to="/gpa">📊 GPA</Link></li>
          <li><Link to="/lost-found">🔍 Lost & Found</Link></li>
        </ul>

        <div className="navbar-theme">
          <ThemeToggle />
        </div>

        <div className="navbar-auth">
          {token ? (
            <>
              <span className="navbar-user">
                👤 {user ? user.name : 'User'}
                {user && user.studentId && (
                  <span className="navbar-student-id"> (ID: {user.studentId})</span>
                )}
              </span>
              <button
                className="btn-logout"
                onClick={handleLogout}
                title="Logout from your account"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            // only change: /auth -> /login
            <Link to="/login" className="btn-login">
              🔐 Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
