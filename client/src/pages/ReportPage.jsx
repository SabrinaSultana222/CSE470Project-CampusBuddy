import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReportPage = () => {
  const [user, setUser] = useState(null);
  const [loadingReport, setLoadingReport] = useState(null);
  const [reportData, setReportData] = useState("");
  const navigate = useNavigate();

  // 🔐 Auth check
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

  // 🧠 Fake report generators (can replace with API later)
  const generateAttendance = () => {
    return `
Attendance Report
-----------------
Student: ${user.name || "Student"}
Total Classes: 45
Present: 40
Absent: 5
Attendance Percentage: 88.9%
Status: Eligible for exams
`;
  };

  const generateAssignment = () => {
    return `
Assignment Summary
------------------
Total Assignments: 10
Submitted: 8
Pending: 2
Late Submissions: 1
Overall Status: Satisfactory
`;
  };

  const generateEvents = () => {
    return `
Event Participation Report
--------------------------
Total Events Attended: 4
• Career Fair
• Club Fest
• Hackathon
• Tech Talk
Participation Level: Active
`;
  };

  const handleGenerate = (type) => {
    setLoadingReport(type);
    setReportData("");

    setTimeout(() => {
      let data = "";
      if (type === "attendance") data = generateAttendance();
      if (type === "assignment") data = generateAssignment();
      if (type === "event") data = generateEvents();

      setReportData(data);
      setLoadingReport(null);
    }, 1200);
  };

  // 📥 Download report
  const downloadReport = () => {
    const blob = new Blob([reportData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Campus_Buddy_Report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="dashboard-content-card feature-page">
      {/* Header */}
      <div className="feature-header">
        <h2 className="feature-title">📄 Report Generator</h2>
        <p style={{ color: "#6b7280", marginTop: 6 }}>
          Generate academic and activity reports
        </p>
      </div>

      {/* Report Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <ReportCard
          title="📊 Attendance Report"
          desc="View your class attendance summary."
          loading={loadingReport === "attendance"}
          onGenerate={() => handleGenerate("attendance")}
        />

        <ReportCard
          title="📝 Assignment Summary"
          desc="Overview of submitted and pending assignments."
          loading={loadingReport === "assignment"}
          onGenerate={() => handleGenerate("assignment")}
        />

        <ReportCard
          title="🎉 Event Participation"
          desc="Track your involvement in campus events."
          loading={loadingReport === "event"}
          onGenerate={() => handleGenerate("event")}
        />
      </div>

      {/* Report Output */}
      {reportData && (
        <div
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          <h4>Generated Report</h4>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: 14,
              color: "#111827",
            }}
          >
            {reportData}
          </pre>

          <button
            className="btn-primary"
            style={{ marginTop: 12, width: "auto" }}
            onClick={downloadReport}
          >
            Download Report
          </button>
        </div>
      )}
    </section>
  );
};

// 🔹 Reusable Card Component
const ReportCard = ({ title, desc, onGenerate, loading }) => {
  return (
    <div className="feature-card">
      <h4 style={{ margin: 0 }}>{title}</h4>
      <p style={{ color: "#6b7280", margin: "6px 0" }}>{desc}</p>
      <button
        className="btn-primary"
        style={{ width: "auto" }}
        onClick={onGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
};

export default ReportPage;
