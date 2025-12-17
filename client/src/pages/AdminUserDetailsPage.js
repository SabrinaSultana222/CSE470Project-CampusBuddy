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
    <div>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      {loading ? (
        <p>Loading user...</p>
      ) : !user ? (
        <p>{message || "User not found"}</p>
      ) : (
        <div className="admin-user-details-card">
          <h1>User Details</h1>

          <div className="details-grid">
            <div>
              <h2>Basic Info</h2>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {user.isActive ? "Active" : "Inactive"}
              </p>
              <p>
                <strong>BRACU ID:</strong> {user.bracuId}
              </p>
            </div>

            <div>
              <h2>Meta</h2>
              <p>
                <strong>Created at:</strong>{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>Updated at:</strong>{" "}
                {user.updatedAt
                  ? new Date(user.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetailsPage;
