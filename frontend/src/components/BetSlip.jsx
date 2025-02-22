import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/BetSlip.css";

const BetSlip = ({ bets, setBets, user, setShowBetSlip }) => {
  console.log("🟢 User received in BetSlip:", user);
  const [betType, setBetType] = useState("single");
  const [totalMultiplier, setTotalMultiplier] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Retrieve token from localStorage
  const token = localStorage.getItem("token");

  // ✅ Debugging: Check if `user` and `token` exist
  console.log("🟢 User in BetSlip:", user);
  console.log("🟢 Token in localStorage:", token);
 

  useEffect(() => {
    if (betType === "parlay" && bets.length > 1) {
      const multiplier = bets.reduce((acc, bet) => acc * parseFloat(bet.odds), 1);
      setTotalMultiplier(multiplier.toFixed(2));
    } else {
      setTotalMultiplier(1);
    }
  }, [bets, betType]);

  const handleRemoveBet = (index) => {
    const updatedBets = [...bets];
    updatedBets.splice(index, 1);
    setBets(updatedBets);

    if (updatedBets.length === 0) {
      setShowBetSlip(false);
    }
  };

  const handleSubmitBets = async () => {
    console.log("🟢 Submitting Bet - Checking user and token...");
  
    const token = localStorage.getItem("token");
    console.log("🟢 Token in localStorage:", token);
    console.log("🟢 User in BetSlip:", user);
  
    if (!token) {
      console.error("🔴 No token found in local storage.");
      setError("You must be logged in to place a bet.");
      return;
    }
  
    if (!user) {  // ✅ Ensure user is not null before submitting
      console.error("🔴 User state is NULL.");
      setError("You must be logged in to place a bet.");
      return;
    }
  
    if (bets.length === 0) {
      console.error("🔴 No bets in slip.");
      setError("Your bet slip is empty.");
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      const formattedBets = bets.map((bet) => ({
        match_id: bet.match_id,
        team_selected: bet.team_selected,
        odds: bet.odds,
      }));
  
      console.log("🟢 Sending API request with:", { betType, bets: formattedBets });
  
      const response = await axios.post(
        "http://localhost:5002/api/bets",
        { betType, bets: formattedBets },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
  
      console.log("✅ Bet submitted successfully:", response.data);
      setBets([]); // ✅ Clear bet slip after submission
      setShowBetSlip(false); // ✅ Hide Bet Slip after submission
    } catch (err) {
      console.error("❌ Bet submission error:", err.response?.data || err);
      setError("Failed to submit bet. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`betslip-container ${bets.length > 0 ? "show" : "hide"}`}>
      <div className="betslip-header">
        <h2>📝 Bet Slip</h2>
        <button className="close-betslip" onClick={() => setShowBetSlip(false)}>❌</button>
      </div>

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
              <button className="remove-bet" onClick={() => handleRemoveBet(index)}>❌</button>
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