import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ Protect routes

const router = express.Router();

/**
 * ✅ Place a Bet
 * - Prevents duplicate bets on the same match
 * - Stores bets as "pending" until results are updated
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { betType, bets } = req.body;
    const userId = req.user.id;

    if (!bets || bets.length === 0) {
      return res.status(400).json({ message: "No bets provided." });
    }

    const insertedBets = [];

    for (const bet of bets) {
      const { match_id, team_selected, odds } = bet;

      if (!match_id || !team_selected || !odds) {
        return res.status(400).json({ message: "Invalid bet format. Missing required fields." });
      }

      // 🚨 Prevent duplicate bets on the same match by the same user
      const existingBet = await pool.query(
        "SELECT * FROM bets WHERE user_id = $1 AND match_id = $2 AND team_selected = $3",
        [userId, match_id, team_selected]
      );

      if (existingBet.rows.length > 0) {
        return res.status(400).json({ message: "You have already placed a bet on this match." });
      }

      // ✅ Insert new bet (initially "pending" status)
      const newBet = await pool.query(
        `INSERT INTO bets (user_id, match_id, team_selected, odds, result) 
         VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
        [userId, match_id, team_selected, odds]
      );

      insertedBets.push(newBet.rows[0]);
    }

    res.status(201).json({ message: "Bets placed successfully!", bets: insertedBets });
  } catch (error) {
    console.error("❌ Betting Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

/**
 * ✅ Get User's Betting Stats
 * - Fetch total bets, win/loss count, and ROI (Return on Investment)
 */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const statsQuery = await pool.query(`
      SELECT 
        COUNT(*) AS total_bets,
        SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) AS losses,
        COALESCE(
          ROUND(
            100.0 * SUM(CASE WHEN result = 'win' THEN (odds - 1) ELSE 0 END) / NULLIF(COUNT(*), 0), 
            2
          ), 0
        ) AS roi
      FROM bets WHERE user_id = $1
    `, [userId]);

    res.json(statsQuery.rows[0]);
  } catch (error) {
    console.error("❌ Betting Stats Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

/**
 * ✅ Update Bet Result (Win/Loss)
 * - Updates a bet’s result and recalculates user stats
 */
router.put("/:betId/result", authMiddleware, async (req, res) => {
  try {
    const { result } = req.body;
    const { betId } = req.params;
    const userId = req.user.id;

    if (!["win", "loss"].includes(result)) {
      return res.status(400).json({ message: "Invalid result. Must be 'win' or 'loss'." });
    }

    // ✅ Fetch bet details
    const betQuery = await pool.query("SELECT * FROM bets WHERE id = $1 AND user_id = $2", [betId, userId]);
    if (betQuery.rows.length === 0) {
      return res.status(404).json({ message: "Bet not found" });
    }

    const bet = betQuery.rows[0];
    let profitLoss = 0;

    // ✅ Calculate Profit/Loss
    if (result === "win") {
      profitLoss = (bet.odds - 1) * 100; // ROI-based profit calculation
    } else if (result === "loss") {
      profitLoss = -100; // Assume full loss scenario
    }

    // ✅ Update Bet Result & Profit/Loss
    await pool.query(
      "UPDATE bets SET result = $1, profit_loss = $2 WHERE id = $3",
      [result, profitLoss, betId]
    );

    // ✅ Recalculate user ROI after update
    const updatedStats = await pool.query(`
      SELECT 
        COUNT(*) AS total_bets,
        SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) AS losses,
        COALESCE(
          ROUND(
            100.0 * SUM(CASE WHEN result = 'win' THEN (odds - 1) ELSE 0 END) / NULLIF(COUNT(*), 0), 
            2
          ), 0
        ) AS roi
      FROM bets WHERE user_id = $1
    `, [userId]);

    res.json({
      message: "Bet updated successfully!",
      betId,
      result,
      profitLoss,
      updatedStats: updatedStats.rows[0]
    });
  } catch (error) {
    console.error("❌ Error updating bet result:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

/**
 * ✅ Get All Bets (For User)
 * - Fetch all bets the user has placed
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const betsQuery = await pool.query(
      "SELECT * FROM bets WHERE user_id = $1 ORDER BY created_at DESC", 
      [userId]
    );
    res.json(betsQuery.rows);
  } catch (error) {
    console.error("❌ Error fetching bets:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

export default router;