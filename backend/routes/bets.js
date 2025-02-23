import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const ODDS_API_KEY = process.env.ODDS_API_KEY;
const ODDS_API_URL = "https://api.the-odds-api.com/v4/sports/";

/**
 * ✅ Place a Bet
 */
router.post("/", authMiddleware, async (req, res) => {
  console.log("🔍 Incoming Bet Request...");

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "You must be logged in to place a bet." });
  }

  try {
    const { betType, bets } = req.body;
    const userId = req.user.id;

    if (!bets || bets.length === 0) {
      return res.status(400).json({ message: "No bets provided." });
    }

    const insertedBets = [];

    for (const bet of bets) {
      const { match_id, team_selected, odds, sport_key } = bet;

      if (!match_id || !team_selected || !odds || !sport_key) {
        return res.status(400).json({ message: "Invalid bet format. Missing required fields." });
      }

      const newBet = await pool.query(
        `INSERT INTO bets (user_id, match_id, team_selected, odds, sport_key, result) 
         VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
        [userId, match_id, team_selected, odds, sport_key]
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
            100.0 * (SUM(CASE WHEN result = 'win' THEN (odds - 1) ELSE 0 END) - SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END)) / NULLIF(COUNT(*), 0), 
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
 * ✅ Get All Bets (For User)
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

/**
 * ✅ Validate & Update Bets from API
 */
async function validateBets() {
  try {
    console.log("🔄 Running bet validation...");

    const pendingBets = await pool.query("SELECT * FROM bets WHERE result = 'pending'");
    if (pendingBets.rows.length === 0) {
      console.log("✅ No pending bets to validate.");
      return { message: "No pending bets to validate." };
    }

    let updatedBets = [];

    for (let bet of pendingBets.rows) {
      if (!bet.sport_key) {
        console.error(`❌ Missing sport_key for bet ID ${bet.id}`);
        continue;
      }

      try {
        console.log("🔄 Fetching results for sport:", bet.sport_key);
        const response = await axios.get(
          `${ODDS_API_URL}${bet.sport_key}/scores/`,
          { params: { apiKey: ODDS_API_KEY } }
        );

        const matchResults = response.data;
        const match = matchResults.find((m) => m.id === bet.match_id);

        if (!match || !match.completed) {
          console.log(`⏳ Match ${bet.match_id} is not completed yet.`);
          continue;
        }

        console.log(`✅ Match ${bet.match_id} is completed. Checking winner...`);
        const homeScore = match.scores?.find((s) => s.name === match.home_team)?.score;
        const awayScore = match.scores?.find((s) => s.name === match.away_team)?.score;

        let winningTeam = homeScore > awayScore ? match.home_team : match.away_team;
        let matchResult = winningTeam === bet.team_selected ? "win" : "loss";

        console.log(`🎯 Bet ID ${bet.id} - Bet on: ${bet.team_selected} | Result: ${matchResult}`);

        let profitLoss = matchResult === "win" ? (bet.odds - 1) * 100 : -100;

        await pool.query(
          "UPDATE bets SET result = $1, profit_loss = $2 WHERE id = $3",
          [matchResult, profitLoss, bet.id]
        );

        updatedBets.push({ id: bet.id, result: matchResult, profitLoss });

      } catch (error) {
        console.error(`❌ Error validating bet ${bet.id}:`, error);
      }
    }

    console.log("✅ Bets validated:", updatedBets);
    return { message: "Bets validated successfully!", updatedBets };

  } catch (error) {
    console.error("❌ Error validating bets:", error);
    return { message: "Server error during bet validation." };
  }
}

// ✅ Export Router & Function (Fix Export)
export default router;
export { validateBets };