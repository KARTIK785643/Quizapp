import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./quiz.css";


const TakeQuiz = () => {
  const [quizLink, setQuizLink] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]); // To record user's answer for each question
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizLoaded, setQuizLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Quiz Data
  const handleQuizLinkSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let id = quizLink.trim();
      if (id.includes("/quiz/")) {
        id = id.split("/quiz/").pop().split("/")[0];
      } else if (id.includes("/")) {
        id = id.split("/").pop();
      }

      console.log("Fetching quiz with ID:", id);
      const response = await axios.get(`http://localhost:5000/api/quizzes/${id}`);
      console.log("Raw Quiz Data Received:", JSON.stringify(response.data, null, 2));

      if (!response.data || !response.data.questions || response.data.questions.length === 0) {
        throw new Error("Invalid quiz data format");
      }

      // Validate and process each question
      const validatedQuiz = {
        ...response.data,
        questions: response.data.questions.map((question, index) => {
          console.log(`Processing question ${index}:`, question);
          const processedQuestion = { ...question };

          if (!processedQuestion.text || processedQuestion.text.trim() === "") {
            console.warn(`Question ${index} is missing text property:`, processedQuestion);
            const possibleTextFields = ['questionText', 'title', 'content', 'question', 'prompt'];
            for (const field of possibleTextFields) {
              if (processedQuestion[field] && processedQuestion[field].trim() !== "") {
                console.log(`Found alternative text in ${field} field for question ${index}`);
                processedQuestion.text = processedQuestion[field];
                break;
              }
            }
            if (!processedQuestion.text || processedQuestion.text.trim() === "") {
              processedQuestion.text = `Question ${processedQuestion.id || index + 1}`;
              console.warn(`Using default text for question ${index}`);
            }
          }

          if (!Array.isArray(processedQuestion.options) || processedQuestion.options.length === 0) {
            console.warn(`Question ${index} has invalid options:`, processedQuestion.options);
            if (Array.isArray(processedQuestion.choices)) {
              processedQuestion.options = processedQuestion.choices;
              console.log(`Using 'choices' field for question ${index} options`);
            } else if (Array.isArray(processedQuestion.answers)) {
              processedQuestion.options = processedQuestion.answers;
              console.log(`Using 'answers' field for question ${index} options`);
            }
          }

          console.log(`Processed question ${index}:`, processedQuestion);
          return processedQuestion;
        })
      };

      console.log("Processed Quiz Data:", validatedQuiz);
      setSelectedQuiz(validatedQuiz);
      setQuizLoaded(true);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setScore(0);
      setUserAnswers([]); // Reset user answers on new quiz
      setQuizCompleted(false);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setError("Invalid Quiz ID or Link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Answer Selection
  const handleAnswer = (option) => {
    setSelectedOption(option);
  };

  // Submit Quiz Attempt to Backend
  const submitQuizResult = async (finalUserAnswers) => {
    try {
      // Replace "yourUserId" with the actual user id (from auth context or local storage)
      const userId = "yourUserId"; 
      const payload = {
        userId,
        quizId: selectedQuiz._id,
        userAnswers: finalUserAnswers
      };
      const response = await axios.post(`${API_URL}/submit-quiz`, payload);
      console.log("Submission response:", response.data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  // Handle Next Button Click
  const handleNext = async () => {
    if (!selectedQuiz) return;

    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

    // Update score if answer is correct
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    // Save the user's answer for the current question
    const updatedAnswers = [...userAnswers, selectedOption];
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
    } else {
      // Last question has been answered: submit the attempt to the backend
      await submitQuizResult(updatedAnswers);
      setQuizCompleted(true);
    }
  };

  // Get the current question safely with extensive logging - using useCallback
  const getCurrentQuestion = useCallback(() => {
    if (!selectedQuiz || !selectedQuiz.questions || selectedQuiz.questions.length === 0) {
      console.error("No quiz or questions available");
      return null;
    }
    
    const question = selectedQuiz.questions[currentQuestionIndex];
    console.log("Current Question Object:", question);
    if (question) {
      console.log("Question properties:", Object.keys(question));
      console.log("Question text property value:", question.text);
      console.log("Question options:", question.options);
    }
    return question;
  }, [selectedQuiz, currentQuestionIndex]);

  // Debug current question whenever it changes
  useEffect(() => {
    if (quizLoaded && selectedQuiz) {
      console.log("Current Question Index:", currentQuestionIndex);
      console.log("Quiz Questions Array:", selectedQuiz.questions);
      const question = getCurrentQuestion();
      console.log("Current Question after update:", question);
    }
  }, [currentQuestionIndex, quizLoaded, selectedQuiz, getCurrentQuestion]);

  const currentQuestion = getCurrentQuestion();

  // Extract question text with fallbacks
  const getQuestionText = (question) => {
    if (!question) return "No question available";
    const textFields = ['text', 'questionText', 'title', 'content', 'question', 'prompt'];
    for (const field of textFields) {
      if (question[field] && typeof question[field] === 'string' && question[field].trim() !== '') {
        console.log(`Found question text in ${field} field:`, question[field]);
        return question[field];
      }
    }
    return "Question text not found";
  };

  return (
    <>
      <div className="quiz-container">
        {!quizLoaded ? (
          <div className="quiz-link-container">
            <h2>Enter Quiz Link</h2>
            <input
              type="text"
              placeholder="Paste quiz link here..."
              value={quizLink}
              onChange={(e) => setQuizLink(e.target.value)}
              className="quiz-link-input"
            />
            <button onClick={handleQuizLinkSubmit} className="submit-link-btn" disabled={loading}>
              {loading ? "Loading..." : "Start Quiz"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        ) : quizCompleted ? (
          <div className="result">
            <h2>Quiz Completed!</h2>
            <p>Your Score: {score} / {selectedQuiz.questions.length}</p>
            <button onClick={() => setQuizLoaded(false)}>Take Another Quiz</button>
          </div>
        ) : (
          <div className="quiz-box">
            {currentQuestion ? (
              <>
                <h2 className="question-text">
                  Question {currentQuestionIndex + 1}: {getQuestionText(currentQuestion)}
                </h2>

                {selectedQuiz.image && (
                  <img
                    src={selectedQuiz.image}
                    alt="Quiz Cover"
                    className="quiz-image"
                    onError={(e) => {
                      console.error("Failed to load quiz image:", e);
                      e.target.style.display = "none";
                    }}
                  />
                )}

                {currentQuestion.image && (
                  <img
                    src={currentQuestion.image}
                    alt="Question"
                    className="question-image"
                    onError={(e) => {
                      console.error("Failed to load question image:", e);
                      e.target.style.display = "none";
                    }}
                  />
                )}

                {currentQuestion.audio && (
                  <audio controls>
                    <source src={currentQuestion.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}

                <div className="options">
                  {Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 ? (
                    currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        className={`option-btn ${selectedOption === option ? "selected" : ""}`}
                        onClick={() => handleAnswer(option)}
                      >
                        {option}
                      </button>
                    ))
                  ) : (
                    <p className="error-message">
                      No options available for this question. 
                      Available fields: {Object.keys(currentQuestion).join(', ')}
                    </p>
                  )}
                </div>

                <button 
                  onClick={handleNext} 
                  className="next-btn"
                  disabled={selectedOption === null}
                >
                  {currentQuestionIndex === selectedQuiz.questions.length - 1 ? "Finish" : "Next"}
                </button>
              </>
            ) : (
              <h2>No Questions Available</h2>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TakeQuiz;
