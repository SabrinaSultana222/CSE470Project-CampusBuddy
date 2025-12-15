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
      .get("http://localhost:5000/api/faqs")
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
    <div className="feature-page" style={{ maxWidth: 900 }}>
      <h2>Help & Frequently Asked Questions</h2>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search your question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Academic">Academic</option>
          <option value="System">System</option>
          <option value="General">General</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <p>Loading FAQs...</p>}

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* No result */}
      {!loading && filteredFaqs.length === 0 && (
        <p>No matching questions found.</p>
      )}

      {/* FAQ List */}
      {filteredFaqs.map((faq, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            marginBottom: 10,
            padding: "12px 16px",
            cursor: "pointer",
            backgroundColor: "white",
          }}
          onClick={() =>
            setOpenIndex(openIndex === index ? null : index)
          }
        >
          <h4 style={{ margin: 0 }}>{faq.question}</h4>

          {openIndex === index && (
            <p style={{ marginTop: 8, color: "#374151" }}>
              {faq.answer}
            </p>
          )}

          {faq.category && (
            <span
              style={{
                fontSize: 12,
                color: "#2563eb",
                fontWeight: 600,
              }}
            >
              {faq.category}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqPage;
