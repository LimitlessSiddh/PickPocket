import { useState, useEffect } from "react";
import axios from "axios";
import BetSlip from "../components/BetSlip";

const BettingPage = ({ user, bets, setBets, setShowBetSlip }: BettingPageProps) => {
  const [odds, setOdds] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number>(0);
  const CACHE_DURATION = 300000;
  const API_KEY = "API_KEY";

  useEffect(() => {
    const fetchOdds = async () => {
      const now = Date.now();
      if (now - lastFetched < CACHE_DURATION) {
        console.log("⏳ Using cached odds data.");
        return;
      }

      try {
        console.log("🔍 Fetching odds...");
        const response = await axios.get(
          `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/`,
          {
            params: {
              apiKey: API_KEY,
              regions: "us",
              markets: "h2h",
              oddsFormat: "decimal",
            },
          }
        );

        if (response.data.error_code === "OUT_OF_USAGE_CREDITS") {
          console.error(" API Quota Exceeded. Stopping requests.");
          setError("API quota exceeded. Try again later.");
          return;
        }

        setOdds(response.data);
        setLastFetched(now);
        console.log("Odds Fetched:", response.data);
      } catch (error) {
        console.error(" Error fetching odds:", error);
        setError("Failed to load betting odds.");
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [lastFetched]);

  type Match = {
    id: number;
    home_team: string;
    away_team: string;
    sport_key: string;
    sport_title: string;
    bookmakers: {
      title: string;
      markets: {
        key: string;
        outcomes: {
          name: string;
          price: number;
        }[];
      }[];
    }[];
  }

  type Outcome = {
    price: number;
    name: string;
  }

  const addToBetSlip = (match: Match, outcome: Outcome) => {
    if (!user) {
      alert("You must be logged in to place a bet.");
      return;
    }



    const newBet = {
      match_id: match.id,
      team_selected: outcome.name,
      odds: outcome.price,
      sport_key: match.sport_key,
      teams: `${match.home_team} vs ${match.away_team}`,
      id: Date.now(), // Using a timestamp as an ID
      user_id: user.id, // Assuming `user` has an `id` property
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setBets([...bets, newBet]);
    setShowBetSlip(true);
  };

  return (
    <div className="betting-container">
      <h2 className="betting-title">📊 Latest Betting Odds</h2>

      {loading && <p className="loading-message">Loading odds...</p>}
      {error && <p className="error-message">❌ {error}</p>}

      {!loading && !error && odds.length > 0 && (
        <div className="odds-grid">
          {odds.map((match: Match) => (
            <div key={match.id} className="bet-card">
              <h3 className="sport-title">{match.sport_title}</h3>
              <p className="match-title">{match.home_team} vs {match.away_team}</p>

              <div className="odds-container">
                {match.bookmakers[0]?.markets[0]?.outcomes.map((outcome) => (
                  <button
                    key={outcome.name}
                    className="bet-button"
                    onClick={() => addToBetSlip(match, outcome)}
                  >
                    {outcome.name}: {outcome.price}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {user && <BetSlip bets={bets} setBets={setBets} user={user} setShowBetSlip={setShowBetSlip} />}
    </div>
  );
};

export default BettingPage;
