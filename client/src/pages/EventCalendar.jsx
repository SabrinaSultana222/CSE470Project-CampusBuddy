import { useState } from "react";

const EventCalendar = () => {
  const events = [
    {
      id: 1,
      title: "Career Fair",
      date: "2024-10-10",
      icon: "🎓",
      type: "Academic",
    },
    {
      id: 2,
      title: "Club Fest",
      date: "2024-10-15",
      icon: "🎉",
      type: "Campus",
    },
    {
      id: 3,
      title: "Hackathon",
      date: "2024-10-20",
      icon: "💻",
      type: "Tech",
    },
  ];

  const [filter, setFilter] = useState("All");

  const filteredEvents =
    filter === "All"
      ? events
      : events.filter((e) => e.type === filter);

  const badgeColor = (type) => {
    switch (type) {
      case "Academic":
        return "#2563eb";
      case "Campus":
        return "#16a34a";
      case "Tech":
        return "#9333ea";
      default:
        return "#6b7280";
    }
  };

  return (
    <section className="dashboard-content-card feature-page">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 6 }}>📅 Event Calendar</h2>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          Stay updated with upcoming campus events.
        </p>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 16 }}>
        <select
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: 220 }}
        >
          <option>All</option>
          <option>Academic</option>
          <option>Campus</option>
          <option>Tech</option>
        </select>
      </div>

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <div
          className="feature-empty"
          style={{
            padding: 20,
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          No events found for this category.
        </div>
      )}

      {/* Event cards */}
      {filteredEvents.map((event) => (
        <div
          key={event.id}
          className="feature-card"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            marginBottom: 12,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <div>
            <h4 style={{ margin: 0 }}>
              {event.icon} {event.title}
            </h4>

            <p style={{ margin: "6px 0", color: "#6b7280" }}>
              📅 {new Date(event.date).toDateString()}
            </p>
          </div>

          <span
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 12,
              color: "white",
              background: badgeColor(event.type),
            }}
          >
            {event.type}
          </span>
        </div>
      ))}
    </section>
  );
};

export default EventCalendar;
