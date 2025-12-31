import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NewDiscussionPage = () => {
  const { theme } = useTheme();
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
    <div style={{
      minHeight: '100vh',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #e0f2fe 100%)',
      padding: '2rem 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 5%' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
          marginBottom: '3rem', backdropFilter: 'blur(20px)',
          background: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.9)',
          padding: '2.5rem', borderRadius: '24px', 
          border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)',
          boxShadow: theme === 'dark' ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: '900', 
              color: theme === 'dark' ? '#60a5fa' : '#1e40af',
              textShadow: theme === 'dark' ? '0 0 20px rgba(96,165,250,0.5)' : '0 0 20px rgba(30,64,175,0.3)',
              margin: 0, lineHeight: 1.2
            }}>New Discussion</h1>
            <p style={{
              fontSize: '1.2rem', color: theme === 'dark' ? '#e2e8f0' : '#64748b',
              margin: '1rem 0 0 0', lineHeight: 1.6
            }}>
              Start a topic for your course, club, or general questions.
            </p>
          </div>
          <button
            onClick={() => navigate("/discussions")}
            style={{
              padding: '0.75rem 2rem', background: 'transparent',
              color: theme === 'dark' ? '#e2e8f0' : '#475569', 
              border: '2px solid', 
              borderColor: theme === 'dark' ? 'rgba(226,232,240,0.6)' : 'rgba(71,85,105,0.4)',
              borderRadius: '2rem', fontWeight: '600', fontSize: '0.95rem', 
              cursor: 'pointer', backdropFilter: 'blur(20px)', 
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme === 'dark' ? 'rgba(226,232,240,0.2)' : 'rgba(71,85,105,0.1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ← Back to discussions
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          backdropFilter: 'blur(20px)',
          background: theme === 'dark' ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.9)',
          padding: '3rem', borderRadius: '24px', 
          border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)',
          boxShadow: theme === 'dark' ? '0 25px 50px rgba(0,0,0,0.4)' : '0 25px 50px rgba(0,0,0,0.1)'
        }}>
          {error && (
            <div style={{
              marginBottom: '1.5rem', padding: '1rem 1.5rem',
              background: 'rgba(239,68,68,0.15)', color: '#ef4444', 
              borderRadius: '16px', border: '1px solid rgba(239,68,68,0.3)',
              fontSize: '0.95rem'
            }}>
              {error}
            </div>
          )}

          {/* Title */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block', fontSize: '1rem', fontWeight: '600', 
              color: theme === 'dark' ? '#f8fafc' : '#1e293b', marginBottom: '0.75rem'
            }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%', padding: '1.25rem', borderRadius: '20px',
                border: 'none', fontSize: '1.1rem', outline: 'none',
                background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(248,250,252,0.9)',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b',
                backdropFilter: 'blur(20px)',
                boxShadow: theme === 'dark' ? 'inset 0 2px 10px rgba(0,0,0,0.3)' : 'inset 0 2px 10px rgba(0,0,0,0.1)'
              }}
              placeholder="e.g., Confused about Assignment 3 requirements"
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block', fontSize: '1rem', fontWeight: '600', 
              color: theme === 'dark' ? '#f8fafc' : '#1e293b', marginBottom: '0.75rem'
            }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%', padding: '1.25rem', borderRadius: '20px',
                border: 'none', fontSize: '1.1rem', outline: 'none',
                background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(248,250,252,0.9)',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b',
                backdropFilter: 'blur(20px)', cursor: 'pointer',
                boxShadow: theme === 'dark' ? 'inset 0 2px 10px rgba(0,0,0,0.3)' : 'inset 0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <option value="general">General</option>
              <option value="course">Course</option>
              <option value="club">Club</option>
            </select>
          </div>

          {/* Course Code */}
          {category === "course" && (
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block', fontSize: '1rem', fontWeight: '600', 
                color: theme === 'dark' ? '#f8fafc' : '#1e293b', marginBottom: '0.75rem'
              }}>
                Course code (optional)
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                style={{
                  width: '100%', padding: '1.25rem', borderRadius: '20px',
                  border: 'none', fontSize: '1.1rem', outline: 'none',
                  background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(248,250,252,0.9)',
                  color: theme === 'dark' ? '#f8fafc' : '#1e293b',
                  backdropFilter: 'blur(20px)',
                  boxShadow: theme === 'dark' ? 'inset 0 2px 10px rgba(0,0,0,0.3)' : 'inset 0 2px 10px rgba(0,0,0,0.1)'
                }}
                placeholder="e.g., CSE470"
              />
            </div>
          )}

          {/* Body */}
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{
              display: 'block', fontSize: '1rem', fontWeight: '600', 
              color: theme === 'dark' ? '#f8fafc' : '#1e293b', marginBottom: '0.75rem'
            }}>
              Body
            </label>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{
                width: '100%', padding: '1.25rem', borderRadius: '20px',
                border: 'none', fontSize: '1.1rem', outline: 'none', resize: 'vertical',
                background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(248,250,252,0.9)',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b',
                backdropFilter: 'blur(20px)',
                boxShadow: theme === 'dark' ? 'inset 0 2px 10px rgba(0,0,0,0.3)' : 'inset 0 2px 10px rgba(0,0,0,0.1)'
              }}
              placeholder="Describe your question or topic in detail..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim() || !body.trim()}
            style={{
              width: '100%', padding: '1.25rem', 
              background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
              color: 'white', border: 'none', borderRadius: '20px', 
              fontSize: '1.1rem', fontWeight: '700', cursor: loading || !title.trim() || !body.trim() ? 'not-allowed' : 'pointer',
              boxShadow: '0 15px 35px rgba(59,130,246,0.4)', 
              transition: 'all 0.3s ease', opacity: loading || !title.trim() || !body.trim() ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading && title.trim() && body.trim()) {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 25px 50px rgba(59,130,246,0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 15px 35px rgba(59,130,246,0.4)';
            }}
          >
            {loading ? "Creating..." : "Create discussion"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussionPage;
