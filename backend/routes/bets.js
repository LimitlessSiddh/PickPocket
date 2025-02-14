import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Submit a bet
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { user_id, betType, bets } = req.body;

    if (!user_id || bets.length === 0) {
      return res.status(400).json({ message: "Invalid bet submission." });
    }

    for (const bet of bets) {
      await pool.query(
        "INSERT INTO bets (user_id, match_id, team_selected, odds, amount_wagered, result, winnings) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [user_id, bet.match_id, bet.teams, bet.odds, 0, "pending", 0]
      );
    }

    res.status(201).json({ message: "Bet submitted successfully!" });
  } catch (error) {
    console.error("❌ Betting Submission Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

export default router;
