import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HelpFAQPage from './pages/HelpFAQPage'; // or './components/HelpFAQPage'

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Bar Example */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/help">Help/FAQ</Link></li>
          </ul>
        </nav>
        <Routes>
          {/* Add other routes here as you make more pages */}
          <Route path="/help" element={<HelpFAQPage />} />
          <Route path="/" element={<h2>Welcome to Campus Buddy!</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
