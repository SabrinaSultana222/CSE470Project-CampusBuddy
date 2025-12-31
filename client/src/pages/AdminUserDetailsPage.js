import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminUserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/admin/users/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage(data.message || "Failed to load user");
          setLoading(false);
          return;
        }
        setUser(data);
        setLoading(false);
      } catch {
        setMessage("Network error");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <div className="admin-page">
      <div className="page-actions">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading user details...</p>
        </div>
      ) : !user ? (
        <div className="error-state">
          <p>{message || "User not found"}</p>
        </div>
      ) : (
        <div className="admin-user-details-card">
          <div className="user-header">
            <h1>{user.name}</h1>
            <span className={`user-role-badge role-${user.role}`}>
              {user.role}
            </span>
          </div>

          <div className="details-grid">
            <div className="detail-section">
              <h2>Basic Information</h2>
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">BRACU ID:</span>
                <span>{user.bracuId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h2>Account Details</h2>
              <div className="detail-item">
                <span className="detail-label">Club Admin:</span>
                <span>{user.isClubAdmin ? "Yes" : "No"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created:</span>
                <span>{user.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Updated:</span>
                <span>{user.updatedAt
                  ? new Date(user.updatedAt).toLocaleString()
                  : "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetailsPage;
