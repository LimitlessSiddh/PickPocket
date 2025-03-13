import Profile from "../pages/Profile";

declare global{
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

    type Bet = {
        id: number;
        user_id: number;
        teams: string;
        team_selected: string;
        sport_key: string;
        odds: number;
        match_id: number;
        created_at: string | null;
        updated_at: string | null;
    }

    type PastBet = Bet & {
        result: string;
        profit_loss: number;
    }

    interface BetSlipProps {
        bets: Bet[];
        setBets: React.Dispatch<React.SetStateAction<Bet[]>>;
        user: User | null;
        setShowBetSlip: React.Dispatch<React.SetStateAction<boolean>>;
    }

    interface GoogleButtonProps {
        setUser: React.Dispatch<React.SetStateAction<User | null>>;
        setError: React.Dispatch<React.SetStateAction<string | null>>;

    }

    interface NavbarProps {
        user: User | null;
        setUser: React.Dispatch<React.SetStateAction<User| null>>;
    }

    interface ProfileCardProps{
        user: User;

        stats: {
            totalBets: number;
            betsWon: number;
            betsLost: number;
            roi: number;
        }

    }

    interface BettingPageProps extends BetSlipProps{
        setError: React.Dispatch<React.SetStateAction<string | null>>;
    }

    interface ProfilePageProps {
        user: User;
    }

    interface LoginPageProps {
        setUser: React.Dispatch<React.SetStateAction<User | null>>;
    }
    
}

export {}