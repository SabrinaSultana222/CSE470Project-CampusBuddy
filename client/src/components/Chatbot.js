import { useState } from "react";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const handleSend = () => {
    const text = message.toLowerCase();

    if (text.includes("campus buddy")) {
      setReply("Campus Buddy is a platform for students to connect, share posts, and get campus updates.");
    } 
    else if (text.includes("club")) {
      setReply("You can join clubs, view events, and post updates in the Clubs section.");
    } 
    else if (text.includes("admin")) {
      setReply("Admins manage users, posts, and announcements.");
    } 
    else if (text.includes("help")) {
      setReply("I can help with clubs, posts, and general campus information.");
    } 
    else {
      setReply("Sorry, I don't understand yet. More features coming soon!");
    }

    setMessage("");
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Campus Buddy Chatbot 🤖</h2>
      <p>This is the AI assistant for students.</p>

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
