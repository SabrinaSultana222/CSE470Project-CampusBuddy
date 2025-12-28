// client/src/layouts/pages/ClubsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClubsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/club-posts?status=approved",
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load club posts");
        } else {
          setPosts(data);
        }
      } catch {
        setError("Network error while loading club posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.clubName || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "all" ||
      (p.category || "event").toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="clubs-page-root">
      <div className="clubs-page-container">
        {/* Header */}
        <div className="clubs-header">
          <div>
            <h1 className="clubs-title-main">Clubs & Events</h1>
            <p className="clubs-subtitle">
              Latest approved club events and announcements for students.
            </p>
          </div>
          <button className="clubs-back-btn" onClick={() => navigate("/dashboard")}>
            ← Back to dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="clubs-filters">
          <input
            type="text"
            placeholder="Search by club or title..."
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
            <option value="event">Events</option>
            <option value="announcement">Announcements</option>
          </select>
        </div>

        {/* States */}
        {loading && <div className="clubs-state">Loading club posts...</div>}
        {error && !loading && (
          <div className="clubs-state clubs-state-error">{error}</div>
        )}

        {!loading && !error && filteredPosts.length === 0 && (
          <div className="clubs-state">
            <div style={{ fontSize: 32 }}>🎈</div>
            <p>No club announcements yet. Check back soon!</p>
          </div>
        )}

        {/* Cards */}
        <div className="clubs-list">
          {filteredPosts.map((post) => (
            <article key={post._id} className="clubs-card">
              <div className="clubs-card-header">
                <span className="clubs-club-name">{post.clubName}</span>
                <span className="clubs-chip">
                  {(post.category || "Event").charAt(0).toUpperCase() +
                    (post.category || "Event").slice(1)}
                </span>
              </div>

              <h2 className="clubs-card-title">{post.title}</h2>
              <p className="clubs-card-desc">{post.description}</p>

              <div className="clubs-card-meta">
                {post.eventDate && (
                  <span>📅 {new Date(post.eventDate).toLocaleDateString()}</span>
                )}
                {post.location && <span>📍 {post.location}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubsPage;
