import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

function Card({ title, description, buttonText, link }) {
  return (
    <div className="quiz-card">
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>
      <Link to={link}>
        <button className="card-button">{buttonText}</button>
      </Link>
    </div>
  );
}

export default Card;