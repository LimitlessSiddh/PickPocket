declare global {

    type User = {
        score: ReactNode;
        level: ReactNode;
        id: number;
        username: string;
        email: string;
        avatar: string | null;
        created_at: string | null;
        total_bets: number;
        total_wins: number;
        total_losses: number;
        points: number;
        tier: string;
        current_win_streak: number;
        current_loss_streak: number;
        longest_win_streak: number;
        longest_loss_streak: number;
        subs: User[];
        subscriptions: Subscription[];
        subCount: number
    }

    type Subscription = {
        id : number;
        price: number;
        sub_to: User;
        subscriber: User;
        created_at: string;
        updated_at: string;
        sub_to_name? : string;
        subscriber_name? : string;
        subscriber_id? : number;
        sub_to_id? : number

    }

    interface Bet {
        id: number;
        user_id: number;
        match_id: string | number;
        team_selected?: string;
        odds: number;
        amount_wagered?: number;
        result?: string;
        winnings?: number;
        profit_loss: number;
        sport_key: string;
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
        fetchUserBets?: () => Promise<void>;
        returnPercentage?: number;
        setReturnPercentage?: React.Dispatch<React.SetStateAction<number>>;

    }

    interface GoogleButtonProps {
        setUser: React.Dispatch<React.SetStateAction<User | null>>;
        setError: React.Dispatch<React.SetStateAction<string | null>>;

    }

    interface NavbarProps {
        user: User | null;
        setUser: React.Dispatch<React.SetStateAction<User | null>>;
    }

    interface ProfileCardProps {
        user: User;

        stats: {
            totalBets: number;
            betsWon: number;
            betsLost: number;
            roi: number;
        }

    }

    interface BettingPageProps extends BetSlipProps {
        setError?: React.Dispatch<React.SetStateAction<string | null>>;
    }

    interface ProfilePageProps {
        user: User;
        fetchUserBets: () => Promise<void>;
    }

    interface OtherUserProps {
        user: User;
    }

    interface LoginPageProps {
        setUser: React.Dispatch<React.SetStateAction<User | null>>;
    }

    interface RegisterPageProps extends LoginPageProps {
    }

    interface SubscriptionPageProps {
        user: User;
        subscription : Subscription[];
    }

    interface SetUsernameProps {
        email: string;
        setUser: Function;
        setError?: React.Dispatch<React.SetStateAction<string | null>>;
    }

}

export { }