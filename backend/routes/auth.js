import express from "express";
import pool from "../config/db.js"; // ✅ PostgreSQL Connection
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("🔍 Incoming Registration Request:", { username, email });

    // ✅ Check if email or username already exists
    const existingUser = await pool.query(
      "SELECT username, email FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      console.log("❌ Email or Username already exists:", existingUser.rows[0]);
      return res.status(400).json({ message: "Email or Username already in use" });
    }

    // ✅ Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new user into database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    const user = newUser.rows[0];

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ User registered successfully:", user.email);

    // ✅ Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({ message: "Registration successful", token, user });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

export default router;








