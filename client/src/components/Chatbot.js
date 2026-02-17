import { useState } from "react";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const handleSend = () => {
    const text = message.toLowerCase();

    // ---- GENERAL ----
    if (text.includes("campus buddy")) {
      setReply(
        "Campus Buddy is a student support platform that helps manage schedules, discussions, notifications, and academic tools."
      );
    }
    else if (text.includes("what can you do") || text.includes("features")) {
      setReply(
        "I can help with class schedules, GPA calculation, notifications, discussions, and general campus information."
      );
    }
    else if (text.includes("free")) {
      setReply("Yes, Campus Buddy is free for students and teachers.");
    }
    else if (text.includes("teacher")) {
      setReply("Yes, teachers can also use Campus Buddy with role-based features.");
    }
    else if (text.includes("data safe") || text.includes("secure")) {
      setReply("Your data is stored securely and only accessible when you are logged in.");
    }

    // ---- SCHEDULE ----
    else if (text.includes("schedule") || text.includes("class time")) {
      setReply("You can view and manage your class schedule from the Class Schedule section.");
    }
    else if (text.includes("add class")) {
      setReply("You can add a new class by entering the course name, day, and time in the Class Schedule page.");
    }
    else if (text.includes("delete class") || text.includes("remove class")) {
      setReply("You can delete a class from your schedule using the delete button.");
    }
    else if (text.includes("save schedule")) {
      setReply("Your schedule is saved automatically when you are logged in.");
    }

    // ---- GPA ----
    else if (text.includes("gpa")) {
      setReply("You can calculate your GPA using the GPA Calculator by entering grades and credit hours.");
    }
    else if (text.includes("grade")) {
      setReply("Grades are used in the GPA Calculator to compute your academic performance.");
    }

    // ---- NOTIFICATIONS ----
    else if (text.includes("notification") || text.includes("reminder")) {
      setReply("You can receive reminders for classes, deadlines, and important announcements.");
    }
    else if (text.includes("turn off notification")) {
      setReply("Notification preferences can be managed from your profile settings.");
    }

    // ---- DISCUSSION ----
    else if (text.includes("discussion")) {
      setReply("You can participate in discussions by visiting the Discussion section and selecting a topic.");
    }
    else if (text.includes("post")) {
      setReply("You can post questions or ideas in the discussion area.");
    }

    // ---- FILES ----
    else if (text.includes("upload")) {
      setReply("You can upload study materials or notes depending on your role.");
    }
    else if (text.includes("file")) {
      setReply("Files are uploaded securely with size limitations for smooth performance.");
    }

    // ---- ACCOUNT / TECH ----
    else if (text.includes("login")) {
      setReply("You need to log in to access all Campus Buddy features.");
    }
    else if (text.includes("logout")) {
      setReply("You can log out anytime. Your data will remain saved.");
    }
    else if (text.includes("browser")) {
      setReply("Campus Buddy works best on modern browsers like Chrome, Firefox, and Edge.");
    }

    // ---- FRIENDLY ----
    else if (text.includes("hi") || text.includes("hello")) {
      setReply("Hello! 👋 How can I help you today?");
    }
    else if (text.includes("thank")) {
      setReply("You're welcome! 😊 Let me know if you need anything else.");
    }
    else if (text.includes("bye")) {
      setReply("Goodbye! 👋 Have a great day.");
    }

    // ---- FALLBACK ----
    else {
      setReply(
        "I'm still learning 🤖. Try asking about schedules, GPA, notifications, or discussions."
      );
    }

    setMessage("");
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Campus Buddy Chatbot 🤖</h2>
      <p>This is a smart assistant for students and teachers.</p>

      <input
        type="text"
        placeholder="Ask me something..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "300px", padding: "8px" }}
      />

      <br /><br />

      <button onClick={handleSend}>Send</button>

      {reply && (
        <div style={{ marginTop: "20px" }}>
          <strong>Bot:</strong> {reply}
        </div>
      )}
    </div>
  );
}

export default Chatbot;
