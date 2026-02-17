import { useEffect, useState } from "react";
import { getUser } from "../utils/api";

function Notifications({ isFaculty = false }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state for faculty
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  
  const user = getUser();

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/api/notifications");
      
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      
      const data = await response.json();
      setNotifications(data);
      setError("");
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Load notifications on mount and refresh every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add notification (faculty only)
  const addNotification = async () => {
    if (!title.trim() || !message.trim()) {
      setError("Title and message are required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          courseId: courseId.trim() || null,
          courseName: courseName.trim() || null,
          expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          postedBy: user?._id,
          postedByName: user?.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create notification");
      }

      // Reset form
      setTitle("");
      setMessage("");
      setCourseId("");
      setCourseName("");
      setExpiresAt("");
      setError("");
      
      // Refresh notifications
      fetchNotifications();
    } catch (err) {
      console.error("Error creating notification:", err);
      setError("Failed to create notification");
    } finally {
      setLoading(false);
    }
  };

  // Delete notification (faculty only)
  const deleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      const response = await fetch(`http://localhost:5001/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Refresh notifications
      fetchNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification");
    }
  };

  const now = new Date();

  return (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        🔔 Notifications & Reminders
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "20px" }}>
        {isFaculty ? "Post announcements for students" : "Important announcements from faculty"}
      </p>

      {error && (
        <div
          style={{
            padding: "12px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {isFaculty && (
        <>
          <div
            style={{
              padding: "20px",
              background: "rgba(59, 130, 246, 0.05)",
              border: "2px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "12px",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>📝 Create New Announcement</h3>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>
                Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Assignment Due Tomorrow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>
                Message *
              </label>
              <textarea
                placeholder="Enter your announcement message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>
                  Course ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., CSE470"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>
                  Course Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineering"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>
                Expires At
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                }}
              />
            </div>

            <button
              onClick={addNotification}
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: loading ? "#9ca3af" : "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
            >
              {loading ? "Posting..." : "📤 Post Announcement"}
            </button>
          </div>

          <hr style={{ margin: "24px 0", border: "none", borderTop: "1px solid #e5e7eb" }} />
        </>
      )}

      <h3>📋 Active Announcements</h3>

      {loading && notifications.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280" }}>Loading notifications...</p>
      )}

      {!loading && notifications.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280" }}>No active notifications.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {notifications.map((n) => {
          const isExpired = new Date(n.expiresAt) <= now;

          return (
            <div
              key={n._id}
              style={{
                padding: "16px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                background: isExpired ? "#f9fafb" : "#fff",
                opacity: isExpired ? 0.6 : 1,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>
                  {n.title}
                </h4>
                {isFaculty && (
                  <button
                    onClick={() => deleteNotification(n._id)}
                    style={{
                      padding: "4px 12px",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>

              <p style={{ margin: "8px 0", color: "#374151", lineHeight: "1.6" }}>
                {n.message}
              </p>

              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "12px" }}>
                {n.courseName && (
                  <div style={{ marginBottom: "4px" }}>
                    📚 <strong>Course:</strong> {n.courseName} {n.courseId && `(${n.courseId})`}
                  </div>
                )}
                <div style={{ marginBottom: "4px" }}>
                  👤 <strong>Posted by:</strong> {n.postedByName || n.postedBy?.name || "Faculty"}
                </div>
                <div style={{ marginBottom: "4px" }}>
                  📅 <strong>Posted:</strong> {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString()}
                </div>
                <div>
                  ⏰ <strong>Expires:</strong> {new Date(n.expiresAt).toLocaleDateString()} at {new Date(n.expiresAt).toLocaleTimeString()}
                  {" "}
                  <span
                    style={{
                      color: isExpired ? "#ef4444" : "#10b981",
                      fontWeight: "bold",
                      marginLeft: "8px",
                    }}
                  >
                    {isExpired ? "❌ Expired" : "✅ Active"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Notifications;
