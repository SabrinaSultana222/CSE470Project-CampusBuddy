import React, { useEffect, useState } from "react";
import axios from "axios";

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/faqs")
      .then((res) => {
        setFaqs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load FAQs");
        setLoading(false);
      });
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || faq.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="dashboard-content-card feature-page">
      {/* Header */}
      <div className="feature-header">
        <h2 className="feature-title">
          Help & Frequently Asked Questions
        </h2>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input
          className="form-control"
          placeholder="Search your question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />

        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Academic">Academic</option>
          <option value="System">System</option>
          <option value="General">General</option>
        </select>
      </div>

      {/* States */}
      {loading && <p>Loading FAQs...</p>}

      {error && (
        <p style={{ color: "#dc2626", fontWeight: 600 }}>
          {error}
        </p>
      )}

      {!loading && filteredFaqs.length === 0 && (
        <div className="feature-empty">
          No matching questions found.
        </div>
      )}

      {/* FAQ LIST */}
      {filteredFaqs.map((faq, index) => (
        <div
          key={index}
          className="feature-card"
          onClick={() =>
            setOpenIndex(openIndex === index ? null : index)
          }
        >
          <h4 style={{ margin: 0 }}>{faq.question}</h4>

          {faq.category && (
            <span className="feature-badge">
              {faq.category}
            </span>
          )}

          <div
            className={`faq-answer ${
              openIndex === index ? "open" : "closed"
            }`}
          >
            <p style={{ marginTop: 10, color: "#374151" }}>
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FaqPage;
