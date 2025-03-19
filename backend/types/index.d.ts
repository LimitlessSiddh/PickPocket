import { Request, Response, NextFunction } from "express";

declare global {

    type User = {
        id: number;
        username: string;
        email: string;
        avatar: string | null;
        created_at: string | null;
        total_bets: number;
        total_wins: number;
        total_losses: number;
        points: number;
        current_win_streak: number;
        current_loss_streak: number;
        longest_win_streak: number;
        longest_loss_streak: number;
    }

    type Subscription = {
        price: number;
        sub_to: User;
        subscriber: User;
        created_at: string | null;
        updated_at: string | null;
    }

    interface AuthReq extends Request {
        user?: any;
        file?: any;
    }

    interface AuthRes extends Response {
        user?: any;
    }



    interface Bet {
        id: number;
        user_id: number;
        match_id: string;
        team_selected?: string;
        odds: number;
        amount_wagered?: number;
        result: string;
        winnings?: number;
        profit_loss?: number;
        sport_key: string;
    }

    interface PastBet extends Bet {
        profit_loss: number;
    }


    type Score = {
        name: string;
        score: number;
    };


    type Match = {
        id: number;
        home_team: string;
        away_team: string;
        sport_key: string;
        scores?: Score[];
        completed?: boolean;
    }


}
export { }