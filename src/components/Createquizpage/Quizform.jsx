import React, { useState } from "react";


const QuizForm = ({ onSubmit }) => {
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    image: "",
    audio: "",
    questions: [],
  });

  const [question, setQuestion] = useState({
    question: "",
    options: ["", ""],
    correctAnswer: "",
  });

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleCorrectAnswerChange = (value) => {
    setQuestion({ ...question, correctAnswer: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setQuiz({ ...quiz, image: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setQuiz({ ...quiz, audio: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const addOption = () => {
    setQuestion({ ...question, options: [...question.options, ""] });
  };

  const addQuestion = () => {
    setQuiz({ ...quiz, questions: [...quiz.questions, question] });
    setQuestion({ question: "", options: ["", ""], correctAnswer: "" });
  };

  const submitQuiz = () => {
    onSubmit(quiz);
    setQuiz({ title: "", description: "", image: "", audio: "", questions: [] });
  };

  return (
    <>
      <div className="quiz-container">
        <h3>Quiz Details</h3>
        <input type="text" name="title" value={quiz.title} onChange={handleQuizChange} placeholder="Quiz Title" />
        <textarea name="description" value={quiz.description} onChange={handleQuizChange} placeholder="Quiz Description" />

        <h4>Upload Image (Optional)</h4>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {quiz.image && <img src={quiz.image} alt="Quiz" width="100px" />}

        <h4>Upload Audio (Optional)</h4>
        <input type="file" accept="audio/*" onChange={handleAudioUpload} />
        {quiz.audio && <audio controls src={quiz.audio}></audio>}

        <h3>Add Question</h3>
        <input type="text" name="question" value={question.question} onChange={handleQuestionChange} placeholder="Question" />

        <h4>Options</h4>
        {question.options.map((option, index) => (
          <div key={index} className="option-row">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <input
              type="radio"
              name="correctAnswer"
              checked={question.correctAnswer === option}
              onChange={() => handleCorrectAnswerChange(option)}
            />
          </div>
        ))}

        <button onClick={addOption}>Add Option</button>
        <button onClick={addQuestion}>Add Question</button>
        <button onClick={submitQuiz}>Submit Quiz</button>
      </div>

      <div className="quiz-display">
        {quiz.questions.length > 0 && (
          <div>
            <h4>Quiz: {quiz.title}</h4>
            <p>{quiz.description}</p>
            {quiz.image && <img src={quiz.image} alt="Quiz" width="100px" />}
            {quiz.audio && <audio controls src={quiz.audio}></audio>}
            <ul>
              {quiz.questions.map((q, index) => (
                <li key={index}>
                  <strong>{q.question}</strong>
                  <ul>
                    {q.options.map((opt, i) => (
                      <li key={i}>
                        {opt} {q.correctAnswer === opt ? "✅" : ""}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizForm;
