import React, { useState } from "react";
import "./FacultyFAQ.css";

const faqData = [
  {
    question: "How do I generate reports?",
    answer:
      "Go to the Report Generator section from the sidebar, choose a report type, and click the Generate button. Reports are created instantly."
  },
  {
    question: "Can I edit my class schedule?",
    answer:
      "Yes. You can view, add, or remove classes from the Class Schedule page. Any changes you make are saved automatically."
  },
  {
    question: "Where can I see upcoming events?",
    answer:
      "All upcoming academic meetings, seminars, and workshops are available in the Event Calendar section."
  },
  {
    question: "How does the To-Do List work?",
    answer:
      "You can add tasks, mark them as completed, or delete them. The To-Do List helps you track daily academic responsibilities."
  },
  {
    question: "Can I add or delete events?",
    answer:
      "Yes. Faculty members can add new events such as meetings or seminars and remove them when they are no longer needed."
  },
  {
    question: "Are events saved automatically?",
    answer:
      "Yes. All events are saved automatically and will remain available the next time you log in."
  },
  {
    question: "Can I upload academic files?",
    answer:
      "Yes. Faculty members can upload academic materials such as notices or documents where file upload is supported."
  },
  {
    question: "Who can see my events?",
    answer:
      "Events created by faculty are visible to authorized users depending on the system configuration."
  },
  {
    question: "Do I receive notifications?",
    answer:
      "Yes. You may receive notifications for important updates, events, or system messages."
  },
  {
    question: "What should I do if something is not working?",
    answer:
      "If a feature is not working as expected, try refreshing the page. If the problem continues, contact system support."
  }
];

const FacultyFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [search, setSearch] = useState("");

  const filteredFAQ = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="dashboard-content-card">
      <h2>❓ Faculty Help & FAQ</h2>
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
          <p className="faq-empty">
            No matching questions found. Try a different keyword.
          </p>
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
