import { useState, useEffect } from "react";
import axios from "axios";
import BetSlip from "../components/BetSlip";

const BettingPage = ({ user, bets, setBets, setShowBetSlip }) => {
  const [odds, setOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(0);
  const API_KEY = "5547690b7fe24b9ec6904dee468982d0";
  const CACHE_DURATION = 300000; // ✅ Cache odds for 5 minutes (300,000 ms)

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
          console.error("❌ API Quota Exceeded. Stopping requests.");
          setError("API quota exceeded. Try again later.");
          return;
        }

        setOdds(response.data);
        setLastFetched(now);
        console.log("✅ Odds Fetched:", response.data);
      } catch (error) {
        console.error("❌ Error fetching odds:", error);
        setError("Failed to load betting odds.");
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [lastFetched]);

  const addToBetSlip = (match, outcome) => {
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
    };

    setBets([...bets, newBet]);
    setShowBetSlip(true);
  };

  return (
    <div className="betting-container">
      <h2 className="betting-title">📊 Latest Betting Odds</h2>

      {loading && <p className="loading-message">🔄 Loading odds...</p>}
      {error && <p className="error-message">❌ {error}</p>}

      {!loading && !error && odds.length > 0 && (
        <div className="odds-grid">
          {odds.map((match) => (
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
