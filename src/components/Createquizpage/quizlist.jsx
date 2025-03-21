import React from "react";
useEffect(() => {
  setIsLoading(true);

  const userId = localStorage.getItem("userId"); // Get logged-in user's ID
  if (!userId) {
    console.error("User ID not found, redirecting to login...");
    navigate("/login");
    return;
  }

  axios.get(`http://localhost:5000/api/quizzes?userId=${userId}`)
    .then(response => {
      setQuizzes(response.data); // Only get logged-in user's quizzes
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Error fetching quizzes:", error);
      setIsLoading(false);
    });
}, []);

const quizlist = ({ quizzes }) => {
  return (
    <div>
      <h2>Quiz List</h2>
      {quizzes.length === 0 ? <p>No quizzes created yet.</p> : (
        <ul>
          {/* Display Quiz Image */}
{selectedQuiz.image && (
  <img src={selectedQuiz.image} alt="Quiz" className="quiz-image" />
)}

          {quizzes.map((quiz, index) => (
            <li key={index}>
              <strong>{quiz.title}</strong> - {quiz.description}
              <ul>
                {quiz.questions.map((q, qIndex) => (
                  <li key={qIndex}>{q.text} ({q.type})</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default quizlist;