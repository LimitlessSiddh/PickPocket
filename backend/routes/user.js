import express from "express";
import pool from "../config/db.js"; // ✅ Import pool correctly
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get User Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const userQuery = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [userId]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: userQuery.rows[0] });
  } catch (error) {
    console.error("❌ Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

export default router;


