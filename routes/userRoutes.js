const express = require("express");
const router = express.Router();
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");

// Get logged-in user details
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
