import express from "express";
import axios from "axios";
import pool from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import dotenv from "dotenv";


dotenv.config();

const router = express.Router();
const ODDS_API_KEY: string = process.env.ODDS_API_KEY!;
const ODDS_API_URL = "https://api.the-odds-api.com/v4/sports/";


router.post("/", authMiddleware, async (req: AuthReq, res: AuthRes) => {

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "You must be logged in to place a bet." });
  }

  try {
    const { bets } = req.body;
    const userId = req.user.id;

    if (!bets || bets.length === 0) {
      return res.status(400).json({ message: "No bets provided." });
    }

    const insertedBets: Bet[] = [];
    for (const bet of bets) {
      const { match_id, team_selected, odds, sport_key } = bet;

      if (!match_id || !team_selected || !odds || !sport_key) {
        return res.status(400).json({ message: "Invalid bet format. Missing required fields." });
      }

      const response = await axios.get(
        `${ODDS_API_URL}${sport_key}/scores/`,
        { params: { apiKey: ODDS_API_KEY } }
      );
      const match = response.data.find((m) => m.id === match_id);
      if (!match) {
        return res.status(400).json({ message: "Invalid match ID. Match not found in API." });
      }

      const newBet = await pool.query(
        `INSERT INTO bets (user_id, match_id, team_selected, odds, sport_key, result) 
         VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
        [userId, match.id, team_selected, odds, sport_key]
      );

      insertedBets.push(newBet.rows[0]);
    }

    res.status(201).json({ message: "Bets placed successfully!", bets: insertedBets });
  } catch (error) {
    console.error("Betting Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

router.put("/update-results", async (req: AuthReq, res: AuthRes) => {
  try {
    console.log("🔄 Running bet validation...");
    const pendingBets = await pool.query("SELECT * FROM bets WHERE result = 'pending'");
    if (pendingBets.rows.length === 0) {
      return res.json({ message: "No pending bets to validate." });
    }

    let updatedBets: Bet[] | PastBet[] = [];
    for (let bet of pendingBets.rows) {
      if (!bet.sport_key) continue;
      try {

        const response = await axios.get(
          `${ODDS_API_URL}${bet.sport_key}/scores/`,
          { params: { apiKey: ODDS_API_KEY } }
        );

        const match = response.data.find((m: Match) => m.id === bet.match_id);
        if (!match || !match.completed) continue;

        console.log(`Match ${bet.match_id} completed. Checking winner...`);
        const homeScore = match.scores?.find((s: Score) => s.name === match.home_team)?.score;
        const awayScore = match.scores?.find((s: Score) => s.name === match.away_team)?.score;

        let winningTeam = homeScore > awayScore ? match.home_team : match.away_team;
        let matchResult = winningTeam === bet.team_selected ? "win" : "loss";
        let profitLoss = matchResult === "win" ? (bet.odds - 1) * 100 : -100;

        await pool.query(
          "UPDATE bets SET result = $1, profit_loss = $2 WHERE id = $3",
          [matchResult, profitLoss, bet.id]
        );

        updatedBets.push({
          id: bet.id,
          user_id: bet.user_id,
          sport_key: bet.sport_key,
          odds: bet.odds,
          match_id: bet.match_id,
          result: matchResult,
          profit_loss: profitLoss
        });
      } catch (error) {
        console.error(`Error validating bet ${bet.id}:`, error);
      }
    }

    res.json({ message: "Bets validated successfully!", updatedBets });
  } catch (error) {
    console.error("Error validating bets:", error);
    res.status(500).json({ message: "Server error during bet validation." });
  }
});

export default router;
