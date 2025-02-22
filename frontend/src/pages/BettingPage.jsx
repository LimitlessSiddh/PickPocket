import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/BettingPage.css";
import BetSlip from "../components/BetSlip";

const BettingPage = ({ user }) => {
  const [odds, setOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [betSlip, setBetSlip] = useState([]);
  const [showBetSlip, setShowBetSlip] = useState(false); // ✅ Hide bet slip initially
  const API_KEY = "5547690b7fe24b9ec6904dee468982d0";

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        console.log("🔍 Fetching odds...");
        const response = await axios.get(
          `https://api.the-odds-api.com/v4/sports/upcoming/odds/`,
          {
            params: {
              apiKey: API_KEY,
              regions: "us",
              markets: "h2h",
              oddsFormat: "decimal",
            },
          }
        );

        setOdds(response.data);
        console.log("✅ Odds Fetched:", response.data);
      } catch (error) {
        console.error("❌ Error fetching odds:", error);
        setError("Failed to load betting odds.");
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, []);

  // ✅ Add bet to slip and show Bet Slip
  const addToBetSlip = (bet) => {
    if (!user) {
      alert("You must be logged in to place a bet.");
      return;
    }

    // Prevent duplicate selections
    const isDuplicate = betSlip.some(
      (b) => b.match_id === bet.match_id && b.team_selected === bet.team_selected
    );
    if (isDuplicate) {
      alert("You have already selected this bet.");
      return;
    }

    setBetSlip([...betSlip, bet]);
    setShowBetSlip(true); // ✅ Show Bet Slip when a bet is added
  };

  return (
    <div className="betting-container">
      <h2 className="betting-title">📊 Latest Betting Odds</h2>

      {loading && <p className="loading-message">🔄 Loading odds...</p>}
      {error && <p className="error-message">❌ {error}</p>}

      {!loading && !error && odds.length > 0 && (
        <div className="odds-grid">
          {odds.map((bet, index) => (
            <div key={index} className="bet-card">
              <h3 className="sport-title">{bet.sport_title}</h3>
              <p className="match-title">{bet.home_team} vs {bet.away_team}</p>
              <p className="bookmaker-name">{bet.bookmakers[0]?.title || "N/A"}</p>
              
              <div className="odds-container">
                {bet.bookmakers[0]?.markets[0]?.outcomes.map((outcome, i) => (
                  <button 
                    key={i} 
                    className="bet-button"
                    onClick={() => addToBetSlip({
                      match_id: bet.id,
                      team_selected: outcome.name,
                      odds: outcome.price,
                      teams: `${bet.home_team} vs ${bet.away_team}`,
                    })}
                  >
                    {outcome.name}: {outcome.price}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Floating Bet Slip (Only visible when bets are added) */}
      {showBetSlip && (
       <BetSlip bets={betSlip} setBets={setBetSlip} user={user} setShowBetSlip={setShowBetSlip} />
      )}
    </div>
  );
};

export default BettingPage;