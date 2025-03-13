import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req: AuthReq, res: AuthRes) => {
  try {
    const leaderboardQuery = await pool.query(`
      SELECT 
        u.id,
        u.username,
        COUNT(b.id) AS total_bets,
        SUM(CASE WHEN b.result = 'win' THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN b.result = 'loss' THEN 1 ELSE 0 END) AS losses,
        ROUND(
          100.0 * SUM(CASE WHEN b.result = 'win' THEN (b.odds - 1) ELSE 0 END) / NULLIF(COUNT(b.id), 0), 
          2
        ) AS roi,
        u.longest_win_streak,
        u.longest_loss_streak
      FROM users u
      LEFT JOIN bets b ON u.id = b.user_id
      GROUP BY u.id, u.username
      ORDER BY roi DESC NULLS LAST, total_bets DESC NULLS LAST;
    `);

    res.json(leaderboardQuery.rows);
  } catch (error) {
    console.error("Leaderboard Fetch Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

export default router;