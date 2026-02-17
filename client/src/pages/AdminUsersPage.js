import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const roleFilter =
    location.pathname.endsWith("/students")
      ? "student"
      : location.pathname.endsWith("/faculty")
      ? "faculty"
      : "";

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5001/api/admin/users${
          roleFilter ? `?role=${roleFilter}` : ""
        }`,
        { credentials: "include" }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setLoading(false);
        setToast(data.message || "Failed to load users");
        return;
      }

      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch {
      setLoading(false);
      setToast("Network error loading users");
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.isActive;
    const question = newStatus
      ? `Are you sure you want to activate ${user.name}?`
      : `Are you sure you want to deactivate ${user.name}?`;

    if (!window.confirm(question)) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/admin/users/${user._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isActive: newStatus }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to update status");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isActive: newStatus } : u
        )
      );
      showToast(data.message);
    } catch {
      showToast("Network error updating status");
    }
  };

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${user.name}?`
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/admin/users/${user._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to delete user");
        return;
      }

      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      showToast(data.message);
    } catch {
      showToast("Network error deleting user");
    }
  };

  const handleViewDetails = (user) => {
    navigate(`/admin/users/${user._id}`);
  };

  const handleToggleClubAdmin = async (user, makeClubAdmin) => {
    if (user.role === "faculty") {
      showToast("Faculty cannot be assigned club admin here");
      return;
    }

    if (user.role !== "student") {
      showToast("Only students can be promoted to club admin");
      return;
    }

    if (user.isClubAdmin === makeClubAdmin) return;

    const question = makeClubAdmin
      ? `Promote ${user.name} to student + club admin?`
      : `Remove club admin privileges from ${user.name}?`;

    if (!window.confirm(question)) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/admin/users/${user._id}/role`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isClubAdmin: makeClubAdmin }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to update club admin flag");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isClubAdmin: makeClubAdmin } : u
        )
      );
      showToast(data.message || "Club admin flag updated");
    } catch {
      showToast("Network error updating club admin flag");
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
    <div className="admin-users-root" style={{
      minHeight: '100vh',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #e0f2fe 100%)',
      padding: '2rem 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div className="admin-users-container" style={{
        maxWidth: '1400px', margin: '0 auto', padding: '0 5%'
      }}>
        {/* Header with Back + Theme Toggle + Logout */}
        <div className="admin-users-header" style={{
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
            }}>User Management</h1>
            {roleFilter === "student" && (
              <p style={{
                fontSize: '1rem', color: theme === 'dark' ? '#e2e8f0' : '#64748b',
                margin: '1rem 0 0 0', lineHeight: 1.6
              }}>Viewing all students.</p>
            )}
            {roleFilter === "faculty" && (
              <p style={{
                fontSize: '1rem', color: theme === 'dark' ? '#e2e8f0' : '#64748b',
                margin: '1rem 0 0 0', lineHeight: 1.6
              }}>Viewing all faculty.</p>
            )}
            {!roleFilter && (
              <p style={{
                fontSize: '1rem', color: theme === 'dark' ? '#e2e8f0' : '#64748b',
                margin: '1rem 0 0 0', lineHeight: 1.6
              }}>Viewing all users.</p>
            )}
          </div>
          
          {/* ✅ THREE BUTTONS: Back + Theme Toggle + Logout */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Back to Admin Dashboard Button */}
            <button
              onClick={() => navigate("/admin")}
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
              ← Back to Dashboard
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

        {/* Toast Message */}
        {toast && (
          <div style={{
            textAlign: 'center', padding: '1rem 2rem',
            backdropFilter: 'blur(20px)', 
            background: theme === 'dark' ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)',
            borderRadius: '16px', marginBottom: '2rem', 
            color: '#ef4444', border: `1px solid ${theme === 'dark' ? 'rgba(239,68,68,0.4)' : 'rgba(239,68,68,0.2)'}`,
            maxWidth: '500px', margin: '0 auto 2rem auto'
          }}>
            {toast}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div style={{
            textAlign: 'center', padding: '6rem 2rem',
            backdropFilter: 'blur(20px)', 
            background: theme === 'dark' ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.8)',
            borderRadius: '24px', margin: '2rem 0'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>👥</div>
            <h3 style={{ 
              fontSize: '1.25rem', color: theme === 'dark' ? '#f8fafc' : '#1e293b', 
              margin: '0 0 1rem 0' 
            }}>Loading users...</h3>
          </div>
        ) : users.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '6rem 2rem',
            backdropFilter: 'blur(20px)', 
            background: theme === 'dark' ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.8)',
            borderRadius: '24px', margin: '2rem 0'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>👥</div>
            <h3 style={{ 
              fontSize: '1.25rem', color: theme === 'dark' ? '#f8fafc' : '#1e293b', 
              margin: '0 0 1rem 0' 
            }}>No users found</h3>
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
                      }}>Name</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>BRACU ID</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Email</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Role</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Club Admin</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Status</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Club Admin Actions</th>
                      <th style={{
                        padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '700',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} style={{
                        borderBottom: theme === 'dark' ? '1px solid rgba(148,163,184,0.1)' : '1px solid rgba(0,0,0,0.04)',
                        transition: 'all 0.2s ease'
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
                          fontWeight: '600'
                        }}>{u.name}</td>
                        <td style={{
                          padding: '1.5rem 1rem', color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                          fontWeight: '500'
                        }}>{u.bracuId}</td>
                        <td style={{
                          padding: '1.5rem 1rem', color: theme === 'dark' ? '#cbd5e1' : '#64748b'
                        }}>{u.email}</td>
                        <td>
                          <span style={{
                            padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', 
                            fontWeight: '600',
                            background: u.role === 'student' 
                              ? 'rgba(59,130,246,0.2)' 
                              : u.role === 'faculty'
                              ? 'rgba(34,197,94,0.2)' 
                              : 'rgba(245,158,11,0.2)',
                            color: u.role === 'student' 
                              ? '#60a5fa' 
                              : u.role === 'faculty'
                              ? '#4ade80' 
                              : '#f59e0b',
                            backdropFilter: 'blur(10px)'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', 
                            fontWeight: '600',
                            background: u.isClubAdmin 
                              ? 'rgba(34,197,94,0.2)' 
                              : 'rgba(148,163,184,0.2)',
                            color: u.isClubAdmin ? '#4ade80' : '#94a3b8',
                            backdropFilter: 'blur(10px)'
                          }}>
                            {u.isClubAdmin ? "Yes" : "No"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            style={{
                              padding: '0.5rem 1.25rem', 
                              background: u.isActive 
                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                : 'linear-gradient(135deg, #6b7280, #4b5563)',
                              color: 'white', border: 'none', borderRadius: '12px', 
                              fontSize: '0.8rem', fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-1px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(16,185,129,0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(16,185,129,0.3)';
                            }}
                            onClick={() => handleToggleStatus(u)}
                          >
                            {u.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td style={{ padding: '1.5rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              style={{
                                padding: '0.5rem 1rem', 
                                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                color: 'white', border: 'none', borderRadius: '12px', 
                                fontSize: '0.75rem', fontWeight: '600',
                                cursor: u.role !== "student" ? 'not-allowed' : 'pointer',
                                opacity: u.role !== "student" ? 0.5 : 1
                              }}
                              onClick={() => handleToggleClubAdmin(u, true)}
                              disabled={u.role !== "student"}
                            >
                              Make Club Admin
                            </button>
                            <button
                              type="button"
                              style={{
                                padding: '0.5rem 1rem', 
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: 'white', border: 'none', borderRadius: '12px', 
                                fontSize: '0.75rem', fontWeight: '600',
                                cursor: u.role !== "student" ? 'not-allowed' : 'pointer',
                                opacity: u.role !== "student" ? 0.5 : 1
                              }}
                              onClick={() => handleToggleClubAdmin(u, false)}
                              disabled={u.role !== "student"}
                            >
                              ❌ Remove
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              style={{
                                padding: '0.5rem 1rem', 
                                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                color: 'white', border: 'none', borderRadius: '12px', 
                                fontSize: '0.75rem', fontWeight: '600',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(59,130,246,0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(59,130,246,0.3)';
                              }}
                              onClick={() => handleViewDetails(u)}
                            >
                              👁️ View
                            </button>
                            <button
                              type="button"
                              style={{
                                padding: '0.5rem 1rem', 
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: 'white', border: 'none', borderRadius: '12px', 
                                fontSize: '0.75rem', fontWeight: '600',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(239,68,68,0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(239,68,68,0.3)';
                              }}
                              onClick={() => handleDelete(u)}
                            >
                              🗑️ Delete
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

export default AdminUsersPage;
