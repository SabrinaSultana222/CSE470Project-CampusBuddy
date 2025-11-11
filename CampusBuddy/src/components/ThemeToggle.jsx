import { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setIsDark(theme === 'dark');
    applyTheme(theme === 'dark');
  }, []);

  const applyTheme = (dark) => {
    const html = document.documentElement;
    if (dark) {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleToggle = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    applyTheme(newDarkState);
  };

  return (
    <button className="theme-toggle" onClick={handleToggle} title="Toggle theme">
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
