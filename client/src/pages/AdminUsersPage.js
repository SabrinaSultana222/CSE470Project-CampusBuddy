import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const roleFilter =
    location.pathname.endsWith("/students")
      ? "student"
      : location.pathname.endsWith("/faculty")
      ? "faculty"
      : "";

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5001/api/admin/users${
          roleFilter ? `?role=${roleFilter}` : ""
        }`,
        { credentials: "include" }
      );

      if (!res.ok) {
        setLoading(false);
        setToast("Failed to load users");
        return;
      }

      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch {
      setLoading(false);
      setToast("Network error loading users");
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.isActive;
    const question = newStatus
      ? `Are you sure you want to activate ${user.name}?`
      : `Are you sure you want to deactivate ${user.name}?`;

    if (!window.confirm(question)) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/admin/users/${user._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isActive: newStatus }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to update status");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isActive: newStatus } : u
        )
      );
      showToast(data.message);
    } catch {
      showToast("Network error updating status");
    }
  };

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${user.name}?`
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/admin/users/${user._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to delete user");
        return;
      }

      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      showToast(data.message);
    } catch {
      showToast("Network error deleting user");
    }
  };

  const handleViewDetails = (user) => {
    navigate(`/admin/users/${user._id}`);
  };

  // NEW: toggle student club-admin flag (isClubAdmin)
  const handleToggleClubAdmin = async (user, makeClubAdmin) => {
    if (user.role === "faculty") {
      showToast("Faculty cannot be assigned club admin here");
      return;
    }

    if (user.role !== "student") {
      showToast("Only students can be promoted to club admin");
      return;
    }

    if (user.isClubAdmin === makeClubAdmin) return;

    const question = makeClubAdmin
      ? `Promote ${user.name} to student + club admin?`
      : `Remove club admin privileges from ${user.name}?`;

    if (!window.confirm(question)) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/admin/users/${user._id}/role`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isClubAdmin: makeClubAdmin }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to update club admin flag");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isClubAdmin: makeClubAdmin } : u
        )
      );
      showToast(data.message || "Club admin flag updated");
    } catch {
      showToast("Network error updating club admin flag");
    }
  };

  return (
    <div>
      <h1>Users</h1>
      {roleFilter === "student" && <p>Viewing all students.</p>}
      {roleFilter === "faculty" && <p>Viewing all faculty.</p>}
      {!roleFilter && <p>Viewing all users.</p>}

      {toast && <div className="admin-toast">{toast}</div>}

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>BRACU ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Club Admin?</th>
              <th>Status</th>
              <th>Club Admin Actions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.bracuId}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge role-${u.role}`}>{u.role}</span>
                </td>
                <td>{u.isClubAdmin ? "Yes" : "No"}</td>
                <td>
                  <button
                    type="button"
                    className={`status-toggle ${
                      u.isActive ? "status-active" : "status-inactive"
                    }`}
                    onClick={() => handleToggleStatus(u)}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleToggleClubAdmin(u, true)}
                    disabled={u.role !== "student"}
                    style={{ marginRight: "0.4rem" }}
                  >
                    Make Club Admin
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleToggleClubAdmin(u, false)}
                    disabled={u.role !== "student"}
                  >
                    Remove Club Admin
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleViewDetails(u)}
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDelete(u)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsersPage;
