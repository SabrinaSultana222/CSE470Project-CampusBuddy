import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const DiscussionDetailPage = () => {
  const { theme } = useTheme();
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
      <div
        style={{
          minHeight: "100vh",
          background:
            theme === "dark"
              ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
              : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #e0f2fe 100%)",
          padding: "2rem 0",
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            backdropFilter: "blur(20px)",
            background:
              theme === "dark"
                ? "rgba(30,41,59,0.6)"
                : "rgba(255,255,255,0.8)",
            borderRadius: "24px",
            maxWidth: "500px",
          }}
        >
          <div style={{ fontSize: "2.6rem", marginBottom: "1rem" }}>💬</div>
          <p
            style={{
              fontSize: "1.05rem",
              color: theme === "dark" ? "#94a3b8" : "#64748b",
            }}
          >
            Loading discussion...
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            theme === "dark"
              ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
              : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #e0f2fe 100%)",
          padding: "2rem 0",
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "3.5rem 2rem",
            backdropFilter: "blur(20px)",
            background:
              theme === "dark"
                ? "rgba(30,41,59,0.6)"
                : "rgba(255,255,255,0.8)",
            borderRadius: "24px",
            maxWidth: "500px",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.3)",
            fontSize: "0.95rem",
          }}
        >
          {error || "Discussion not found"}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #e0f2fe 100%)",
        padding: "2rem 0",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 5%" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "3rem",
            backdropFilter: "blur(20px)",
            background:
              theme === "dark"
                ? "rgba(15,23,42,0.8)"
                : "rgba(255,255,255,0.9)",
            padding: "1.8rem",
            borderRadius: "24px",
            border:
              theme === "dark"
                ? "1px solid rgba(148,163,184,0.3)"
                : "1px solid rgba(0,0,0,0.05)",
            boxShadow:
              theme === "dark"
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.1rem)",
                fontWeight: "900",
                color: theme === "dark" ? "#60a5fa" : "#1e40af",
                textShadow:
                  theme === "dark"
                    ? "0 0 20px rgba(96,165,250,0.5)"
                    : "0 0 20px rgba(30,64,175,0.3)",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {post.title}
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                color: theme === "dark" ? "#e2e8f0" : "#64748b",
                margin: "0.8rem 0 0 0",
                lineHeight: 1.6,
              }}
            >
              {post.category === "course"
                ? post.courseCode || "Course discussion"
                : post.category === "club"
                ? "Club discussion"
                : "General discussion"}
            </p>
          </div>
          <button
            onClick={() => navigate("/discussions")}
            style={{
              padding: "0.65rem 1.8rem",
              background: "transparent",
              color: theme === "dark" ? "#e2e8f0" : "#475569",
              border: "2px solid",
              borderColor:
                theme === "dark"
                  ? "rgba(226,232,240,0.6)"
                  : "rgba(71,85,105,0.4)",
              borderRadius: "2rem",
              fontWeight: "600",
              fontSize: "0.9rem",
              cursor: "pointer",
              backdropFilter: "blur(20px)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background =
                theme === "dark"
                  ? "rgba(226,232,240,0.2)"
                  : "rgba(71,85,105,0.1)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateY(0)";
            }}
          >
            ← Back to discussions
          </button>
        </div>

        {/* Original Post */}
        <article
          style={{
            backdropFilter: "blur(20px)",
            background:
              theme === "dark"
                ? "rgba(15,23,42,0.7)"
                : "rgba(255,255,255,0.9)",
            padding: "2.1rem",
            borderRadius: "24px",
            border:
              theme === "dark"
                ? "1px solid rgba(148,163,184,0.3)"
                : "1px solid rgba(0,0,0,0.05)",
            marginBottom: "2.3rem",
            boxShadow:
              theme === "dark"
                ? "0 20px 40px rgba(0,0,0,0.4)"
                : "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.3rem",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: theme === "dark" ? "#f8fafc" : "#1e293b",
              }}
            >
              {post.author?.name || "Unknown"}
            </span>
            <span
              style={{
                background:
                  theme === "dark"
                    ? "rgba(96,165,250,0.2)"
                    : "rgba(30,64,175,0.1)",
                color: theme === "dark" ? "#60a5fa" : "#1e40af",
                padding: "0.4rem 1.1rem",
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: "600",
              }}
            >
              {post.author?.role || "Student"}
            </span>
          </div>
          <p
            style={{
              color: theme === "dark" ? "#e2e8f0" : "#374151",
              lineHeight: 1.8,
              margin: 0,
              fontSize: "1rem",
            }}
          >
            {post.body}
          </p>
        </article>

        {/* Add Comment */}
        <div
          style={{
            backdropFilter: "blur(20px)",
            background:
              theme === "dark"
                ? "rgba(15,23,42,0.7)"
                : "rgba(255,255,255,0.9)",
            padding: "1.8rem",
            borderRadius: "24px",
            border:
              theme === "dark"
                ? "1px solid rgba(148,163,184,0.3)"
                : "1px solid rgba(0,0,0,0.05)",
            marginBottom: "2.3rem",
            boxShadow:
              theme === "dark"
                ? "0 20px 40px rgba(0,0,0,0.4)"
                : "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "1.35rem",
              fontWeight: "800",
              color: theme === "dark" ? "#f8fafc" : "#1e293b",
              margin: "0 0 1.3rem 0",
            }}
          >
            Add a comment
          </h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "1.1rem",
              borderRadius: "20px",
              border: "none",
              fontSize: "0.95rem",
              outline: "none",
              resize: "vertical",
              background:
                theme === "dark"
                  ? "rgba(30,41,59,0.8)"
                  : "rgba(248,250,252,0.9)",
              color: theme === "dark" ? "#f8fafc" : "#1e293b",
              backdropFilter: "blur(20px)",
              boxShadow:
                theme === "dark"
                  ? "inset 0 2px 10px rgba(0,0,0,0.3)"
                  : "inset 0 2px 10px rgba(0,0,0,0.1)",
            }}
            placeholder="Share your thoughts..."
          />
          <button
            onClick={() => handleAddComment(null)}
            disabled={!content.trim()}
            style={{
              marginTop: "0.9rem",
              padding: "0.9rem 2.2rem",
              background: "linear-gradient(135deg, #3b82f6, #1e40af)",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontSize: "0.95rem",
              fontWeight: "700",
              cursor: content.trim() ? "pointer" : "not-allowed",
              boxShadow: "0 10px 30px rgba(59,130,246,0.4)",
              transition: "all 0.3s ease",
              opacity: content.trim() ? 1 : 0.7,
            }}
            onMouseEnter={(e) => {
              if (content.trim()) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 20px 40px rgba(59,130,246,0.5)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow =
                "0 10px 30px rgba(59,130,246,0.4)";
            }}
          >
            Post comment
          </button>
        </div>

        {/* Comments */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {topLevel.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3.5rem 2rem",
                backdropFilter: "blur(20px)",
                background:
                  theme === "dark"
                    ? "rgba(30,41,59,0.6)"
                    : "rgba(255,255,255,0.8)",
                borderRadius: "24px",
              }}
            >
              <div style={{ fontSize: "2.6rem", marginBottom: "1rem" }}>
                🗨️
              </div>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: theme === "dark" ? "#94a3b8" : "#64748b",
                }}
              >
                No comments yet. Be the first to reply.
              </p>
            </div>
          )}

          {topLevel.map((c) => (
            <div
              key={c._id}
              style={{
                backdropFilter: "blur(20px)",
                background:
                  theme === "dark"
                    ? "rgba(15,23,42,0.7)"
                    : "rgba(255,255,255,0.9)",
                padding: "1.8rem",
                borderRadius: "24px",
                border:
                  theme === "dark"
                    ? "1px solid rgba(148,163,184,0.3)"
                    : "1px solid rgba(0,0,0,0.05)",
                boxShadow:
                  theme === "dark"
                    ? "0 20px 40px rgba(0,0,0,0.4)"
                    : "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.9rem",
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                    color: theme === "dark" ? "#f8fafc" : "#1e293b",
                  }}
                >
                  {c.author?.name || "Student"}
                </span>
                <span
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(96,165,250,0.2)"
                        : "rgba(30,64,175,0.1)",
                    color: theme === "dark" ? "#60a5fa" : "#1e40af",
                    padding: "0.35rem 0.95rem",
                    borderRadius: "16px",
                    fontSize: "0.78rem",
                    fontWeight: "600",
                  }}
                >
                  {c.author?.role || "Student"}
                </span>
              </div>
              <p
                style={{
                  color: theme === "dark" ? "#e2e8f0" : "#374151",
                  lineHeight: 1.7,
                  margin: "0 0 1.3rem 0",
                  fontSize: "0.98rem",
                }}
              >
                {c.content}
              </p>

              {repliesByParent[c._id] && (
                <div
                  style={{
                    marginTop: "1.3rem",
                    padding: "1.3rem",
                    background:
                      theme === "dark"
                        ? "rgba(30,41,59,0.5)"
                        : "rgba(248,250,252,0.7)",
                    borderRadius: "20px",
                    borderLeft: `4px solid ${
                      theme === "dark" ? "#60a5fa" : "#3b82f6"
                    }`,
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "700",
                      color: theme === "dark" ? "#94a3b8" : "#64748b",
                      margin: "0 0 0.9rem 0",
                    }}
                  >
                    Replies:
                  </h4>
                  {repliesByParent[c._id].map((r) => (
                    <div
                      key={r._id}
                      style={{
                        marginBottom: "0.9rem",
                        paddingBottom: "0.9rem",
                        borderBottom:
                          "1px solid rgba(148,163,184,0.2)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: theme === "dark" ? "#f8fafc" : "#1e293b",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {r.author?.name || "Student"}{" "}
                        <span
                          style={{
                            color:
                              theme === "dark" ? "#94a3b8" : "#64748b",
                            fontWeight: "500",
                          }}
                        >
                          ({r.author?.role || "Student"})
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color:
                            theme === "dark" ? "#cbd5e1" : "#4b5563",
                        }}
                      >
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
