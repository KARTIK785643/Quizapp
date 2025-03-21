import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sty.css";

const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logoutSuccess"));
    alert("Logout Successful!"); // Alert after successful logout
    // ✅ Notify App.js & Navbar
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h1 className="logo">MediQuiz</h1>
      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li><Link to="/home" className="nav-item">Home</Link></li>
            <li><Link to="/about" className="nav-item">About</Link></li>
            <li><Link to="/profile" className="nav-item">Profile</Link></li>
            <li><span className="nav-item logout" onClick={handleLogout}>Logout</span></li>
          </>
        ) : (
          <>
            <li><Link to="/about" className="nav-item">About</Link></li>
            <li><Link to="/login" className="nav-item">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
