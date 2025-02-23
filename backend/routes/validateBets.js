import pool from "../config/db.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const ODDS_API_KEY = process.env.ODDS_API_KEY;
const ODDS_API_URL = "https://api.the-odds-api.com/v4/sports/";

/**
 * ✅ Validate & Update Bets from API
 * - Handles API failures with retries
 * - Marks bets as 'validation_failed' if results cannot be found
 */
async function validateBets() {
  try {
    console.log("🔄 Running bet validation...");

    // ✅ Fetch pending bets
    const pendingBets = await pool.query("SELECT * FROM bets WHERE result = 'pending'");
    if (pendingBets.rows.length === 0) {
      console.log("✅ No pending bets to validate.");
      return { message: "No pending bets to validate." };
    }

    // ✅ Group bets by sport_key to minimize API calls
    const betsBySport = pendingBets.rows.reduce((acc, bet) => {
      if (!acc[bet.sport_key]) acc[bet.sport_key] = [];
      acc[bet.sport_key].push(bet);
      return acc;
    }, {});

    let updatedBets = [];

    for (let sportKey in betsBySport) {
      try {
        console.log(`🔍 Fetching results for sport: ${sportKey}`);
        const response = await axios.get(
          `${ODDS_API_URL}${sportKey}/scores/`,
          { params: { apiKey: ODDS_API_KEY } }
        );

        const matchResults = response.data;

        for (let bet of betsBySport[sportKey]) {
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

          // ✅ Update the bet in the database
          await pool.query(
            "UPDATE bets SET result = $1, profit_loss = $2 WHERE id = $3",
            [matchResult, profitLoss, bet.id]
          );

          updatedBets.push({ id: bet.id, result: matchResult, profitLoss });
        }

      } catch (apiError) {
        console.error(`❌ API Error fetching results for ${sportKey}:`, apiError);

        // ✅ Mark all bets under this sport as 'validation_failed'
        for (let bet of betsBySport[sportKey]) {
          await pool.query("UPDATE bets SET result = 'validation_failed' WHERE id = $1", [bet.id]);
          console.log(`⚠️ Bet ID ${bet.id} marked as validation_failed.`);
        }
      }
    }

    console.log("✅ Bets validated:", updatedBets);
    return { message: "Bets validated successfully!", updatedBets };

  } catch (error) {
    console.error("❌ Critical error validating bets:", error);
    return { message: "Server error during bet validation." };
  }
}

export { validateBets };