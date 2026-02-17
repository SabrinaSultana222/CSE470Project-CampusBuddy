import { useState } from "react";

const FacultyFaqPage = () => {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I generate reports?",
      answer:
        "Go to the Report Generator section from the sidebar, select the required parameters and click Generate.",
    },
    {
      question: "Can I edit my class schedule?",
      answer:
        "Yes. Open Class Schedule from the faculty dashboard and update or delete existing entries.",
    },
    {
      question: "Where can I see upcoming events?",
      answer:
        "All upcoming academic and faculty events are available in the Event Calendar section.",
    },
    {
      question: "How does the To-Do List work?",
      answer:
        "You can add, mark complete, or delete tasks. Your tasks are saved automatically.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="dashboard-content-card feature-page">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
          ❓ FAQ
        </h2>
        <p style={{ color: "#6b7280" }}>
          Frequently asked questions for faculty members.
        </p>
      </div>

      {/* Main Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: 24,
        }}
      >
        {/* LEFT SEARCH BOX */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 20,
            background: "#fff",
          }}
        >
          <input
            className="form-control"
            placeholder="Search a question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <p
            style={{
              marginTop: 16,
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            Type keywords to quickly find answers related to faculty features.
          </p>
        </div>

        {/* RIGHT FAQ LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredFaqs.length === 0 && (
            <div className="feature-empty">
              No matching questions found.
            </div>
          )}

          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 16,
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4 style={{ margin: 0 }}>{faq.question}</h4>
                  <span
                    style={{
                      fontSize: 20,
                      transform: isOpen
                        ? "rotate(45deg)"
                        : "rotate(0deg)",
                      transition: "0.2s",
                    }}
                  >
                    +
                  </span>
                </div>

                {isOpen && (
                  <p
                    style={{
                      marginTop: 12,
                      color: "#374151",
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FacultyFaqPage;
