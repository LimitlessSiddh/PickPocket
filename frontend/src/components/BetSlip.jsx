import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/BetSlip.css";

const BetSlip = ({ bets, setBets, user }) => {
  const [betType, setBetType] = useState("single"); // "single" or "parlay"
  const [totalMultiplier, setTotalMultiplier] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (betType === "parlay" && bets.length > 1) {
      const multiplier = bets.reduce((acc, bet) => acc * bet.odds, 1);
      setTotalMultiplier(multiplier.toFixed(2));
    } else {
      setTotalMultiplier(1);
    }
  }, [bets, betType]);

  const handleRemoveBet = (index) => {
    const updatedBets = [...bets];
    updatedBets.splice(index, 1);
    setBets(updatedBets);
  };

  const handleSubmitBets = async () => {
    if (!user) {
      setError("You must be logged in to place a bet.");
      return;
    }
    if (bets.length === 0) {
      setError("Your bet slip is empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5002/api/bets/submit",
        {
          user_id: user.id,
          betType,
          bets,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("✅ Bet submitted:", response.data);
      setBets([]); // Clear bet slip after submission
    } catch (err) {
      console.error("❌ Bet submission error:", err.response?.data || err);
      setError("Failed to submit bet. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="betslip-container">
      <h2>📝 Bet Slip</h2>

      <div className="bet-type">
        <label>
          <input
            type="radio"
            value="single"
            checked={betType === "single"}
            onChange={() => setBetType("single")}
          />
          Single Bets
        </label>
        <label>
          <input
            type="radio"
            value="parlay"
            checked={betType === "parlay"}
            onChange={() => setBetType("parlay")}
            disabled={bets.length < 2}
          />
          Parlay
        </label>
      </div>

      {bets.length === 0 ? (
        <p className="empty-betslip">No bets added yet.</p>
      ) : (
        <ul className="bet-list">
          {bets.map((bet, index) => (
            <li key={index} className="bet-item">
              <span>{bet.teams} @ {bet.odds}</span>
              <button onClick={() => handleRemoveBet(index)}>❌</button>
            </li>
          ))}
        </ul>
      )}

      {betType === "parlay" && bets.length > 1 && (
        <p className="parlay-multiplier">🔥 Parlay Multiplier: {totalMultiplier}x</p>
      )}

      {error && <p className="error-message">{error}</p>}

      <button onClick={handleSubmitBets} disabled={isSubmitting || bets.length === 0}>
        {isSubmitting ? "Submitting..." : "✅ Submit Bet"}
      </button>
    </div>
  );
};

export default BetSlip;
