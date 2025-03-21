import React, { useState, useEffect } from "react";
import QuizForm from "./Quizform";
import "../styles/style.css";
import axios from "axios";




const CreateQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizLinks, setQuizLinks] = useState({}); // Store generated links
  const [isLoading, setIsLoading] = useState(false);

  // Fetch quizzes from database on component mount
// Update your useEffect in CreateQuiz.js
useEffect(() => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  
  if (!token) {
    // If not logged in, show message or redirect
    setQuizzes([]);
    setIsLoading(false);
    return;
  }
  
  // Fetch quizzes with authentication
  axios.get(`http://localhost:5000/api/quizzes`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      setQuizzes(response.data);
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Error fetching quizzes:", error);
      setIsLoading(false);
    });
}, []);
  
const handleQuizSubmit = async (quizData) => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("You must be logged in to create a quiz.");
      console.error("No token found in localStorage!");
      setIsLoading(false);
      return;
    }

    console.log("Using Token:", token);  // Debugging line

    const response = await axios.post(`http://localhost:5000/api/quizzes`, quizData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Quiz created successfully:", response.data);
    setQuizzes(prevQuizzes => [...prevQuizzes, response.data]);

    setIsLoading(false);
  } catch (error) {
    console.error("Error submitting quiz:", error.response ? error.response.data : error.message);
    alert("Quiz submission failed! Check console for details.");
    setIsLoading(false);
  }
};

  const generateQuizLink = (quizId) => {
    const link = `${window.location.origin}/quiz/${quizId}`;
    setQuizLinks(prev => ({ ...prev, [quizId]: link }));
  };

  const deleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        setIsLoading(true);
        await axios.delete(`http://localhost:5000/api/quizzes/${quizId}`);
        
        // Remove from state
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
        
        // Remove link if exists
        const newQuizLinks = { ...quizLinks };
        delete newQuizLinks[quizId];
        setQuizLinks(newQuizLinks);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error deleting quiz:", error);
        setIsLoading(false);
        alert("Failed to delete quiz. Please try again.");
      }
    }
  };

  return (
    <div className="main-body">
      <div className="container">
        <h2>Create Quiz</h2>
        <QuizForm onSubmit={handleQuizSubmit} />
        
        <h3>Created Quizzes</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : quizzes.length > 0 ? (
          <ul className="quiz-list">
            {quizzes.map((quiz, index) => (
              <li key={quiz._id || index} className="quiz-item">
                <div className="quiz-info">
                  <strong>{quiz?.title || "Untitled Quiz"}</strong>
                  <p>{quiz?.description || "No description"}</p>
                  <p>Questions: {quiz?.questions?.length || 0}</p>
                  
                  {quiz.image && (
  <div className="quiz-thumbnail" style={{ width: "140px", height: "90px" }}>
    <img 
      src={quiz.image} 
      alt="Quiz thumbnail" 
      className="thumbnail" 
      style={{ width: "100%", height: "100%" }} 
    />
  </div>
)}

                  
                  {quiz.audio && (
                    <div className="audio-preview">
                      <audio 
                        controls 
                        src={quiz.audio}
                        className="preview-audio"
                      ></audio>
                    </div>
                  )}
                </div>
                
                <div className="quiz-actions">
                  <button
                    className="generate-link-btn"
                    onClick={() => generateQuizLink(quiz._id)}
                  >
                    Generate Link
                  </button>
                  
                  <button
                    className="delete-btn"
                    onClick={() => deleteQuiz(quiz._id)}
                  >
                    Delete
                  </button>
                  
                  {quizLinks[quiz._id] && (
                    <div className="quiz-link">
                      <input 
                        type="text"
                        readOnly
                        value={quizLinks[quiz._id]}
                        className="link-input"
                      />
                      <button
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(quizLinks[quiz._id]);
                          // alert('Link copied to clipboard!');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No quizzes created yet.</p>
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;