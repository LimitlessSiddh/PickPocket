import express from "express";
import pool from "../config/db.js"; // ✅ PostgreSQL Connection
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // ✅ Ensure this is installed
const admin = require('firebase-admin');


dotenv.config();

const router = express.Router();
router.use(cookieParser()); // ✅ Enable cookie parsing

// ✅ User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("🔍 Incoming Registration Request:", { username, email });

    // ✅ Check if email or username already exists
    const existingUser = await pool.query(
      "SELECT username, email FROM users WHERE email = $1 AND username = $2 LIMIT 1",
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

// ✅ User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Incoming Login Request:", email);

    // ✅ Check if user exists
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
    if (userQuery.rows.length === 0) {
      console.log("❌ No user found with this email");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = userQuery.rows[0];

    // ✅ Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("❌ Incorrect password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful:", user.email);

    // ✅ Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: "Login successful", token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ✅ Logout User
router.post("/logout", (req, res) => {
  console.log("🚪 Logging out user...");

  res.clearCookie("token"); // ✅ Remove session token
  res.status(200).json({ message: "Logged out successfully" });
});

// ✅ Authentication Middleware
const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("❌ No token found in request.");
      return res.status(401).json({ message: "Unauthorized. No token found." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Invalid or expired token:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// ✅ Get User Profile (Protected Route)
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const userQuery = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [req.user.id]
    );

    if (userQuery.rows.length === 0) {
      console.log("❌ No user found with ID:", req.user.id);
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ Return User Data
    res.status(200).json(userQuery.rows[0]);
  } catch (error) {
    console.error("❌ Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

router.post("/googleAuth", async (req, res) => {
  const token = req.body.token;
  try {

    const decoded_token = await admin.auth().verifyIdToken(token);
    const name = decoded_token.name;
    const email = decoded_token.email;

    // check if in db alr
    const existingUser = await pool.query(
      "SELECT username, email FROM users WHERE email = $1 AND username = $2 LIMIT 1",
      [email, name]
    );

    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Authentication Successful",
        userName: existingUser.name,
        email: existingUser.email
      });
    } else {
      const newUser = await pool.query(
        "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, username, email",
        [username, email]
      );
      return res.status(200).send({
        success: true,
        message: "Authentication Successful",
        userName: newUser.name,
        email: newUser.email
      });
    }



  } catch (error) {
    console.log("error in backend during google auth", error);
    return res.status(500).send({
      success: false,
      message: "Authentication failed",
    });
  }



});

export default router;