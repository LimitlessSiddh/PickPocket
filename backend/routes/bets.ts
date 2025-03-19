import express from "express";
import axios from "axios";
import pool from "../config/db";
import authMiddleware from "../middleware/authMiddleware";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const ODDS_API_KEY: string = process.env.ODDS_API_KEY!;
const ODDS_API_URL = "https://api.the-odds-api.com/v4/sports/";

// ✅ Define Types for Requests and Bets
interface AuthReq extends express.Request {
  user?: { id: number };
}

interface AuthRes extends express.Response {}

interface Bet {
  id: number;
  user_id: number;
  match_id: string;
  team_selected: string;
  odds: number;
  amount_wagered: number;
  result: string;
  winnings: number;
  profit_loss?: number;
  sport_key: string;
}

interface PastBet extends Bet {
  profit_loss: number;
}

// ✅ POST Route: Submit a Bet
router.post("/", authMiddleware, async (req: AuthReq, res: AuthRes) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    const { bets } = req.body;
    const userId = req.user.id;

    if (!bets || bets.length === 0) {
      return res.status(400).json({ message: "No bets provided." });
    }

    console.log("📌 Incoming Bet Data:", bets);

    const insertedBets: Bet[] = [];
    for (const bet of bets) {
      const { match_id, team_selected, odds, amount_wagered, sport_key } = bet;

      if (!match_id || !team_selected || !odds || !amount_wagered || !sport_key) {
        console.log("❌ Missing required fields:", bet);
        return res.status(400).json({ message: "Invalid bet format. Missing required fields." });
      }

      // ✅ Fetch Match Data to Ensure Match Exists
      const response = await axios.get(`${ODDS_API_URL}${sport_key}/scores/`, {
        params: { apiKey: ODDS_API_KEY },
      });

      if (!response.data || response.data.length === 0) {
        console.log("❌ API Error: No matches found for", sport_key);
        return res.status(400).json({ message: "API error: Match not found." });
      }

      const match = response.data.find((m: { id: string }) => m.id === match_id);
      if (!match) {
        console.log("❌ Invalid Match ID:", match_id);
        return res.status(400).json({ message: "Invalid match ID. Match not found." });
      }

      // ✅ Insert Bet into Database
      const newBet = await pool.query(
        `INSERT INTO bets (user_id, match_id, team_selected, odds, amount_wagered, result, winnings, profit_loss, sport_key, created_at) 
         VALUES ($1, $2, $3, $4, $5, 'pending', 0, 0, $6, NOW()) RETURNING *`,
        [userId, match.id, team_selected, odds, amount_wagered, sport_key]
      );

      console.log("✅ Bet Inserted:", newBet.rows[0]);
      insertedBets.push(newBet.rows[0]);
    }

    res.status(201).json({ message: "Bet placed successfully!", bets: insertedBets });
  } catch (error) {
    console.error("❌ Betting Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// ✅ PUT Route: Update Bet Results
router.put("/update-results", async (req: AuthReq, res: AuthRes) => {
  try {
    console.log("🔄 Running bet validation...");
    const pendingBets = await pool.query("SELECT * FROM bets WHERE result = 'pending'");

    if (pendingBets.rows.length === 0) {
      return res.json({ message: "No pending bets to validate." });
    }

    let updatedBets: PastBet[] = [];

    for (let bet of pendingBets.rows) {
      if (!bet.sport_key) continue;
      try {
        // ✅ Fetch Match Scores
        const response = await axios.get(`${ODDS_API_URL}${bet.sport_key}/scores/`, {
          params: { apiKey: ODDS_API_KEY },
        });

        if (!response.data || response.data.length === 0) {
          console.error(`❌ No match data for bet ID ${bet.id}`);
          continue;
        }

        const match = response.data.find((m: { id: string; completed: boolean }) => m.id === bet.match_id);
        if (!match || !match.completed) continue;

        console.log(`✅ Match ${bet.match_id} completed. Checking winner...`);

        // ✅ Extract Scores
        const homeScore = match.scores?.find((s: { name: string }) => s.name === match.home_team)?.score;
        const awayScore = match.scores?.find((s: { name: string }) => s.name === match.away_team)?.score;

        if (homeScore === undefined || awayScore === undefined) {
          console.error(`❌ Missing scores for match ${bet.match_id}`);
          continue;
        }

        let winningTeam = homeScore > awayScore ? match.home_team : match.away_team;
        let matchResult: "win" | "loss" = winningTeam === bet.team_selected ? "win" : "loss";

        // ✅ Calculate Profit & Loss
        let winnings = matchResult === "win" ? bet.amount_wagered * bet.odds : 0;
        let profitLoss = matchResult === "win" ? winnings - bet.amount_wagered : -bet.amount_wagered;

        // ✅ Update Bet Result in Database
        await pool.query(
          "UPDATE bets SET result = $1, profit_loss = $2, winnings = $3 WHERE id = $4",
          [matchResult, profitLoss, winnings, bet.id]
        );

        updatedBets.push({
          id: bet.id as number,
          user_id: bet.user_id as number,
          sport_key: bet.sport_key as string,
          odds: bet.odds as number,
          match_id: bet.match_id as string,
          result: matchResult as "win" | "loss",
          profit_loss: profitLoss as number,
          team_selected: bet.team_selected as string,
          winnings: winnings as number,
          amount_wagered: bet.amount_wagered as number,
        });
      } catch (error) {
        console.error(`❌ Error validating bet ${bet.id}:`, error);
      }
    }

    res.json({ message: "Bets validated successfully!", updatedBets });
  } catch (error) {
    console.error("❌ Error validating bets:", error);
    res.status(500).json({ message: "Server error during bet validation." });
  }
});

// ✅ Debug Route: Fetch All Bets
router.get("/", async (req: AuthReq, res: AuthRes) => {
  try {
    console.log("📌 Fetching All Bets...");
    const bets = await pool.query("SELECT * FROM bets ORDER BY created_at DESC");
    res.json(bets.rows);
  } catch (error) {
    console.error("❌ Error fetching bets:", error);
    res.status(500).json({ message: "Server error while fetching bets." });
  }
});

export default router;

