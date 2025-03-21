const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { Server } = require('socket.io');
const http = require('http');

const User = require(path.join(__dirname, "models", "User"));
const Quiz = require(path.join(__dirname, "models", "Quiz"));


require("dotenv").config();

const app = express();
const httpServer = http.createServer(app); // ✅ Create HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization']

  },
});
app.use(express.static(path.join(__dirname, "build")));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://kartik4023:Kartik123@mediquiz.ovwzn.mongodb.net/myquizDB?retryWrites=true&w=majority&appName=Mediquiz";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(express.json({ limit: "50mb" })); 
app.use(bodyParser.json({ limit: "50mb" })); 

app.use(cors({ 
  origin: FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));




// ✅ Updated User Schema (Now Tracks Quiz Attempts)



const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ error: "Token is not valid" });
  }
};




app.get("/", (req, res) => {
  res.json({
    message: "Quiz API server is running",
    endpoints: {
      auth: ["/register", "/login", "/profile"],
      quizzes: ["/api/quizzes", "/api/quizzes/:id", "/api/quizzes/:id/link"],
      system: ["/health"]
    }
  });
});


app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🚀 Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or Email already exists." });
    }

    // 🔒 Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login Attempt:", { email });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password!" });
    }

    console.log("✅ Login successful:", { userId: user._id });

    // ✅ Generate JWT Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful!",
      token, // ✅ Send token
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("username email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/quizzes", authMiddleware, async (req, res) => {
  try {
    // Get the creator ID from the authentication middleware
    const creatorId = req.userId;
    
    console.log("Fetching quizzes for creator:", creatorId); // Debug log
    
    // Find only quizzes created by this user
    const quizzes = await Quiz.find({ creator: creatorId });
    
    console.log("Found quizzes:", quizzes.length); // Debug log
    
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Server error fetching quizzes" });
  }
});

app.get("/api/quizzes/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a new quiz with image & audio support
// Fix the '/api/quizzes' endpoint
app.post("/api/quizzes", authMiddleware, async (req, res) => {
  try {
    const { title, description, image, audio, questions } = req.body;
    
    // Get the creator ID from the authentication middleware
    const creatorId = req.userId;
    
    if (!title || !questions || !questions.length) {
      return res.status(400).json({ message: "Title and questions are required!" });
    }

    // Create and save the quiz with explicit creator field
    const newQuiz = new Quiz({
      title,
      description,
      image,
      audio,
      questions,
      creator: creatorId // Make sure creator ID is properly set
    });

    console.log("Creating quiz with creator:", creatorId); // Debug log
    
    const savedQuiz = await newQuiz.save();
    console.log("Saved quiz:", savedQuiz); // Debug log
    
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete a quiz
app.delete("/api/quizzes/:id", async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "✅ Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/api/quizzes/:quizId/submit", authMiddleware, async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;
    const userId = req.userId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) {
        score++;
      }
    });

    // ✅ Save result in the Quiz collection (inside `results`)
    quiz.results.push({ userId, score });
    await quiz.save();

    // ✅ Update User's correctAnswers field
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.correctAnswers += score; // Track total correct answers
    await user.save();

    // ✅ Emit leaderboard update
    io.emit("leaderboardUpdated");

    res.json({ message: "Quiz submitted successfully", score });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
}); 




io.on("connection", (socket) => {
    console.log("🔗 New client connected:", socket.id);

    // Send initial leaderboard when a user connects
    getLeaderboard().then((leaderboard) => {
        socket.emit("leaderboardUpdated", leaderboard);
    });

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

app.post("/submit-quiz", async (req, res) => {
  try {
      const { quizId, userId, answers } = req.body;

      // Find the quiz
      const quiz = await Quiz.findById(quizId);
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });

      // Calculate the correct answers
      let correctCount = 0;
      quiz.questions.forEach((q, index) => {
          if (answers[index] === q.correctAnswer) {
              correctCount++;
          }
      });

      // ✅ Save the result in the Quiz model under `results` array
      await Quiz.findByIdAndUpdate(
          quizId,
          { $push: { results: { userId, score: correctCount } } },
          { new: true }
      );

      // ✅ Update the User's correct answer count
      await User.findByIdAndUpdate(userId, { $inc: { correctAnswer: correctCount } });

      res.json({ message: "Quiz submitted successfully", correctCount });
  } catch (error) {
      console.error("Error submitting quiz:", error);
      res.status(500).json({ error: "Server error" });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
      const leaderboard = await User.find({}, "username correctAnswer")
          .sort({ correctAnswer: -1 })  // Sort by highest correct answers
          .limit(10);  // Limit top 10 users

      res.json(leaderboard);
  } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});


console.log("Attempting to connect to MongoDB...");
mongoose.set("debug", true);
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // serverSelectionTimeoutMS: 10000
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
  ///////////

module.exports = app;

