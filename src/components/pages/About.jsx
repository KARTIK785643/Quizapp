import React from "react";
import "./about.css";
function About() {
  return (
    <>
    <div className="about-container">
      <h1 className="about-title">About MediQuiz</h1>
      <p className="about-description">
        <strong>MediQuiz</strong> is an innovative platform that allows users to 
        create and participate in interactive quizzes using images, audio, and text-based questions. 
        Whether you are an educator, student, or quiz enthusiast, MediQuiz provides a 
        seamless experience for creating, sharing, and competing in real-time quizzes.
      </p>

      <h2 className="features-title">🔹 Key Features</h2>
      <ul className="features-list">
        <li className="feature-item">🎨 <strong>Multimedia Support:</strong> Add images and audio to your quizzes.</li>
        <li className="feature-item">🔗 <strong>Generate Shareable Links:</strong> Easily share your quiz with others.</li>
        <li className="feature-item">📊 <strong>Live Leaderboard:</strong> Track real-time scores of all participants.</li>
        <li className="feature-item">🖥️ <strong>User-Friendly Interface:</strong> Create and take quizzes with ease.</li>
        <li className="feature-item">👥 <strong>Public & Private Quizzes:</strong> Host for everyone or invite specific users.</li>
      </ul>

      <h2 className="how-it-works-title">🚀 How It Works?</h2>
      <p className="how-it-works-description">
        Simply create a quiz by adding <strong>questions, images, and audio</strong>, generate a <strong>shareable link</strong>, 
        and invite users to participate. The <strong>leaderboard updates live</strong>, displaying real-time rankings of 
        all participants. Engage in exciting quizzes and test your knowledge today!
      </p>
    </div>
    </>
  );
}

export default About;
