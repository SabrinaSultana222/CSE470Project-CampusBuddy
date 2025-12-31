import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const AdminClubPostsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/admin/club-posts${
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
        `http://localhost:5001/api/admin/club-posts/${postId}/status`,
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

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="admin-club-posts-root" style={{
      minHeight: '100vh',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #e0f2fe 100%)',
      padding: '2rem 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div className="admin-club-posts-container" style={{
        maxWidth: '1400px', margin: '0 auto', padding: '0 5%'
      }}>
        {/* Header with Controls - FIXED BACK BUTTON */}
        <div className="admin-club-posts-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
          marginBottom: '3rem', backdropFilter: 'blur(20px)',
          background: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.9)',
          padding: '2rem', borderRadius: '24px', 
          border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)',
          boxShadow: theme === 'dark' ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: '900',
              color: theme === 'dark' ? '#60a5fa' : '#1e40af',
              textShadow: theme === 'dark' 
                ? '0 0 20px rgba(96, 165, 250, 0.6)' 
                : '0 0 20px rgba(30, 64, 175, 0.4)',
              margin: 0, lineHeight: 1.2
            }}>Club Posts Moderation</h1>
            <p style={{
              fontSize: '1rem', color: theme === 'dark' ? '#e2e8f0' : '#64748b',
              margin: '1rem 0 0 0', lineHeight: 1.6
            }}>
              Review and manage <strong>{statusFilter || "all"}</strong> club posts submitted by club admins.
            </p>
          </div>
          
          {/* ✅ THREE BUTTONS SIDE BY SIDE - BACK TO ADMIN USERS PAGE */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* ✅ FIXED: Back to Admin Users Page */}
            <button
              onClick={() => navigate("/admin/users")}
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
              ← Back to Admin Panel
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

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '2rem', 
                fontWeight: '600', 
                fontSize: '0.9rem',
                cursor: 'pointer', 
                backdropFilter: 'blur(20px)', 
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px rgba(239,68,68,0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(239,68,68,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px rgba(239,68,68,0.4)';
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Status Filter - Styled like discussionpage.js filters */}
        <div style={{
          display: 'flex', gap: '1.5rem', alignItems: 'center', 
          flexWrap: 'wrap', marginBottom: '2.5rem',
          backdropFilter: 'blur(20px)',
          background: theme === 'dark' ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.8)',
          padding: '1.5rem 2rem', borderRadius: '20px', 
          border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            color: theme === 'dark' ? '#e2e8f0' : '#475569',
            fontWeight: '600', fontSize: '0.95rem'
          }}>
            Status filter:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '1rem 1.5rem', borderRadius: '16px', border: 'none', 
              fontSize: '0.95rem', background: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.95)',
              color: theme === 'dark' ? '#f8fafc' : '#1e293b',
              backdropFilter: 'blur(20px)', cursor: 'pointer',
              boxShadow: theme === 'dark' ? '0 10px 25px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </select>
        </div>

        {/* Toast Message */}
        {message && (
          <div style={{
            textAlign: 'center', padding: '1rem 2rem',
            backdropFilter: 'blur(20px)', 
            background: theme === 'dark' ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)',
            borderRadius: '16px', marginBottom: '2rem', 
            color: '#ef4444', border: `1px solid ${theme === 'dark' ? 'rgba(239,68,68,0.4)' : 'rgba(239,68,68,0.2)'}`,
            maxWidth: '500px', margin: '0 auto 2rem auto'
          }}>
            {message}
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '6rem 2rem',
            backdropFilter: 'blur(20px)', 
            background: theme === 'dark' ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.8)',
            borderRadius: '24px', margin: '2rem 0'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🏠</div>
            <h3 style={{ 
              fontSize: '1.25rem', color: theme === 'dark' ? '#f8fafc' : '#1e293b', 
              margin: '0 0 1rem 0' 
            }}>No club posts found</h3>
            <p style={{ 
              fontSize: '1rem', color: theme === 'dark' ? '#94a3b8' : '#64748b' 
            }}>
              Change the status filter or wait for new submissions.
            </p>
          </div>
        ) : (
          /* Admin Table - Fully Styled with Theme */
          <div style={{
            backdropFilter: 'blur(20px)',
            background: theme === 'dark' ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.9)',
            borderRadius: '24px', 
            border: theme === 'dark' ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(0,0,0,0.05)',
            overflow: 'hidden',
            boxShadow: theme === 'dark' ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ padding: '2rem' }}>
              <div style={{ 
                overflowX: 'auto', 
                borderRadius: '20px',
                boxShadow: theme === 'dark' ? 'inset 0 2px 10px rgba(0,0,0,0.3)' : 'inset 0 1px 4px rgba(0,0,0,0.05)'
              }}>
                <table style={{
                  width: '100%', borderCollapse: 'collapse',
                  background: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.95)',
                  borderRadius: '20px', overflow: 'hidden'
                }}>
                  <thead>
                    <tr style={{
                      background: theme === 'dark' ? 'rgba(15,23,42,0.9)' : 'rgba(248,250,252,0.9)',
                      borderBottom: theme === 'dark' ? '2px solid rgba(148,163,184,0.3)' : '2px solid rgba(0,0,0,0.08)'
                    }}>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Title</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Club</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Created by</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Event date</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Status</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Submitted at</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((p) => (
                      <tr key={p._id} style={{
                        borderBottom: theme === 'dark' ? '1px solid rgba(148,163,184,0.1)' : '1px solid rgba(0,0,0,0.04)',
                        transition: 'all 0.2s ease',
                        cursor: 'default'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme === 'dark' ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                      >
                        <td style={{
                          padding: '1.5rem 1rem', color: theme === 'dark' ? '#f8fafc' : '#1e293b',
                          fontWeight: '600', maxWidth: '300px'
                        }}>{p.title}</td>
                        <td style={{
                          padding: '1.5rem 1rem', color: theme === 'dark' ? '#cbd5e1' : '#64748b'
                        }}>{p.clubName}</td>
                        <td style={{
                          padding: '1.5rem 1rem', color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                          fontSize: '0.9rem'
                        }}>
                          {p.createdBy
                            ? `${p.createdBy.name} (${p.createdBy.email})`
                            : "Unknown"}
                        </td>
                        <td style={{
                          padding: '1.5rem 1rem', color: theme === 'dark' ? '#94a3b8' : '#64748b'
                        }}>
                          {p.eventDate
                            ? new Date(p.eventDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          <span style={{
                            padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', 
                            fontWeight: '600',
                            background: p.status === 'approved' 
                              ? 'rgba(34,197,94,0.2)' 
                              : p.status === 'rejected' 
                              ? 'rgba(239,68,68,0.2)' 
                              : 'rgba(245,158,11,0.2)',
                            color: p.status === 'approved' 
                              ? '#4ade80' 
                              : p.status === 'rejected' 
                              ? '#f87171' 
                              : '#f59e0b',
                            backdropFilter: 'blur(10px)'
                          }}>
                            {p.status || 'pending'}
                          </span>
                        </td>
                        <td style={{
                          padding: '1.5rem 1rem', color: theme === 'dark' ? '#94a3b8' : '#64748b',
                          fontSize: '0.85rem'
                        }}>
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleString()
                            : "-"}
                        </td>
                        <td style={{ padding: '1.5rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              style={{
                                padding: '0.5rem 1.25rem', 
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white', border: 'none', borderRadius: '12px', 
                                fontSize: '0.8rem', fontWeight: '600',
                                cursor: p.status === "approved" ? 'not-allowed' : 'pointer', 
                                opacity: p.status === "approved" ? 0.5 : 1,
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
                              }}
                              onMouseEnter={(e) => {
                                if (p.status !== "approved") {
                                  e.target.style.transform = 'translateY(-1px)';
                                  e.target.style.boxShadow = '0 4px 12px rgba(16,185,129,0.4)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(16,185,129,0.3)';
                              }}
                              onClick={() => handleUpdateStatus(p._id, "approved")}
                              disabled={p.status === "approved"}
                            >
                              ✅ Approve
                            </button>
                            <button
                              type="button"
                              style={{
                                padding: '0.5rem 1.25rem', 
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: 'white', border: 'none', borderRadius: '12px', 
                                fontSize: '0.8rem', fontWeight: '600',
                                cursor: p.status === "rejected" ? 'not-allowed' : 'pointer', 
                                opacity: p.status === "rejected" ? 0.5 : 1,
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(239,68,68,0.3)'
                              }}
                              onMouseEnter={(e) => {
                                if (p.status !== "rejected") {
                                  e.target.style.transform = 'translateY(-1px)';
                                  e.target.style.boxShadow = '0 4px 12px rgba(239,68,68,0.4)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(239,68,68,0.3)';
                              }}
                              onClick={() => handleUpdateStatus(p._id, "rejected")}
                              disabled={p.status === "rejected"}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClubPostsPage;
