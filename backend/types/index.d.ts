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
        longest_loss_streak: number ;
    }

    interface AuthReq extends Request {
        user?: any;
        file?: any;
    }

    interface AuthRes extends Response {
        user?: any;
    }

    type Bet = {
        id: number;
        user_id: number;
        teams?: string;
        team_selected?: string;
        sport_key: string;
        odds: number;
        match_id: number;
        created_at?: string | null;
        updated_at?: string | null;
    }

    type PastBet = Bet & {
        result: string;
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