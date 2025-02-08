import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Protect routes

const router = express.Router();

// ✅ Place a bet
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, odds, outcome } = req.body;
    const userId = req.user.id; // Get user from JWT

    if (!amount || !odds) {
      return res.status(400).json({ message: "Amount and odds are required." });
    }

    const newBet = await pool.query(
      "INSERT INTO bets (user_id, amount, odds, outcome) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, amount, odds, outcome || "pending"]
    );

    res.status(201).json(newBet.rows[0]);
  } catch (error) {
    console.error("❌ Betting Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// ✅ Get user's betting stats
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const statsQuery = await pool.query(`
      SELECT 
        COUNT(*) AS total_bets,
        SUM(CASE WHEN outcome = 'win' THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN outcome = 'loss' THEN 1 ELSE 0 END) AS losses,
        SUM(amount * odds) AS potential_payout,
        SUM(CASE WHEN outcome = 'win' THEN (amount * odds) - amount ELSE -amount END) AS profit_loss
      FROM bets WHERE user_id = $1
    `, [userId]);

    res.json(statsQuery.rows[0]);
  } catch (error) {
    console.error("❌ Betting Stats Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

export default router;

