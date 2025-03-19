import { useState, useEffect } from "react";
import axios from "axios";

const BetSlip = ({ bets, setBets, user, setShowBetSlip }: BetSlipProps) => {
  const [betType, setBetType] = useState<string>("single");
  const [totalMultiplier, setTotalMultiplier] = useState<string>("1");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastBetTime, setLastBetTime] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (betType === "parlay" && bets.length > 1) {
      const multiplier = bets.reduce((acc, bet) => acc * bet.odds, 1);
      setTotalMultiplier(multiplier.toFixed(2));
    } else {
      setTotalMultiplier("1");
    }
  }, [bets, betType]);

  // ✅ Auto-hide Bet Slip after 4 seconds of inactivity
  useEffect(() => {
    if (bets.length === 0) return;

    setLastBetTime(Date.now());

    const timer = setTimeout(() => {
      const now = Date.now();
      if (lastBetTime && now - lastBetTime >= 4000) {
        setShowBetSlip(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [bets]);

  // ✅ Remove bet from bet slip
  const handleRemoveBet = (index: number) => {
    const updatedBets = [...bets];
    updatedBets.splice(index, 1);
    setBets(updatedBets);

    if (updatedBets.length === 0) {
      setShowBetSlip(false);
    }
  };

  // ✅ Submit bets to backend
  const handleSubmitBets = async () => {
    if (!token) {
      setError("You must be logged in to place a bet.");
      return;
    }
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

    const formattedBets = bets.map((bet) => ({
      match_id: bet.match_id,
      team_selected: bet.team_selected,
      odds: bet.odds,
      amount_wagered: bet.amount_wagered ?? 100, // ✅ Fix: Ensure `amount_wagered` is included
      sport_key: bet.sport_key,
    }));

    console.log("🛠 Sending Bet Data:", formattedBets);

    try {
      const response = await axios.post(
        "http://localhost:5002/api/bets",
        { bets: formattedBets },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      console.log("✅ Bet submitted successfully:", response.data);
      setBets([]);
      setShowBetSlip(false);
    } catch (err) {
      console.error("❌ Bet Submission Error:", err);
      setError("Failed to submit bet. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 transition-opacity duration-300 ${
        bets.length > 0 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      } bg-[#202334] border-2 border-blue-500 text-white rounded-lg shadow-lg p-6 w-80`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold italic text-white">Bet Slip</h2>
        <button className="text-white hover:text-red-500 transition" onClick={() => setShowBetSlip(false)}>
          ❌
        </button>
      </div>

      {/* ✅ Bet Type Selection */}
      <div className="flex justify-around mt-4">
        <label className="text-sm">
          <input type="radio" value="single" checked={betType === "single"} onChange={() => setBetType("single")} className="mr-2" />
          Single
        </label>
        <label className="text-sm">
          <input type="radio" value="parlay" checked={betType === "parlay"} onChange={() => setBetType("parlay")} disabled={bets.length < 2} className="mr-2" />
          Parlay
        </label>
      </div>

      {/* ✅ Bet Slip Content */}
      {bets.length === 0 ? (
        <p className="text-gray-400 text-center mt-4">No bets added yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {bets.map((bet, index) => (
            <li key={index} className="flex justify-between bg-white text-[#202334] px-3 py-2 rounded-lg border border-gray-300">
              <span className="text-sm font-bold">{bet.team_selected} @ {bet.odds}</span>
              <button className="text-red-500 hover:text-red-700 transition" onClick={() => handleRemoveBet(index)}>❌</button>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Show parlay multiplier */}
      {betType === "parlay" && bets.length > 1 && (
        <p className="text-blue-300 text-sm mt-3">Parlay Multiplier: {totalMultiplier}x</p>
      )}

      {/* ✅ Error Message */}
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      {/* ✅ Submit Bet Button */}
      <button
        className="w-full mt-4 px-6 py-3 text-lg font-bold italic border-2 border-gray-300 
        bg-[#202334] text-slate-300 rounded-md transition transform 
        hover:scale-105 hover:bg-white hover:text-[#253a4a] hover:shadow-lg 
        active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500"
        onClick={handleSubmitBets}
        disabled={isSubmitting || bets.length === 0}
      >
        {isSubmitting ? "Submitting..." : "Submit Bet"}
      </button>
    </div>
  );
};

export default BetSlip;

