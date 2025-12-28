import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DiscussionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/discussions/${id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load discussion");
        } else {
          setPost(data.post);
          setComments(data.comments);
        }
      } catch {
        setError("Network error while loading discussion");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussion();
  }, [id]);

  const handleAddComment = async (parentId = null) => {
    if (!content.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:5001/api/discussions/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content, parent: parentId }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to add comment");
        return;
      }
      setComments((prev) => [...prev, data]);
      setContent("");
    } catch {
      alert("Network error while adding comment");
    }
  };

  // group comments into top-level + replies
  const topLevel = comments.filter((c) => !c.parent);
  const repliesByParent = comments.reduce((acc, c) => {
    if (!c.parent) return acc;
    const key = c.parent.toString();
    acc[key] = acc[key] || [];
    acc[key].push(c);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="clubs-page-root">
        <div className="clubs-page-container">
          <div className="clubs-state">Loading discussion...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="clubs-page-root">
        <div className="clubs-page-container">
          <div className="clubs-state clubs-state-error">
            {error || "Discussion not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="clubs-page-root">
      <div className="clubs-page-container">
        <div className="clubs-header">
          <div>
            <h1 className="clubs-title-main">{post.title}</h1>
            <p className="clubs-subtitle">
              {post.category === "course"
                ? post.courseCode || "Course discussion"
                : post.category === "club"
                ? "Club discussion"
                : "General discussion"}
            </p>
          </div>
          <button
            className="clubs-back-btn"
            onClick={() => navigate("/discussions")}
          >
            ← Back to discussions
          </button>
        </div>

        {/* Original post */}
        <article className="clubs-card" style={{ marginBottom: 24 }}>
          <div className="clubs-card-header">
            <span className="clubs-club-name">
              {post.author?.name || "Unknown"}
            </span>
            <span className="clubs-chip">
              {post.author?.role || "Student"}
            </span>
          </div>
          <p className="clubs-card-desc">{post.body}</p>
        </article>

        {/* Add comment */}
        <div className="clubs-card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>Add a comment</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              resize: "vertical",
            }}
            placeholder="Write your comment here..."
          />
          <button
            className="clubs-back-btn"
            style={{ marginTop: 8 }}
            onClick={() => handleAddComment(null)}
          >
            Post comment
          </button>
        </div>

        {/* Comments */}
        <div className="clubs-list">
          {topLevel.length === 0 && (
            <div className="clubs-state">
              <div style={{ fontSize: 28 }}>🗨️</div>
              <p>No comments yet. Be the first to reply.</p>
            </div>
          )}

          {topLevel.map((c) => (
            <div key={c._id} className="clubs-card">
              <div className="clubs-card-header">
                <span className="clubs-club-name">
                  {c.author?.name || "Student"}
                </span>
                <span className="clubs-chip">
                  {c.author?.role || "Student"}
                </span>
              </div>
              <p className="clubs-card-desc">{c.content}</p>

              {/* Replies */}
              {repliesByParent[c._id] && (
                <div style={{ marginTop: 10, paddingLeft: 16, borderLeft: "2px solid #e5e7eb" }}>
                  {repliesByParent[c._id].map((r) => (
                    <div key={r._id} style={{ marginBottom: 8 }}>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {r.author?.name || "Student"}{" "}
                        <span style={{ color: "#6b7280" }}>
                          ({r.author?.role || "Student"})
                        </span>
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                        {r.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetailPage;
