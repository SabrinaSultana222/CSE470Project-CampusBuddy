import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    bracuId: "",
    email: "",
    password: "",
    role: "student", // UI only; backend ignores and decides from email
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
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          bracuId: form.bracuId,
          email: form.email,
          password: form.password,
          // role is not sent; backend infers from email domain
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage(data.message || "Account created. Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch {
      setMessage("Network error");
    }
  };

  return (
    <div>
      <h2 className="auth-title">Create account</h2>
      <p className="auth-subtitle">
        Join Campus Buddy to manage your student life.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>BRACU ID</label>
          <input
            className="form-control"
            name="bracuId"
            value={form.bracuId}
            onChange={handleChange}
          />
        </div>

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
            {/* clubAdmin/admin removed from registration for security */}
          </select>
        </div>

        <button type="submit" className="btn-primary">
          Register
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RegisterPage;
