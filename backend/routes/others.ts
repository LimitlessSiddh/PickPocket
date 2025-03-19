import express from "express";
import pool from "../config/db.ts";

const router = express.Router();

router.get("/:userName", async (req: AuthReq, res: AuthRes) => {
    try {
        const userName: string = req.params.userName;

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
                id : wantedUser.id,
                email: wantedUser.email,
                userName: wantedUser.username,
                points: wantedUser.points
            }
        })


    } catch (error) {
        res.status(500).json({
            message: "Error finding user"
        });
        console.log(error);
    }
})