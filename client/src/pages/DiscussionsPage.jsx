import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DiscussionsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query =
          category === "all" ? "" : `?category=${encodeURIComponent(category)}`;
        const res = await fetch(
          `http://localhost:5001/api/discussions${query}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load discussions");
        } else {
          setPosts(data);
        }
      } catch {
        setError("Network error while loading discussions");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [category]);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.courseCode || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="clubs-page-root">
      <div className="clubs-page-container">
        <div className="clubs-header">
          <div>
            <h1 className="clubs-title-main">Discussions</h1>
            <p className="clubs-subtitle">
              Ask questions and discuss courses, clubs, and campus life.
            </p>
          </div>
          <button
            className="clubs-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to dashboard
          </button>
        </div>

        {/* Filters + new button */}
        <div className="clubs-filters">
          <input
            type="text"
            placeholder="Search by title or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="clubs-search"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="clubs-select"
          >
            <option value="all">All</option>
            <option value="course">Courses</option>
            <option value="club">Clubs</option>
            <option value="general">General</option>
          </select>
          <button
            className="clubs-back-btn"
            onClick={() => navigate("/discussions/new")}
          >
            + New discussion
          </button>
        </div>

        {loading && <div className="clubs-state">Loading discussions...</div>}
        {error && !loading && (
          <div className="clubs-state clubs-state-error">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="clubs-state">
            <div style={{ fontSize: 32 }}>💬</div>
            <p>No discussions yet. Start the first one!</p>
          </div>
        )}

        <div className="clubs-list">
          {filtered.map((post) => (
            <article
              key={post._id}
              className="clubs-card"
              onClick={() => navigate(`/discussions/${post._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="clubs-card-header">
                <span className="clubs-club-name">
                  {post.category === "course"
                    ? post.courseCode || "Course"
                    : post.category === "club"
                    ? "Club"
                    : "General"}
                </span>
                <span className="clubs-chip">
                  {post.author?.role || "Student"}
                </span>
              </div>
              <h2 className="clubs-card-title">{post.title}</h2>
              <p className="clubs-card-desc">
                {post.body.length > 140
                  ? post.body.slice(0, 140) + "..."
                  : post.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscussionsPage;
