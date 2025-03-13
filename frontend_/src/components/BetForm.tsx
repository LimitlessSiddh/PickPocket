import React, { useState } from "react";

const BetForm = () => {
  const [bet, setBet] = useState("");
  const [odds, setOdds] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Bet Submitted:", { bet, odds });
    setBet("");
    setOdds("");
  };

  return (
    <div className="bg-secondary p-6 rounded-2xl shadow-lg w-full max-w-lg">
      <h2 className="text-2xl font-bold text-accent1 text-center">Submit Your Bet</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          placeholder="Your Bet (e.g., Lakers ML)"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          className="w-full p-3 rounded-lg bg-primary text-white placeholder-gray-500 border border-accent2 focus:border-accent1 outline-none"
          required
        />
        <input
          type="number"
          placeholder="Odds (e.g., 2.5)"
          value={odds}
          onChange={(e) => setOdds(e.target.value)}
          className="w-full p-3 rounded-lg bg-primary text-white placeholder-gray-500 border border-accent2 focus:border-accent1 outline-none"
          required
        />
        <button className="w-full bg-accent1 text-black px-6 py-2 rounded-lg text-lg font-semibold hover:bg-accent2 transition">
          Submit Bet
        </button>
      </form>
    </div>
  );
};

export default BetForm;
