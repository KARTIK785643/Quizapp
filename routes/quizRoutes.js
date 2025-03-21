// const express = require("express");
// const Quiz = require("../models/Quiz"); // Ensure the correct path
// const router = express.Router();

// // ✅ Fetch all quizzes from MongoDB
// router.get("/", async (req, res) => {
//   try {
//     const quizzes = await Quiz.find(); // Fetch quizzes
//     res.json(quizzes);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching quizzes" });
//   }
// });

// // ✅ Save a new quiz to MongoDB
// router.post("/", async (req, res) => {
//   try {
//     const newQuiz = new Quiz(req.body);
//     await newQuiz.save();
//     res.json(newQuiz); // ✅ Return saved quiz
//   } catch (error) {
//     res.status(500).json({ error: "Error saving quiz" });
//   }
// });

// module.exports = router;
