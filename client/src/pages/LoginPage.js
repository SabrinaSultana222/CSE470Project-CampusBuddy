import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student", // can be student / faculty / clubAdmin / admin
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form), // includes role, checked on backend
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }
      setMessage(`Welcome, ${data.user.name} (${data.user.role})`);
      if (data.user.role === "student") {
      navigate("/dashboard");
}     else if (data.user.role === "faculty") {
      navigate("/faculty");
}     else if (data.user.role === "admin") {
      navigate("/admin");   
}     else {
      navigate("/");
}
 }    catch {
      setMessage("Network error");
    }
  };

  return (
    <div>
      <h2 className="auth-title">Login</h2>
      <p className="auth-subtitle">Sign in to your Campus Buddy account.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            className="form-select"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default LoginPage;
