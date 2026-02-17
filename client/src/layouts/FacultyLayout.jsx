import FacultySidebar from "../components/FacultySidebar";

const FacultyLayout = ({ children }) => {
  return (
    <div className="dashboard-root">
      {/* LEFT SIDEBAR */}
      <FacultySidebar />

      {/* RIGHT MAIN CONTENT */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
};

export default FacultyLayout;
