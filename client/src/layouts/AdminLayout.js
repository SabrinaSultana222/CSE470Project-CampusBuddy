//import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = ({ children }) => {
  //const navigate = useNavigate();

  //const handleLogout = async () => {
    //try {
      //await fetch("http://localhost:5001/api/auth/logout", {
        //method: "POST",
        //credentials: "include",
      //});
   // } catch (err) {
      // ignore network error here
   // }
   // navigate("/login");
 // };

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-content">
            {/* Move title lower with margin-top */}
            <h1 className="admin-topbar-title" style={{ marginTop: '0.75rem' }}>
              Admin Panel
            </h1>
            {/* Logout button positioned top-right */}
            <div style={{ 
              position: 'absolute', 
              top: '1.5rem', 
              right: '2.5rem' 
            }}>
              
            </div>
          </div>
        </header>

        <div className="admin-main-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
