import express from "express";
import pool from "../config/db.ts";
import authMiddleware from "../middleware/authMiddleware.ts";

const router = express.Router();

router.get("/getSubscriptions", authMiddleware, async (req: AuthReq, res: AuthRes) => {
    try {
        const userId = req.user.id;

        const query = await pool.query(
            "Select * from subscriptions where subscriber_id = $1 ", [userId]
        )

        const subscriptions = query.rows;

        res.status(200).json({ subscriptions: subscriptions })

    } catch (error: any) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message })
            console.log("Identified error in backend subs", error.message);
        } else {
            res.status(200).json({ unknown_error: error })
            console.log("Unknown error in backend subs", error)
        }

    }
})


router.post("/subscribe", authMiddleware, async (req: AuthReq, res: AuthRes) => {
    try {
        const signedInUserId = req.user.id;
        const signedInUserName = req.user.username;
        const { wantedUserID, wantedUserName } = req.body;


        await pool.query(`
                insert into subscriptions (subscriber_id, sub_to_id, price, subscriber_name, sub_to_name)
                values ($1, $2, 0, $3, $4);
            `, [signedInUserId, wantedUserID, signedInUserName, wantedUserName ])

        res.status(200).json({
            message: `${signedInUserId} Succesfully subscribed to ${wantedUserID}`
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error when subscribing to user"
        })
    }
})

router.post("/unsubscribe", authMiddleware, async (req: AuthReq, res: AuthRes) => {
    try {
        const signedInUserId = req.user.id;
        const { wantedUserID } = req.body;
        const timestamp = Date.now();


        await pool.query(`
                delete from subscriptions 
                where subscriber_id = $1 and sub_to_id = $2;
            `, [signedInUserId, wantedUserID])

        res.status(200).json({
            message: `${signedInUserId} Succesfully unsubscribed from ${wantedUserID}`
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error when unsubscribing user"
        })
    }
})

export default router;