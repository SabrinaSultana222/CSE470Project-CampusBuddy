import { useEffect, useState } from "react";

function Notifications() {
  const [role, setRole] = useState("TEACHER"); // TEACHER or STUDENT
  const [text, setText] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [notifications, setNotifications] = useState([]);

  // 🔁 Auto-remove expired notifications every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setNotifications((prev) =>
        prev.filter((n) => new Date(n.dateTime) > now)
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = () => {
    if (!text || !dateTime) return;

    setNotifications([
      ...notifications,
      {
        id: Date.now(),
        text,
        dateTime,
      },
    ]);

    setText("");
    setDateTime("");
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const now = new Date();

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Notifications & Reminders 🔔</h2>
      <p>Important announcements for students.</p>

      <p>
        <strong>Current Role:</strong> {role}
      </p>

      <button
        onClick={() =>
          setRole(role === "TEACHER" ? "STUDENT" : "TEACHER")
        }
      >
        Switch to {role === "TEACHER" ? "Student" : "Teacher"}
      </button>

      <hr />

      {role === "TEACHER" && (
        <>
          <h3>Add New Notification</h3>

          <input
            type="text"
            placeholder="Notification text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <br /><br />

          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
          <br /><br />

          <button onClick={addNotification}>Add Notification</button>

          <hr />
        </>
      )}

      <ul>
        {notifications.length === 0 && <p>No active notifications.</p>}

        {notifications.map((n) => {
          const isExpired = new Date(n.dateTime) <= now;

          return (
            <li key={n.id} style={{ marginBottom: "20px" }}>
              <strong>{n.text}</strong>
              <br />
              ⏰ {new Date(n.dateTime).toLocaleString()}
              <br />

              <span
                style={{
                  color: isExpired ? "red" : "green",
                  fontWeight: "bold",
                }}
              >
                {isExpired ? "Expired" : "Upcoming"}
              </span>

              {role === "TEACHER" && (
                <>
                  <br />
                  <button onClick={() => deleteNotification(n.id)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Notifications;
