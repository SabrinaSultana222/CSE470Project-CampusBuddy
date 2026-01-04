import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClassSchedule = () => {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);

  const [course, setCourse] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const navigate = useNavigate();

  // 🔐 AUTH CHECK
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

  // 🧠 STORAGE KEY (PER USER)
  const STORAGE_KEY = user
    ? `CAMPUS_BUDDY_CLASSES_${user.id || user._id}`
    : null;

  // 📥 LOAD CLASSES
  useEffect(() => {
    if (!STORAGE_KEY) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setClasses(JSON.parse(saved));
    }
  }, [STORAGE_KEY]);

  // 💾 SAVE CLASSES
  useEffect(() => {
    if (!STORAGE_KEY) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  }, [classes, STORAGE_KEY]);

  const addClass = () => {
    if (!course || !day || !time) return;

    setClasses((prev) => [
      ...prev,
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
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  if (!user) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <section className="dashboard-content-card feature-page">
      <div className="feature-header">
        <h2 className="feature-title">Class Schedule</h2>
      </div>

      {/* ADD CLASS */}
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

        <button className="btn-primary" onClick={addClass}>
          Add
        </button>
      </div>

      {classes.length === 0 && (
        <div className="feature-empty">No classes added yet.</div>
      )}

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
