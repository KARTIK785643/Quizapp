const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },  // 👈 Make email required
    password: { type: String, required: true },  // 🔥 Add password field
    correctAnswer: { type: Number, default: 0 }, // ✅ Ensure it's a number

});

module.exports = mongoose.model("User", userSchema);
