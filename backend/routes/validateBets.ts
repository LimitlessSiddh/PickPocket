import pool from "../config/db.ts";
import axios from "axios";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const ODDS_API_KEY = process.env.ODDS_API_KEY;
const ODDS_API_URL = "https://api.the-odds-api.com/v4/sports/";
const MAX_API_RETRIES = 3;
const K = 10;

const sportsWithScores = new Set([
  "basketball_nba",
  "soccer_epl",
  "americanfootball_nfl",
  "baseball_mlb",
  "icehockey_nhl",
]);

async function validateBets() {
  try {
    console.log("🔄 Running bet validation...");

    const pendingBetsQuery = await pool.query("SELECT * FROM bets WHERE result = 'pending'");
    const pendingBets: Bet[] = pendingBetsQuery.rows;

    if (pendingBets.length === 0) {
      console.log("No pending bets to validate.");
      return { message: "No pending bets to validate." };
    }

    const updatedBets: PastBet[] = [];

    // 🧠 Group bets by parlay_id (or single bet)
    const betGroups: Record<string, Bet[]> = {};
    for (const bet of pendingBets) {
      const key = bet.parlay_id || `single_${bet.id}`;
      if (!betGroups[key]) betGroups[key] = [];
      betGroups[key].push(bet);
    }

    for (const groupKey in betGroups) {
      const group = betGroups[groupKey];
      const isParlay = group.length > 1;

      let allResolved = true;
      let allWin = true;
      let totalOdds = 1;
      let user: User | null = null;

      // Fetch results for each pick
      for (const bet of group) {
        if (!sportsWithScores.has(bet.sport_key)) {
          console.log(`❌ Skipping unsupported sport: ${bet.sport_key}`);
          allResolved = false;
          break;
        }

        const response = await axios.get(`${ODDS_API_URL}${bet.sport_key}/scores/`, {
          params: { apiKey: ODDS_API_KEY },
        });

        const match = response.data.find((m: Match) => m.id === bet.match_id);
        if (!match || !match.completed) {
          console.log(`⏳ Match not completed yet: ${bet.match_id}`);
          allResolved = false;
          break;
        }

        const homeScore = match.scores?.find((s) => s.name === match.home_team)?.score;
        const awayScore = match.scores?.find((s) => s.name === match.away_team)?.score;

        if (homeScore === undefined || awayScore === undefined) {
          console.log(`⚠️ Missing scores. Marking as void: ${bet.match_id}`);
          await pool.query("UPDATE bets SET result = 'void', profit_loss = 0 WHERE id = $1", [bet.id]);
          allResolved = false;
          break;
        }

        const winningTeam = homeScore > awayScore ? match.home_team : match.away_team;
        const matchResult = winningTeam === bet.team_selected ? "win" : "loss";

        bet.result = matchResult;
        bet.profit_loss = matchResult === "win" ? Math.round((bet.odds - 1) * 100) : -100;
        bet.winnings = matchResult === "win" ? bet.profit_loss + 100 : 0;

        if (matchResult === "loss") allWin = false;

        totalOdds *= bet.odds;

        if (!user) {
          const userRes = await pool.query("SELECT * FROM users WHERE id = $1", [bet.user_id]);
          user = userRes.rows[0];
        }
      }

      if (!allResolved || !user) continue;

      const groupResult = allWin ? "win" : "loss";
      const rp = allWin
        ? Math.round(K * (1 - 1 / Math.log(totalOdds + 1)) * Math.log(totalOdds + 1))
        : 0;

      for (const bet of group) {
        await pool.query(
          "UPDATE bets SET result = $1, profit_loss = $2, winnings = $3 WHERE id = $4",
          [groupResult, bet.profit_loss, bet.winnings, bet.id]
        );

        updatedBets.push({
          id: bet.id,
          user_id: bet.user_id,
          match_id: bet.match_id,
          team_selected: bet.team_selected,
          odds: bet.odds,
          amount_wagered: bet.amount_wagered,
          result: groupResult,
          winnings: bet.winnings,
          profit_loss: bet.profit_loss!,
          sport_key: bet.sport_key,
          parlay_id: bet.parlay_id ?? null,
        });
      }

      if (groupResult === "win") {
        const newScore = user.score + rp;
        const newLevel = Math.floor(newScore / 10) + 1;
        const newWinStreak = user.current_win_streak + 1;

        await pool.query(`
          UPDATE users SET
            score = $1,
            level = $2,
            total_wins = total_wins + 1,
            current_win_streak = $3,
            longest_win_streak = GREATEST(longest_win_streak, $3),
            current_loss_streak = 0
          WHERE id = $4
        `, [newScore, newLevel, newWinStreak, user.id]);
      } else {
        const newLossStreak = user.current_loss_streak + 1;

        await pool.query(`
          UPDATE users SET
            total_losses = total_losses + 1,
            current_loss_streak = $1,
            longest_loss_streak = GREATEST(longest_loss_streak, $1),
            current_win_streak = 0
          WHERE id = $2
        `, [newLossStreak, user.id]);
      }
    }

    return { message: "Bets validated successfully!", updatedBets };
  } catch (error) {
    console.error("🔥 Critical error during bet validation:", error);
    return { message: "Server error during bet validation." };
  }
}

export { validateBets };