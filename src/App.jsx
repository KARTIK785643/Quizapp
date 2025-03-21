import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/firstpage/Navbar"; 
import Landing from "./components/home/Landing";
import Home from "./components/home/Home";
import Login from "./components/Registerpage/Login";
import Register from "./components/Registerpage/Register";
import About from "./components/pages/About";
import Createquiz from "./components/Createquizpage/Createquiz";
import Takequiz from "./components/takequizpage/Takequiz";
import Ranking from "./components/Ranking/Ranking";
import Profile from "./components/profilepage/Profile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("loginSuccess", handleAuthChange);
    window.addEventListener("logoutSuccess", handleAuthChange);

    return () => {
      window.removeEventListener("loginSuccess", handleAuthChange);
      window.removeEventListener("logoutSuccess", handleAuthChange);
    };
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />  {/* Pass login state to Navbar */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />  {/* Pass state updater */}
        <Route path="/createquiz" element={<Createquiz />} />
        <Route path="/takequiz" element={<Takequiz />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
