import React, { useEffect, useState } from "react";

const ClubAdminDashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    clubName: "",
    title: "",
    description: "",
    eventDate: "",
    location: "",
    category: "event",
  });
  const [message, setMessage] = useState("");

  const fetchMyPosts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/club-posts/my", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Failed to load posts");
        return;
      }
      setPosts(data);
      setMessage("");
    } catch {
      setMessage("Network error loading posts");
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5001/api/club-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Failed to create post");
        return;
      }

      setMessage("Post created (pending approval).");
      setForm({
        clubName: "",
        title: "",
        description: "",
        eventDate: "",
        location: "",
        category: "event",
      });
      fetchMyPosts();
    } catch {
      setMessage("Network error creating post");
    }
  };

  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Campus Buddy</div>
        <div>
          <div className="sidebar-section-title">Club Admin</div>
          <ul className="sidebar-menu">
            <li className="sidebar-item active">Dashboard</li>
          </ul>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="dashboard-top-left">
            <h1 style={{ margin: 0, fontSize: 24 }}>Club Admin Dashboard</h1>
            <span className="dashboard-subtitle">
              Create events and announcements for your club.
            </span>
          </div>
        </div>

        <section className="dashboard-content-card">
          <div className="dashboard-main-left">
            <h3>Create new post</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Club name</label>
                <input
                  className="form-control"
                  name="clubName"
                  value={form.clubName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event date (optional)</label>
                <input
                  type="date"
                  className="form-control"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Location (optional)</label>
                <input
                  className="form-control"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="event">Event</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">
                Post to club board
              </button>
              {message && <p className="message" style={{ marginTop: 8 }}>{message}</p>}
            </form>
          </div>

          <div className="dashboard-main-right">
            <h3>My club posts</h3>
            {posts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              posts.map((p) => (
                <div
                  key={p._id}
                  className="form-group"
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                  }}
                >
                  <strong>{p.title}</strong>
                  <p style={{ margin: "4px 0" }}>{p.clubName}</p>
                  {p.eventDate && (
                    <p style={{ margin: "4px 0" }}>
                      {new Date(p.eventDate).toLocaleDateString()}
                    </p>
                  )}
                  <p style={{ margin: "4px 0" }}>
                    Status: <b>{p.status}</b>
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClubAdminDashboardPage;
