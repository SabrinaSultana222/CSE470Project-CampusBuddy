import './global.css';
import './index.css';

const initTheme = () => {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    html.classList.add('dark-theme');
  } else {
    html.setAttribute('data-theme', 'light');
    html.classList.remove('dark-theme');
  }
};

initTheme();
