import { useState, useEffect } from "react";
import "../styles/BettingPage.css";

const BettingPage = () => {
  const [odds, setOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_ODDS_API_KEY;

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await fetch(
          `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${API_KEY}&regions=us`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch odds. Status: ${response.status}`);
        }

        const data = await response.json();
        setOdds(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [API_KEY]);

  return (
    <div className="betting-container">
      {/* Sidebar for Sports Selection */}
      <aside className="sidebar">
        <h3>Sports</h3>
        <ul className="sports-list">
          <li>Football</li>
          <li>Basketball</li>
          <li>Baseball</li>
          <li>Hockey</li>
          <li>Soccer</li>
          <li>Tennis</li>
        </ul>
      </aside>

      {/* Main Betting Content */}
      <div className="betting-content">
        <h2 className="betting-title">Latest Betting Odds</h2>

        {loading && <p className="loading-message">Loading odds...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        {!loading && !error && odds.length === 0 && (
          <p className="no-odds-message">No odds available at the moment.</p>
        )}

        {!loading && !error && odds.length > 0 && (
          <table className="betting-table">
            <thead>
              <tr>
                <th>Sport</th>
                <th>Bookmaker</th>
                <th>Odds</th>
              </tr>
            </thead>
            <tbody>
              {odds.map((bet, index) => (
                <tr key={index}>
                  <td>{bet.sport_title}</td>
                  <td>{bet.bookmakers[0]?.title || "Unknown"}</td>
                  <td className="bet-odds">
                    {bet.bookmakers[0]?.markets[0]?.outcomes[0]?.price || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BettingPage;










