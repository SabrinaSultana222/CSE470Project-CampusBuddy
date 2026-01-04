import "./FacultyReport.css";

import React, { useEffect, useState } from "react";

const STORAGE_KEY = "faculty_report";

const FacultyReportPage = () => {
  const [reportType, setReportType] = useState("");
  const [generated, setGenerated] = useState(false);
  const [generatedDate, setGeneratedDate] = useState("");

  // LOAD saved report on page load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setReportType(data.reportType);
      setGenerated(data.generated);
      setGeneratedDate(data.generatedDate);
    }
  }, []);

  const generateReport = () => {
    if (!reportType) return;

    const today = new Date().toLocaleDateString();

    const reportData = {
      reportType,
      generated: true,
      generatedDate: today,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reportData));

    setGenerated(true);
    setGeneratedDate(today);
  };

  const clearReport = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGenerated(false);
    setReportType("");
    setGeneratedDate("");
  };

  return (
    <section className="dashboard-content-card" style={{ maxWidth: 900 }}>
      <h2>📊 Report Generator</h2>
      <p style={{ color: "#6b7280", marginBottom: 20 }}>
        Generate academic and activity reports.
      </p>

      {/* SELECT */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <select
          className="form-select"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          style={{ maxWidth: 260 }}
        >
          <option value="">Select report type</option>
          <option value="attendance">Attendance Report</option>
          <option value="classes">Class Schedule Report</option>
          <option value="events">Event Participation Report</option>
        </select>

        <button className="generate-btn" onClick={generateReport}>
          Generate
        </button>

        {generated && (
          <button className="btn-secondary" onClick={clearReport}>
            Clear
          </button>
        )}
      </div>

      {/* OUTPUT */}
      {!generated ? (
        <div className="empty-widgets-box">No report generated yet.</div>
      ) : (
        <div
          style={{
            padding: 16,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#f8fafc",
          }}
        >
          <h4>
            {reportType === "attendance" && "📋 Attendance Report"}
            {reportType === "classes" && "📚 Class Schedule Report"}
            {reportType === "events" && "📅 Event Participation Report"}
          </h4>

          <ul style={{ fontSize: 14 }}>
            <li>Total records analyzed: 12</li>
            <li>Generated on: {generatedDate}</li>
            <li>Status: Completed</li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default FacultyReportPage;
