import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReportPage = () => {
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
      <h2>Report Generator</h2>

      <p>Select a report:</p>
      <button>Attendance Report</button><br />
      <button>Assignment Summary</button><br />
      <button>Event Participation</button>
    </div>
  );
};

export default ReportPage;
