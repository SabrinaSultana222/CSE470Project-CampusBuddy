import React, { useEffect, useState } from "react";

const STORAGE_KEY = "campusBuddyEvents";

const FacultyEventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Meeting");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setEvents(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (!title || !date) {
      setError("Please enter both event title and date.");
      return;
    }

    setEvents((prev) =>
      [...prev, { id: Date.now(), title, date, type }]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    );

    setTitle("");
    setDate("");
    setType("Meeting");
    setError("");
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const badgeColor = (type) => {
    switch (type) {
      case "Workshop":
        return "#2563eb";
      case "Seminar":
        return "#059669";
      case "Academic":
        return "#7c3aed";
      default:
        return "#6b7280";
    }
  };

  return (
    <section className="dashboard-content-card">
      <h2 style={{ marginBottom: 20 }}>📅 Faculty Event Calendar</h2>

      {/* ADD EVENT FORM */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <label>Event Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Meeting</option>
            <option>Seminar</option>
            <option>Academic</option>
            <option>Workshop</option>
          </select>
        </div>

        <button onClick={addEvent}>Add Event</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* EMPTY STATE */}
      {events.length === 0 ? (
        <p style={{ color: "#6b7280" }}>
          📭 No events scheduled yet. Add one above.
        </p>
      ) : (
        events.map((e) => (
          <div
            key={e.id}
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 8,
              marginBottom: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h4 style={{ margin: 0 }}>{e.title}</h4>
              <p style={{ margin: "4px 0", color: "#6b7280" }}>
                {new Date(e.date).toDateString()}
              </p>
              <span
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 12,
                  color: "#fff",
                  background: badgeColor(e.type),
                }}
              >
                {e.type}
              </span>
            </div>

            <button
              style={{ background: "#ef4444", color: "#fff" }}
              onClick={() => deleteEvent(e.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </section>
  );
};

export default FacultyEventCalendar;
