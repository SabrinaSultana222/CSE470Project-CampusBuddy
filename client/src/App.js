import { useState } from "react";
import "./App.css";
import Chatbot from "./components/Chatbot";
import Notifications from "./components/Notifications";

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? "app dark" : "app light"}>
      <h1>Campus Buddy</h1>
      <p>MERN + MVC base project (no backend calls yet).</p>

      <button onClick={() => setIsDark(!isDark)}>
        Switch to {isDark ? "Light" : "Dark"} Mode
      </button>

      <Chatbot />
      <Notifications />
    </div>
  );
}

export default App;
