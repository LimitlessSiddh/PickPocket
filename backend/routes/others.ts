import express from "express";
import pool from "../config/db.ts";

const router = express.Router();

router.get("/:userName", async (req: AuthReq, res: AuthRes) => {
    try {
        const { userName } = req.params;

        const wantedUserQuery = await pool.query(`
                Select * from users
                where username = $1
                limit 1
            `, [userName]
        );

        if (wantedUserQuery.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const wantedUser: User = wantedUserQuery.rows[0];

        res.status(200).json({
            wantedUser: {
                id: wantedUser.id,
                email: wantedUser.email,
                username: wantedUser.username,
                points: wantedUser.points
            }
        })


    } catch (error) {
        res.status(500).json({
            message: "Error finding user"
        });
        console.log(error);
    }
});

router.get("/:userName/bets", async (req: AuthReq, res: AuthRes) => {
    try {
        const { userName } = req.params;


        const wantedUserBetsQuery = await pool.query(`
            Select bets.id, match_id, team_selected, odds, amount_wagered, result, winnings, profit_loss, sport_key from bets
            left join users on bets.user_id = users.id
            where users.username = $1
            limit 1;
        `, [userName]
        );

        if (wantedUserBetsQuery.rows === 0) {
            res.status(400).json({
                message: "No bets placed yet"
            })
        }

        const wantedUserBets: Bet[] = wantedUserBetsQuery.rows;

        res.status(200).json({
            bets: wantedUserBets
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error getting this user's bets"
        })
    }

})

export default router;
