const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  audio: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      correctAnswer: { type: String, required: true },
    }
  ],
  results: [  // ✅ Adding the results array back
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: { type: Number, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Quiz", quizSchema);