import express from "express";
import axios from "axios";
import pool from "../config/db.ts";
import authMiddleware from "../middleware/authMiddleware.ts";
import dotenv from "dotenv";
import { validateBets } from "./validateBets.ts";
import { v4 as uuidv4 } from "uuid"; // ✅ For generating parlay IDs

dotenv.config();

const router = express.Router();
const ODDS_API_KEY: string = process.env.ODDS_API_KEY!;
const ODDS_API_URL = "https://api.the-odds-api.com/v4/sports/";

// ✅ POST: Submit Single or Parlay Bet
router.post("/", authMiddleware, async (req: AuthReq, res: AuthRes) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    const { bets } = req.body;
    const userId = req.user.id;

    if (!bets || !Array.isArray(bets) || bets.length === 0) {
      return res.status(400).json({ message: "No bets provided." });
    }

    const isParlay = bets.length > 1;
    const parlayId = isParlay ? uuidv4() : null;

    const insertedBets: Bet[] = [];

    for (const bet of bets) {
      const { match_id, team_selected, odds, amount_wagered, sport_key } = bet;

      if (!match_id || !team_selected || !odds || !sport_key) {
        return res.status(400).json({ message: "Missing required fields in bet." });
      }

      const result = await pool.query(
        `INSERT INTO bets (
          user_id, match_id, team_selected, odds, amount_wagered, result, winnings,
          profit_loss, sport_key, created_at, parlay_id
        ) VALUES (
          $1, $2, $3, $4, $5, 'pending', 0, 0, $6, NOW(), $7
        ) RETURNING *`,
        [userId, match_id, team_selected, odds, amount_wagered || 0, sport_key, parlayId]
      );

      insertedBets.push(result.rows[0]);
    }

    // ✅ Trigger validation right after submission
    const validationResult = await validateBets();

    res.status(201).json({
      message: isParlay ? "Parlay placed!" : "Single bet placed!",
      bets: insertedBets,
      validation: validationResult,
    });
  } catch (error) {
    console.error("❌ Betting Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// ✅ GET: Fetch All Bets (for frontend display)
router.get("/", async (_req: AuthReq, res: AuthRes) => {
  try {
    const bets = await pool.query("SELECT * FROM bets ORDER BY created_at DESC");
    res.json(bets.rows);
  } catch (error) {
    console.error("❌ Error fetching bets:", error);
    res.status(500).json({ message: "Server error while fetching bets." });
  }
});


router.get("/stats", authMiddleware, async (req: AuthReq, res: AuthRes) => {
  try {
    const userId = req.user.id;

    const statsQuery = await pool.query(
      `
      SELECT 
        COUNT(*) AS total_bets,
        SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) AS total_wins,
        SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) AS total_losses
      FROM bets
      WHERE user_id = $1
      `,
      [userId]
    );

    const stats = statsQuery.rows[0];
    res.status(200).json(stats);
  } catch (error) {
    console.error("❌ Error fetching betting stats:", error);
    res.status(500).json({ message: "Failed to fetch betting stats." });
  }
});

export default router;

