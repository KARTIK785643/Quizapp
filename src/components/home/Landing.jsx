import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css"; // Import CSS for styling
import Footer from "../firstpage/Footer"; // Adjust if needed

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to <span>MediQuiz</span></h1>
          <p>Create engaging quizzes with images, videos, and audio. Test knowledge interactively!</p>
          <Link className="cta-button">Developed by Kartik</Link>
        </div>
       
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose MediQuiz?</h2>
        <div className="features">
          <div className="feature">
            <h3>🎥 Multimedia Support</h3>
            <p>Add images, videos, and audio to make quizzes more interactive.</p>
          </div>
          <div className="feature">
            <h3>📝 Custom Quizzes</h3>
            <p>Customize quizzes based on subjects, difficulty levels, and formats.</p>
          </div>
          <div className="feature">
            <h3>📊 Real-time Scoring</h3>
            <p>Instant results and feedback to track progress.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1️⃣ Create a Quiz</h3>
            <p>Design questions and add multimedia content.</p>
          </div>
          <div className="step">
            <h3>2️⃣ Share with Others</h3>
            <p>Send quiz links to participants.</p>
          </div>
          <div className="step">
            <h3>3️⃣ Analyze Results</h3>
            <p>View scores and track learning progress.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>

    </div>
  );
};

export default LandingPage;
