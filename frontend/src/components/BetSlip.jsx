import { useState, useEffect } from "react";
import axios from "axios";

const BetSlip = ({ bets, setBets, user, setShowBetSlip }) => {
  const [betType, setBetType] = useState("single");
  const [totalMultiplier, setTotalMultiplier] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

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

    // Hide the BetSlip when no bets remain
    if (updatedBets.length === 0) {
      setShowBetSlip(false);
    }
  };

  const handleSubmitBets = async () => {
    if (!token || !user || bets.length === 0) {
      setError("Please log in and add bets before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5002/api/bets",
        { betType, bets },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setBets([]);
      setShowBetSlip(false);
    } catch (err) {
      setError("Failed to submit bet. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚀 Only render BetSlip when bets are available
  if (bets.length === 0) return null;

  return (
    <div className="fixed right-4 top-20 w-80 bg-white shadow-lg border border-gray-300 p-5 rounded-lg">
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        <h2 className="text-xl font-semibold text-blue-950">📝 Bet Slip</h2>
        <button className="text-red-500 hover:text-red-700" onClick={() => setShowBetSlip(false)}>❌</button>
      </div>

      <div className="flex gap-3 text-sm text-blue-950 mb-4">
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" value="single" checked={betType === "single"} onChange={() => setBetType("single")} />
          Single Bets
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" value="parlay" checked={betType === "parlay"} onChange={() => setBetType("parlay")} disabled={bets.length < 2} />
          Parlay
        </label>
      </div>

      <ul className="space-y-3">
        {bets.map((bet, index) => (
          <li key={index} className="flex justify-between items-center bg-[#202334] text-slate-300 p-3 rounded-md shadow">
            <span>{bet.teams} @ {bet.odds}</span>
            <button className="text-red-400 hover:text-red-600" onClick={() => handleRemoveBet(index)}>❌</button>
          </li>
        ))}
      </ul>

      {betType === "parlay" && bets.length > 1 && (
        <p className="text-green-500 font-semibold mt-3">🔥 Parlay Multiplier: {totalMultiplier}x</p>
      )}

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      <button 
        onClick={handleSubmitBets} 
        disabled={isSubmitting || bets.length === 0} 
        className="w-full mt-4 py-2 bg-white text-[#202334] border-2 border-gray-300 font-semibold rounded-md transition 
                   transform hover:scale-105 hover:bg-[#253a4a] hover:text-white hover:shadow-lg 
                   active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500"
      >
        {isSubmitting ? "Submitting..." : "✅ Submit Bet"}
      </button>
    </div>
  );
};

export default BetSlip;
