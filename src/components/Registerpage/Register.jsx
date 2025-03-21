import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./reg.css";


const Register = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" }); // ✅ Using `username`
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    if (!user.username || !user.email || !user.password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        user,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("📩 Registration response:", response.data);

      if (response.data.message === "User registered successfully!") {
        return <Navigate to="/login" />;
      }
      
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data);
      setError(err.response?.data?.error || "Registration failed!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username" // ✅ Using `username`
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register;
