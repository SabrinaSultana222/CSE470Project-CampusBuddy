import React, { useEffect, useState } from "react";

const STORAGE_KEY = "campusBuddyEvents";

const FacultyEventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Meeting");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setEvents(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (!title || !date) return;

    setEvents([
      ...events,
      { id: Date.now(), title, date, type },
    ]);

    setTitle("");
    setDate("");
    setType("Meeting");
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <section className="dashboard-content-card">
      <h2>📅 Faculty Event Calendar</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Meeting</option>
          <option>Seminar</option>
          <option>Academic</option>
          <option>Workshop</option>
        </select>

        <button type="button" onClick={addEvent}>
          Add Event
        </button>
      </div>

      {events.length === 0 ? (
        <p>No events scheduled.</p>
      ) : (
        events.map((e) => (
          <div key={e.id}>
            {e.title} — {e.date}
            <button onClick={() => deleteEvent(e.id)}>Delete</button>
          </div>
        ))
      )}
    </section>
  );
};

export default FacultyEventCalendar;
