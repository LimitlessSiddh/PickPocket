import express from "express";
import pool from "../config/db.ts";
import authMiddleware from "../middleware/authMiddleware.ts";

const router = express.Router();

router.get("/getSubscriptions", authMiddleware, async (req: AuthReq, res: AuthRes) => {
    try{
        const user = req.user;
        const userId = user.id;

        const query = await pool.query(
            "Select * from subscriptions where subscriber_id = $1 " , [userId]
        )

        user.subscriptions = query.rows;

        res.status(200).json({subscriptions: user.subscriptions})

    } catch (error: any){
        if(error instanceof Error){
            res.status(500).json({message: error.message})
            console.log("Identified error in backend subs", error.message);
        } else {
            res.status(200).json({unknown_error: error})
            console.log("Unknown error in backend subs", error)
        }

    }
})

router.get("/getSubscribers", authMiddleware, async (req: AuthReq, res: AuthRes) =>{
    try{

    }catch{

    }
})
