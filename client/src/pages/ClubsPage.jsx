// Updated ClubsPage.jsx - Theme Toggle + Back Button
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const ClubsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

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
    <div className="clubs-page-root" style={{
      minHeight: '100vh',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 50%, #e3f2fd 100%)',
      color: theme === 'dark' ? '#f8fafc' : '#1e293b',
      padding: '2rem 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
    }}>
      <div className="clubs-page-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div className="clubs-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2.5rem',
          backdropFilter: 'blur(20px)',
          background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.9)',
          padding: '2rem',
          borderRadius: '24px',
          border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)',
          boxShadow: theme === 'dark' ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.08)'
        }}>
          <div>
            <h1 className="clubs-title-main" style={{
              fontSize: '2.125rem',
              fontWeight: '800',
              margin: '0 0 0.5rem 0',
              color: theme === 'dark' ? '#60a5fa' : '#0369a1',
              textShadow: theme === 'dark' ? '0 0 20px rgba(96,165,250,0.6)' : 'none',
              lineHeight: '1.1'
            }}>Clubs & Events</h1>
            <p className="clubs-subtitle" style={{
              fontSize: '1rem',
              color: theme === 'dark' ? '#e2e8f0' : '#64748b',
              margin: '0',
              fontWeight: '400'
            }}>
              Latest approved club events and announcements for students.
            </p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center',
            marginTop: '0.5rem'
          }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: '0.75rem 2rem',
                background: 'transparent',
                color: theme === 'dark' ? '#e2e8f0' : '#475569', 
                border: '2px solid', 
                borderColor: theme === 'dark' ? 'rgba(226,232,240,0.6)' : 'rgba(71,85,105,0.4)',
                borderRadius: '2rem',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)', 
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
            
            <button
              onClick={toggleTheme}
              style={{
                padding: '0.75rem 1.5rem',
                background: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(30,41,59,0.15)',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b', 
                border: '2px solid',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(30,41,59,0.4)',
                borderRadius: '2rem',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)', 
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

        <div className="clubs-filters" style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2.5rem',
          backdropFilter: 'blur(20px)',
          background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.9)',
          padding: '1.25rem',
          borderRadius: '20px',
          boxShadow: theme === 'dark' ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.08)',
          border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)'
        }}>
          <input
            type="text"
            placeholder="Search by club or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="clubs-search"
            style={{
              flex: 1,
              padding: '0.875rem 1.25rem',
              border: '2px solid ' + (theme === 'dark' ? 'rgba(148,163,184,0.3)' : '#e2e8f0'),
              borderRadius: '16px',
              fontSize: '0.95rem',
              background: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.8)',
              color: theme === 'dark' ? '#f8fafc' : '#1e293b',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease'
            }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="clubs-select"
            style={{
              flex: 1,
              padding: '0.875rem 1.25rem',
              border: '2px solid ' + (theme === 'dark' ? 'rgba(148,163,184,0.3)' : '#e2e8f0'),
              borderRadius: '16px',
              fontSize: '0.95rem',
              background: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.8)',
              color: theme === 'dark' ? '#f8fafc' : '#1e293b',
              backdropFilter: 'blur(10px)'
            }}
          >
            <option value="all">All</option>
            <option value="event">Events</option>
            <option value="announcement">Announcements</option>
          </select>
        </div>

        {loading && <div className="clubs-state" style={{
          background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          borderRadius: '24px',
          boxShadow: theme === 'dark' ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.08)',
          color: theme === 'dark' ? '#94a3b8' : '#64748b',
          border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)'
        }}>Loading club posts...</div>}
        
        {error && !loading && (
          <div className="clubs-state clubs-state-error" style={{
            background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.9)',
            color: '#dc2626',
            backdropFilter: 'blur(20px)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            borderRadius: '24px',
            boxShadow: theme === 'dark' ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.08)',
            border: '1px solid rgba(220,38,38,0.3)'
          }}>{error}</div>
        )}

        {!loading && !error && filteredPosts.length === 0 && (
          <div className="clubs-state" style={{
            background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            borderRadius: '24px',
            boxShadow: theme === 'dark' ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.08)',
            color: theme === 'dark' ? '#94a3b8' : '#64748b',
            border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)'
          }}>
            <div className="empty-state-emoji" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎈</div>
            <p>No club announcements yet. Check back soon!</p>
          </div>
        )}

        <div className="clubs-list" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.75rem'
        }}>
          {filteredPosts.map((post) => (
            <article key={post._id} className="clubs-card" style={{
              background: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '1.75rem',
              boxShadow: theme === 'dark' ? '0 20px 50px rgba(0,0,0,0.4)' : '0 15px 50px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(255,255,255,0.3)',
              height: '100%'
            }}>
              <div className="clubs-card-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem'
              }}>
                <span className="clubs-club-name" style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: theme === 'dark' ? '#60a5fa' : '#0ea5e9',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>{post.clubName}</span>
                <span className="clubs-chip" style={{
                  padding: '0.375rem 0.875rem',
                  background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: '600'
                }}>
                  {(post.category || "Event").charAt(0).toUpperCase() +
                    (post.category || "Event").slice(1)}
                </span>
              </div>

              <h2 className="clubs-card-title" style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                margin: '0 0 0.875rem 0',
                lineHeight: '1.3',
                color: theme === 'dark' ? '#f8fafc' : '#1e293b'
              }}>{post.title}</h2>
              
              <p className="clubs-card-desc" style={{
                color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                lineHeight: '1.6',
                marginBottom: '1.25rem',
                fontSize: '0.95rem'
              }}>{post.description}</p>

              <div className="clubs-card-meta" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: theme === 'dark' ? '#94a3b8' : '#94a3b8'
              }}>
                {post.eventDate && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📅 {new Date(post.eventDate).toLocaleDateString()}
                  </span>
                )}
                {post.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📍 {post.location}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .clubs-search:focus, .clubs-select:focus {
          outline: none;
          border-color: #60a5fa !important;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.2) !important;
        }
        
        .clubs-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: ${theme === 'dark' ? '0 30px 60px rgba(0,0,0,0.5)' : '0 25px 80px rgba(0,0,0,0.12)'} !important;
        }
        
        @media (max-width: 768px) {
          .clubs-page-container { padding: 0 1rem; }
          .clubs-header { flex-direction: column; gap: 1.5rem; text-align: center; }
          .clubs-filters { flex-direction: column; }
          .clubs-list { grid-template-columns: 1fr; gap: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default ClubsPage;
