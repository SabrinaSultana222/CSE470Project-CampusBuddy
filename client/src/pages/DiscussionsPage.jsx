import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const DiscussionsPage = () => {
  const { theme, toggleTheme } = useTheme();
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
    <div className="discussions-root" style={{
      minHeight: '100vh',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #e0f2fe 100%)',
      padding: '2rem 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div className="discussions-container" style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 5%'
      }}>
        {/* Header with Theme Toggle */}
        <div className="discussions-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
          marginBottom: '3rem', backdropFilter: 'blur(20px)',
          background: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.9)',
          padding: '2rem', borderRadius: '24px', 
          border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)',
          boxShadow: theme === 'dark' ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}>
          <div>
            {/* ✅ FIXED: Solid color + glow instead of gradient text */}
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: '900',
              color: theme === 'dark' ? '#60a5fa' : '#1e40af',
              textShadow: theme === 'dark' 
                ? '0 0 20px rgba(96, 165, 250, 0.6)' 
                : '0 0 20px rgba(30, 64, 175, 0.4)',
              margin: 0, lineHeight: 1.2
            }}>Discussions</h1>
            <p style={{
              fontSize: '1rem', color: theme === 'dark' ? '#e2e8f0' : '#64748b',
              margin: '1rem 0 0 0', lineHeight: 1.6
            }}>
              Ask questions and discuss courses, clubs, and campus life.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: '0.75rem 2rem', background: 'transparent',
                color: theme === 'dark' ? '#e2e8f0' : '#475569', 
                border: '2px solid', 
                borderColor: theme === 'dark' ? 'rgba(226,232,240,0.6)' : 'rgba(71,85,105,0.4)',
                borderRadius: '2rem', fontWeight: '600', fontSize: '0.9rem',
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
              ← Back to dashboard
            </button>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                padding: '0.75rem 1.5rem',
                background: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(30,41,59,0.15)',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b', 
                border: '2px solid',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(30,41,59,0.4)',
                borderRadius: '2rem', fontWeight: '600', fontSize: '0.9rem',
                cursor: 'pointer', backdropFilter: 'blur(20px)', 
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(30,41,59,0.25)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(30,41,59,0.15)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {theme === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex', gap: '1.5rem', alignItems: 'center', 
          flexWrap: 'wrap', marginBottom: '2.5rem',
          backdropFilter: 'blur(20px)',
          background: theme === 'dark' ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.8)',
          padding: '1.5rem 2rem', borderRadius: '20px', 
          border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)'
        }}>
          <div style={{
            position: 'relative', flex: 1, minWidth: '250px',
            backdropFilter: 'blur(20px)'
          }}>
            <input
              type="text"
              placeholder="Search discussions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '16px',
                border: 'none', fontSize: '0.95rem', outline: 'none',
                background: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.95)',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b',
                boxShadow: theme === 'dark' ? '0 10px 25px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <span style={{ 
              position: 'absolute', left: '1rem', top: '50%', 
              transform: 'translateY(-50%)', color: '#94a3b8' 
            }}>🔍</span>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '1rem 1.5rem', borderRadius: '16px', border: 'none', 
              fontSize: '0.95rem', background: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.95)',
              color: theme === 'dark' ? '#f8fafc' : '#1e293b',
              backdropFilter: 'blur(20px)', cursor: 'pointer',
              boxShadow: theme === 'dark' ? '0 10px 25px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <option value="all">All Categories</option>
            <option value="course">Courses</option>
            <option value="club">Clubs</option>
            <option value="general">General</option>
          </select>
          <button
            onClick={() => navigate("/discussions/new")}
            style={{
              padding: '1rem 2.5rem', 
              background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
              color: 'white', border: 'none', borderRadius: '20px', 
              fontSize: '0.95rem', fontWeight: '700',
              cursor: 'pointer', boxShadow: '0 10px 30px rgba(59,130,246,0.4)', 
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 20px 40px rgba(59,130,246,0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(59,130,246,0.4)';
            }}
          >
            + New Discussion
          </button>
        </div>

        {/* States */}
        {loading && (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            backdropFilter: 'blur(20px)', 
            background: theme === 'dark' ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.8)',
            borderRadius: '24px', margin: '2rem 0'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <p style={{ fontSize: '1rem', color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
              Loading discussions...
            </p>
          </div>
        )}
        {error && !loading && (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            backdropFilter: 'blur(20px)', 
            background: theme === 'dark' ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.8)',
            borderRadius: '24px', margin: '2rem 0', 
            color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)'
          }}>
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '6rem 2rem',
            backdropFilter: 'blur(20px)', 
            background: theme === 'dark' ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.8)',
            borderRadius: '24px', margin: '2rem 0'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>💬</div>
            <h3 style={{ 
              fontSize: '1.25rem', color: theme === 'dark' ? '#f8fafc' : '#1e293b', 
              margin: '0 0 1rem 0' 
            }}>No discussions yet</h3>
            <p style={{ 
              fontSize: '1rem', color: theme === 'dark' ? '#94a3b8' : '#64748b' 
            }}>
              Start the first one!
            </p>
          </div>
        )}

        {/* Posts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filtered.map((post) => (
            <article
              key={post._id}
              onClick={() => navigate(`/discussions/${post._id}`)}
              style={{
                cursor: 'pointer',
                backdropFilter: 'blur(20px)',
                background: theme === 'dark' ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.9)',
                padding: '2rem', 
                borderRadius: '24px', 
                border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease', 
                boxShadow: theme === 'dark' ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = theme === 'dark' ? '0 30px 60px rgba(0,0,0,0.5)' : '0 30px 60px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme === 'dark' ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', 
                alignItems: 'center', marginBottom: '1.5rem' 
              }}>
                <span style={{
                  background: theme === 'dark' ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.15)',
                  color: theme === 'dark' ? '#93c5fd' : '#2563eb', 
                  padding: '0.5rem 1.25rem',
                  borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                  backdropFilter: 'blur(10px)'
                }}>
                  {post.category === "course"
                    ? post.courseCode || "Course"
                    : post.category === "club"
                    ? "Club"
                    : "General"}
                </span>
                <span style={{
                  background: theme === 'dark' ? 'rgba(96,165,250,0.2)' : 'rgba(30,64,175,0.1)',
                  color: theme === 'dark' ? '#60a5fa' : '#1e40af', 
                  padding: '0.4rem 1rem',
                  borderRadius: '16px', fontSize: '0.75rem', fontWeight: '600'
                }}>
                  {post.author?.role || "Student"}
                </span>
              </div>
              <h2 style={{
                fontSize: '1.25rem', fontWeight: '800', 
                color: theme === 'dark' ? '#f8fafc' : '#1e293b',
                margin: '0 0 1rem 0', lineHeight: 1.3
              }}>{post.title}</h2>
              <p style={{
                color: theme === 'dark' ? '#cbd5e1' : '#64748b', 
                lineHeight: 1.7, margin: 0,
                fontSize: '0.95rem'
              }}>
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
