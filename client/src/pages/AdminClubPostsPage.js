import React, { useEffect, useState } from "react";

const AdminClubPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [message, setMessage] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/club-posts${
          statusFilter ? `?status=${statusFilter}` : ""
        }`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Failed to load club posts");
        return;
      }
      setPosts(data);
      setMessage("");
    } catch {
      setMessage("Network error loading club posts");
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdateStatus = async (postId, newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to mark this post as ${newStatus}?`
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/club-posts/${postId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to update status");
        return;
      }

      // Refresh or update list
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, status: newStatus } : p
        )
      );
      showToast(data.message || "Status updated");
    } catch {
      showToast("Network error updating status");
    }
  };

  return (
    <div>
      <h1>Club posts moderation</h1>
      <p>
        Reviewing{" "}
        <strong>{statusFilter || "all"}</strong> club posts submitted by club
        admins.
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <label>Status filter: </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      {message && <div className="admin-toast">{message}</div>}

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Club</th>
              <th>Created by</th>
              <th>Event date</th>
              <th>Status</th>
              <th>Submitted at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.clubName}</td>
                <td>
                  {p.createdBy
                    ? `${p.createdBy.name} (${p.createdBy.email})`
                    : "Unknown"}
                </td>
                <td>
                  {p.eventDate
                    ? new Date(p.eventDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>{p.status}</td>
                <td>
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleString()
                    : "-"}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleUpdateStatus(p._id, "approved")}
                    disabled={p.status === "approved"}
                    style={{ marginRight: "0.4rem" }}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleUpdateStatus(p._id, "rejected")}
                    disabled={p.status === "rejected"}
                  >
                    Reject
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

export default AdminClubPostsPage;
