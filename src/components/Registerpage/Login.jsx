import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./reg.css";



const Login = ({ setIsLoggedIn }) => {  // Accept setIsLoggedIn prop
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user.email || !user.password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", user, {

        headers: { "Content-Type": "application/json" },
      });

      console.log("📩 Login response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("username", response.data.user.username);

        setIsLoggedIn(true);  // ✅ Update App.js login state
        window.dispatchEvent(new Event("loginSuccess"));  // ✅ Trigger Navbar update
        navigate("/home");
      }
    } catch (err) {
      console.error("❌ Login error:", err.response?.data);
      setError(err.response?.data?.error || "Invalid credentials!");
    }
  };

  return (
    <div className="auth-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
