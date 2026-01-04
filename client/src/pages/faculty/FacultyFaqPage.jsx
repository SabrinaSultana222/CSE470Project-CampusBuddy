import React, { useState } from "react";
import "./FacultyFAQ.css";

const faqData = [
  {
    question: "How do I generate reports?",
    answer:
      "Go to the Report Generator section, select a report type, and click Generate."
  },
  {
    question: "Can I edit my class schedule?",
    answer:
      "Yes. You can view and update your class schedule from the Class Schedule page."
  },
  {
    question: "Where can I see upcoming events?",
    answer:
      "All upcoming academic and campus events are available in the Event Calendar."
  },
  {
    question: "How does the To-Do List work?",
    answer:
      "You can add, mark complete, and delete tasks. Tasks are saved automatically."
  }
];

const FacultyFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [search, setSearch] = useState("");

  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="dashboard-content-card">
      <h2>❓ Faculty FAQ</h2>
      <p className="faq-subtitle">
        Frequently asked questions for faculty members.
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search a question..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="faq-search"
      />

      {/* FAQ List */}
      <div className="faq-list">
        {filteredFAQ.length === 0 && (
          <p className="faq-empty">No matching questions found.</p>
        )}

        {filteredFAQ.map((item, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
            >
              {item.question}
              <span>{activeIndex === index ? "−" : "+"}</span>
            </button>

            {activeIndex === index && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FacultyFAQ;
