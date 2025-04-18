import express from "express";
import pool from "../config/db.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import admin from "../config/firebaseAdmin.ts";

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET!;

const router = express.Router();
router.use(cookieParser());

router.post("/register", async (req: AuthReq, res: AuthRes) => {
  try {
    const { username, email, password } = req.body;
    console.log("🔍 Incoming Registration Request:", { username, email });

    const existingUser = await pool.query(
      "SELECT username, email FROM users WHERE email = $1 AND username = $2 LIMIT 1",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      console.log("Email or Username already exists:", existingUser.rows[0]);
      return res.status(400).json({ message: "Email or Username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    const user = newUser.rows[0];

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("User registered successfully:", user.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({ message: "Registration successful", token, user });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

router.post("/login", async (req: AuthReq, res: AuthRes) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Incoming Login Request:", email);

    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
    if (userQuery.rows.length === 0) {
      console.log("No user found with this email");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = userQuery.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Incorrect password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful:", user.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successful", token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

router.post("/logout", (req: AuthReq, res: AuthRes) => {

  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

const authenticateUser = (req: AuthReq, res: AuthRes, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("No token found in request.");
      return res.status(401).json({ message: "Unauthorized. No token found." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

router.get("/profile", authenticateUser, async (req: AuthReq, res: AuthRes) => {
  try {
    const userQuery = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [req.user.id]
    );

    if (userQuery.rows.length === 0) {
      console.log("No user found with ID:", req.user.id);
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(userQuery.rows[0]);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

router.post("/googleAuth", async (req: AuthReq, res: AuthRes) => {
  const token = req.body.token;
  try {
    const decoded_token = await admin.auth().verifyIdToken(token);
    const email = decoded_token.email;
    const username = decoded_token.name;
    let user: User;

    const existingUser = await pool.query(
      "SELECT id, username, email FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      user = existingUser.rows[0];
    } else {
      const newUser = await pool.query(
        "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING id, username, email",
        [email, username]
      );
      user = newUser.rows[0];
    }

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 3600000, 
    });

    return res.status(200).send({
      success: true,
      message: "Google Authentication Successful",
      user: { id: user.id, email: user.email, username: user.username },
      jwtToken: jwtToken
    });

  } catch (error) {
    console.log("Error in backend during Google auth", error);
    return res.status(500).send({
      success: false,
      message: "Authentication failed",
    });
  }
});


export default router;