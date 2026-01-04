import { Link } from "react-router-dom";

const FacultySidebar = () => {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">Campus Buddy</div>

      <div>
        <div className="sidebar-section-title">General</div>
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <Link to="/faculty">Dashboard</Link>
          </li>

          <li className="sidebar-item">
            <Link to="/faculty/events">Event Calendar</Link>
          </li>

          <li className="sidebar-item">
            <Link to="/faculty/classes">Class Schedule</Link>
          </li>

          <li className="sidebar-item">
            <Link to="/faculty/todo">To-Do List</Link>
          </li>

          <li className="sidebar-item">
            <Link to="/faculty/faq">Help / FAQ</Link>
          </li>

          <li className="sidebar-item">
            <Link to="/faculty/report">Report Generator</Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default FacultySidebar;
