const EventCalendar = () => {
  const events = [
    {
      id: 1,
      title: "Career Fair",
      date: "10 October",
      icon: "🎓",
      type: "Academic",
    },
    {
      id: 2,
      title: "Club Fest",
      date: "15 October",
      icon: "🎉",
      type: "Campus",
    },
    {
      id: 3,
      title: "Hackathon",
      date: "20 October",
      icon: "💻",
      type: "Tech",
    },
  ];

  return (
    <section className="dashboard-content-card feature-page">
      {/* Header */}
      <div className="feature-header">
        <h2 className="feature-title">Event Calendar</h2>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="feature-empty">
          No upcoming events.
        </div>
      )}

      {/* Event cards */}
      {events.map((event) => (
        <div key={event.id} className="feature-card">
          <div>
            <h4 style={{ margin: 0 }}>
              {event.icon} {event.title}
            </h4>

            <p style={{ margin: "6px 0", color: "#6b7280" }}>
              📅 {event.date}
            </p>

            <span className="feature-badge">
              {event.type}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default EventCalendar;
