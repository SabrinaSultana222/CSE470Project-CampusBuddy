import React, { useEffect, useState } from "react";

const STORAGE_KEY = "facultyClasses";

const FacultyClassSchedule = () => {
  const [course, setCourse] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const [classes, setClasses] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  }, [classes]);

  const addClass = () => {
    if (!course || !day || !time) {
      setError("Please enter course name, day, and time.");
      return;
    }

    setClasses((prev) =>
      [...prev, { id: Date.now(), course, day, time }]
        .sort((a, b) => {
          const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
          ];
          if (a.day !== b.day) {
            return days.indexOf(a.day) - days.indexOf(b.day);
          }
          return a.time.localeCompare(b.time);
        })
    );

    setCourse("");
    setDay("");
    setTime("");
    setError("");
  };

  const deleteClass = (id) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  return (
    <section className="dashboard-content-card" style={{ maxWidth: 900 }}>
      <h2>📚 Faculty Class Schedule</h2>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Manage your assigned courses and teaching schedule.
      </p>

      {/* ADD CLASS FORM */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr auto",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <input
          className="form-control"
          placeholder="Course name (e.g. CSE470)"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <select
          className="form-select"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        >
          <option value="">Select day</option>
          <option>Sunday</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
        </select>

        <input
          type="time"
          className="form-control"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button
          onClick={addClass}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: 500,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          + Add
        </button>
      </div>

      {error && (
        <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 12 }}>
          {error}
        </p>
      )}

      {/* CLASS LIST */}
      {classes.length === 0 ? (
        <div className="empty-widgets-box">
          📭 No classes assigned yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {classes.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 18px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#ffffff",
              }}
            >
              <div>
                <strong style={{ fontSize: 15 }}>{c.course}</strong>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  {c.day} · {c.time}
                </div>
              </div>

              <button
                onClick={() => deleteClass(c.id)}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FacultyClassSchedule;
