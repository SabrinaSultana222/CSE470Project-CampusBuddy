import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClassSchedule = () => {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);

  const [course, setCourse] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const navigate = useNavigate();

  
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) {
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then(data => setUser(data));
  }, [navigate]);


  useEffect(() => {
    const saved = localStorage.getItem("classSchedule");
    if (saved) {
      setClasses(JSON.parse(saved));
    }
  }, []);

  
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
    setClasses(classes.filter(c => c.id !== id));
  };

  if (!user) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div className="feature-page">
      <h2>Class Schedule</h2>

      {/* Add class */}
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Course name"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <select value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="">Select day</option>
          <option>Sunday</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
        </select>

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button onClick={addClass} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      {/* Schedule table */}
      {classes.length === 0 ? (
        <p>No classes added yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Course</th>
              <th>Day</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c.id}>
                <td>{c.course}</td>
                <td>{c.day}</td>
                <td>{c.time}</td>
                <td>
                  <button onClick={() => deleteClass(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClassSchedule;
