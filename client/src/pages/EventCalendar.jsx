import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EventCalendar = () => {
  const [user, setUser] = useState(null);
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

  if (!user) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Event Calendar</h2>

      <ul>
        <li>🎓 Career Fair – 10 Oct</li>
        <li>🎉 Club Fest – 15 Oct</li>
        <li>💻 Hackathon – 20 Oct</li>
      </ul>
    </div>
  );
};

export default EventCalendar;
