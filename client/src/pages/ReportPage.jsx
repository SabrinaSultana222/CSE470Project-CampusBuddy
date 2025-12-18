import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReportPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  if (!user) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <section className="dashboard-content-card feature-page">
      {/* Header */}
      <div className="feature-header">
        <h2 className="feature-title">Report Generator</h2>
        <p style={{ color: "#6b7280", marginTop: 6 }}>
          Generate academic and activity reports
        </p>
      </div>

      {/* Report cards */}
      <div style={{ display: "grid", gap: 16 }}>
        <div className="feature-card">
          <h4 style={{ margin: 0 }}>📊 Attendance Report</h4>
          <p style={{ color: "#6b7280", margin: "6px 0" }}>
            View your class attendance summary.
          </p>
          <button className="btn-primary" style={{ width: "auto" }}>
            Generate
          </button>
        </div>

        <div className="feature-card">
          <h4 style={{ margin: 0 }}>📝 Assignment Summary</h4>
          <p style={{ color: "#6b7280", margin: "6px 0" }}>
            Overview of submitted and pending assignments.
          </p>
          <button className="btn-primary" style={{ width: "auto" }}>
            Generate
          </button>
        </div>

        <div className="feature-card">
          <h4 style={{ margin: 0 }}>🎉 Event Participation</h4>
          <p style={{ color: "#6b7280", margin: "6px 0" }}>
            Track your involvement in campus events.
          </p>
          <button className="btn-primary" style={{ width: "auto" }}>
            Generate
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReportPage;
