import React from "react";
import Card from "../firstpage/Card";
import "../styles/home.css";
import Footer from "../firstpage/Footer"; // Adjust if needed
function Home() {
  return (
    <>
        <div className="app-container">
      <div className="card-container">
        <Card
          title="Create Quiz"
          description="Test your knowledge on health and wellness."
          buttonText="Create"
          link="/CreateQuiz"
        />
        <Card
          title="Upcoming Quiz"
          description="Improve your IQ with this quiz!"
          buttonText="Start Now"
          link="/takequiz"
        />
        <Card
          title="Grades"
          description="Check your result"
          buttonText="Grades"
          link="/ranking"
        />
      </div>
    </div>
          <Footer/>
    
    </>
  );
}

export default Home;