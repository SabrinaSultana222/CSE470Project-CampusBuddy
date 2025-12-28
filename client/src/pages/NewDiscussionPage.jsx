import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewDiscussionPage = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [courseCode, setCourseCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          body,
          category,
          courseCode: category === "course" ? courseCode : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create discussion");
      } else {
        navigate(`/discussions/${data._id}`);
      }
    } catch {
      setError("Network error while creating discussion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clubs-page-root">
      <div className="clubs-page-container">
        <div className="clubs-header">
          <div>
            <h1 className="clubs-title-main">New discussion</h1>
            <p className="clubs-subtitle">
              Start a topic for your course, club, or general questions.
            </p>
          </div>
          <button
            className="clubs-back-btn"
            onClick={() => navigate("/discussions")}
          >
            ← Back to discussions
          </button>
        </div>

        <form className="clubs-card" onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                marginBottom: 8,
                color: "#b91c1c",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          <label style={{ display: "block", marginBottom: 8 }}>
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                marginTop: 4,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
              }}
              placeholder="e.g., Confused about Assignment 3 requirements"
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            <span>Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                marginTop: 4,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
              }}
            >
              <option value="general">General</option>
              <option value="course">Course</option>
              <option value="club">Club</option>
            </select>
          </label>

          {category === "course" && (
            <label style={{ display: "block", marginBottom: 8 }}>
              <span>Course code (optional)</span>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 4,
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                }}
                placeholder="e.g., CSE470"
              />
            </label>
          )}

          <label style={{ display: "block", marginBottom: 8 }}>
            <span>Body</span>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{
                width: "100%",
                marginTop: 4,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                resize: "vertical",
              }}
              placeholder="Describe your question or topic in detail..."
            />
          </label>

          <button
            type="submit"
            className="clubs-back-btn"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Creating..." : "Create discussion"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussionPage;
