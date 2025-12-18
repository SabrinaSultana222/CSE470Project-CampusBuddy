import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClassSchedule = () => {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);

  const [course, setCourse] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    fetch("http://localhost:5001/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => setUser(data));
  }, [navigate]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("classSchedule");
    if (saved) {
      setClasses(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("classSchedule", JSON.stringify(classes));
  }, [classes]);

  const addClass = () => {
    if (!course || !day || !time) return;

    setClasses([
      ...classes,
      {
        id: Date.now(),
        course,
        day,
        time,
      },
    ]);

    setCourse("");
    setDay("");
    setTime("");
  };

  const deleteClass = (id) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  if (!user) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <section className="dashboard-content-card feature-page">
      {/* Header */}
      <div className="feature-header">
        <h2 className="feature-title">Class Schedule</h2>
      </div>

      {/* Add class */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          className="form-control"
          placeholder="Course name"
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
          className="form-control"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button
          className="btn-primary"
          style={{ width: "auto" }}
          onClick={addClass}
        >
          Add
        </button>
      </div>

      {/* Empty state */}
      {classes.length === 0 && (
        <div className="feature-empty">
          No classes added yet.
        </div>
      )}

      {/* Class cards */}
      {classes.map((c) => (
        <div key={c.id} className="feature-card">
          <div>
            <h4 style={{ margin: 0 }}>{c.course}</h4>
            <p style={{ margin: "4px 0", color: "#6b7280" }}>
              {c.day} · {c.time}
            </p>
          </div>

          <button
            className="btn-danger"
            style={{ marginTop: 8 }}
            onClick={() => deleteClass(c.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </section>
  );
};

export default ClassSchedule;
