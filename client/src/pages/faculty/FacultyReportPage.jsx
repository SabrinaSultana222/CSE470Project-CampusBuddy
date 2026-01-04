import React, { useEffect, useState } from "react";
import "./FacultyReport.css";

const STORAGE_KEY = "faculty_report";

const FacultyReportPage = () => {
  const [reportType, setReportType] = useState("");
  const [generated, setGenerated] = useState(false);
  const [generatedDate, setGeneratedDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved report on page load
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

    setIsGenerating(true);

    setTimeout(() => {
      const today = new Date().toLocaleDateString();

      const reportData = {
        reportType,
        generated: true,
        generatedDate: today,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(reportData));

      setGenerated(true);
      setGeneratedDate(today);
      setIsGenerating(false);
    }, 800); // fake generation delay for realism
  };

  const clearReport = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGenerated(false);
    setReportType("");
    setGeneratedDate("");
  };

  const reportTitle = () => {
    if (reportType === "attendance") return "📋 Attendance Report";
    if (reportType === "classes") return "📚 Class Schedule Report";
    if (reportType === "events") return "📅 Event Participation Report";
    return "";
  };

  const reportDescription = () => {
    if (reportType === "attendance")
      return "Summary of student attendance records.";
    if (reportType === "classes")
      return "Overview of assigned classes and schedules.";
    if (reportType === "events")
      return "Participation details for academic events.";
    return "";
  };

  return (
    <section className="dashboard-content-card" style={{ maxWidth: 900 }}>
      <h2>📊 Report Generator</h2>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Generate academic and activity reports for faculty review.
      </p>

      {/* CONTROLS */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <select
          className="form-select"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          style={{ maxWidth: 280 }}
        >
          <option value="">Select report type</option>
          <option value="attendance">Attendance Report</option>
          <option value="classes">Class Schedule Report</option>
          <option value="events">Event Participation Report</option>
        </select>

        <button
          className="generate-btn"
          onClick={generateReport}
          disabled={!reportType || isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>

        {generated && (
          <button className="btn-secondary" onClick={clearReport}>
            Clear
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {!generated && !isGenerating && (
        <div className="empty-widgets-box">
          📄 No report generated yet.  
          <br />
          Select a report type and click <b>Generate</b>.
        </div>
      )}

      {/* REPORT OUTPUT */}
      {generated && (
        <div
          style={{
            padding: 20,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#f8fafc",
          }}
        >
          <h4 style={{ marginBottom: 6 }}>{reportTitle()}</h4>
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            {reportDescription()}
          </p>

          <ul style={{ fontSize: 14, marginTop: 12 }}>
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
