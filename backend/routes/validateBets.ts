import pool from "../config/db.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const ODDS_API_KEY = process.env.ODDS_API_KEY;
const ODDS_API_URL = "https://api.the-odds-api.com/v4/sports/";
const MAX_API_RETRIES = 3;

/**
 * Validate & Update Bets from API
 * - Handles API failures gracefully
 * - Retries API calls up to MAX_API_RETRIES times
 * - Prevents quota overuse
 * - Ensures each sport is fetched only once per cycle
 */
async function validateBets() {
  try {
    console.log("🔄 Running bet validation...");

    const pendingBets = await pool.query("SELECT * FROM bets WHERE result = 'pending'");
    if (pendingBets.rows.length === 0) {
      console.log("No pending bets to validate.");
      return { message: "No pending bets to validate." };
    }

    let updatedBets: PastBet[] = [];
    const fetchedSports = new Set();

    for (let bet of pendingBets.rows) {
      if (!bet.sport_key) continue;
      if (fetchedSports.has(bet.sport_key)) {
        console.log(`⚠️ Skipping duplicate API call for ${bet.sport_key}`);
        continue;
      }

      let retryCount = 0;
      let success = false;

      while (retryCount < MAX_API_RETRIES && !success) {
        try {
          console.log(`🔄 Fetching results for sport: ${bet.sport_key}, Attempt: ${retryCount + 1}`);
          const response = await axios.get(
            `${ODDS_API_URL}${bet.sport_key}/scores/`,
            { params: { apiKey: ODDS_API_KEY } }
          );

          if (response.data.error_code === "OUT_OF_USAGE_CREDITS") {
            console.error("API Quota Exceeded. Stopping validation.");
            return { message: "API quota exceeded. Try again later." };
          }

          fetchedSports.add(bet.sport_key); //Mark this sport as fetched

          const match = response.data.find((m) => m.id === bet.match_id);
          if (!match || !match.completed) break;

          console.log(`Match ${bet.match_id} completed. Checking winner...`);
          const homeScore: Score = match.scores?.find((s) => s.name === match.home_team)?.score;
          const awayScore: Score = match.scores?.find((s) => s.name === match.away_team)?.score;

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
          success = true;
        } catch (error) {
          console.error(`Error validating bet ${bet.id}, Attempt ${retryCount + 1}:`, error);
          retryCount++;
        }
      }
    }

    return { message: "Bets validated successfully!", updatedBets };
  } catch (error) {
    console.error("Critical error validating bets:", error);
    return { message: "Server error during bet validation." };
  }
}

export { validateBets };



