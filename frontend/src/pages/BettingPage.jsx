import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/BettingPage.css";
import BetSlip from "../components/BetSlip";

const BettingPage = ({ user }) => {
  const [odds, setOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [betSlip, setBetSlip] = useState([]);
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
      } catch (error) {
        console.error("❌ Error fetching odds:", error);
        setError("Failed to load betting odds.");
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, []);

  const addToBetSlip = (bet) => {
    setBetSlip([...betSlip, bet]);
  };

  return (
    <div className="betting-container">
      <h2 className="betting-title">Latest Betting Odds</h2>

      {loading && <p className="loading-message">Loading odds...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && odds.length > 0 && (
        <table className="betting-table">
          <thead>
            <tr>
              <th>Sport</th>
              <th>Match</th>
              <th>Odds</th>
              <th>Bet</th>
            </tr>
          </thead>
          <tbody>
            {odds.map((bet, index) => (
              <tr key={index}>
                <td>{bet.sport_title}</td>
                <td>{bet.home_team} vs {bet.away_team}</td>
                <td>{bet.bookmakers[0]?.markets[0]?.outcomes[0]?.price || "N/A"}</td>
                <td>
                  <button onClick={() => addToBetSlip({ match_id: bet.id, teams: `${bet.home_team} vs ${bet.away_team}`, odds: bet.bookmakers[0]?.markets[0]?.outcomes[0]?.price })}>
                    ➕ Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <BetSlip bets={betSlip} setBets={setBetSlip} user={user} />
    </div>
  );
};

export default BettingPage;






