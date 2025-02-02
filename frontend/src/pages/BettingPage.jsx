import { useState, useEffect } from "react";
import "../styles/BettingPage.css";

const BettingPage = () => {
  const [odds, setOdds] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await fetch(
          `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${process.env.REACT_APP_ODDS_API_KEY}&regions=us`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch odds");
        }
        const data = await response.json();
        setOdds(data);
      } catch (error) {
        setError(error.message); // Store error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOdds();
  }, []);

  if (loading) {
    return (
      <div className="betting-container">
        <h2 className="betting-title">Loading odds...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="betting-container">
        <h2 className="betting-title">Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="betting-container">
      <h2 className="betting-title">Latest Betting Odds</h2>
      <ul>
        {odds.map((bet, index) => (
          <li key={index} className="bet-item">
            <strong>{bet.sport_title}</strong> - 
            {bet.bookmakers[0]?.title}: 
            {bet.bookmakers[0]?.markets[0]?.outcomes[0]?.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BettingPage;


