import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = ({ title = 'CampusBuddy' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>{title}</h1>
        </div>

        <button 
          className="navbar-toggle-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#profile">Profile</a></li>
          <li><a href="#settings">Settings</a></li>
          <li><a href="#help">Help</a></li>
          <li><a href="#logout">Logout</a></li>
        </ul>

        <div className="navbar-theme">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
