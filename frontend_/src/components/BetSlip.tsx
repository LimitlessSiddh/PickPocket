import { useState, useEffect } from "react";
import axios from "axios";

const BetSlip = ({ bets, setBets, user, setShowBetSlip }: BetSlipProps) => {
  console.log("User received in BetSlip:", user);
  const [betType, setBetType] = useState<string>("single");
  const [totalMultiplier, setTotalMultiplier] = useState<string>("1");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  console.log("User in BetSlip:", user);
  console.log("Token in localStorage:", token);
 

  useEffect(() => {
    if (betType === "parlay" && bets.length > 1) {
      const multiplier = bets.reduce((acc, bet) => acc * bet.odds, 1);
      setTotalMultiplier(multiplier.toFixed(2));
    } else {
      setTotalMultiplier("1");
    }
  }, [bets, betType]);

  const handleRemoveBet = (index: number) => {
    const updatedBets = [...bets];
    updatedBets.splice(index, 1);
    setBets(updatedBets);

    if (updatedBets.length === 0) {
      setShowBetSlip(false);
    }
  };

  const handleSubmitBets = async () => {
    console.log("Submitting Bet - Checking user and token...");
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage.");
      setError("You must be logged in to place a bet.");
      return;
    }
  
    if (!user) {
      console.error("User state is NULL.");
      setError("You must be logged in to place a bet.");
      return;
    }
  
    if (bets.length === 0) {
      console.error("No bets in slip.");
      setError("Your bet slip is empty.");
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      // Fetch latest match data to get correct match_id
      const sportKey = bets[0].sport_key; // Assume all bets are in the same sport
      const matchResponse = await axios.get(
        `https://api.the-odds-api.com/v4/sports/${sportKey}/scores/`,
        { params: { apiKey: "5547690b7fe24b9ec6904dee468982d0" } }
      );
  
      const matchData = matchResponse.data;
      console.log("API Match Data:", matchData);
  
      const formattedBets = bets.map((bet) => {

        type Match = {
          id: number;
          home_team: string;
          away_team: string;
        }

        const match = matchData.find(
          (m: Match) => m.home_team === bet.team_selected || m.away_team === bet.team_selected
        );
  
        if (!match) {
          console.error(`No match found for ${bet.team_selected}`);
          setError(`No valid match found for ${bet.team_selected}`);
          return null;
        }
  
        return {
          match_id: match.id,
          team_selected: bet.team_selected,
          odds: bet.odds,
          sport_key: sportKey,
        };
      }).filter(Boolean);
  
      if (formattedBets.length === 0) {
        setError("No valid bets found. Please try again.");
        return;
      }
  
      console.log("Sending API request with:", { betType, bets: formattedBets });
  
      const response = await axios.post(
        "http://localhost:5002/api/bets",
        { betType, bets: formattedBets },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
  
      console.log("Bet submitted successfully:", response.data);
      setBets([]);
      setShowBetSlip(false);
    } catch (err: unknown) {
      if(err instanceof Error){
        console.error("Bet submission error:", err.message);
        setError("Failed to submit bet. Try again.");
      } else {
        console.error("Unknown error:", err);
        setError("Failed to submit bet. Try again.");
      }
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`betslip-container ${bets.length > 0 ? "show" : "hide"}`}>
      <div className="betslip-header">
        <h2>Bet Slip</h2>
        <button className="close-betslip" onClick={():void => setShowBetSlip(false)}>❌</button>
      </div>

      <div className="bet-type">
        <label>
          <input
            type="radio"
            value="single"
            checked={betType === "single"}
            onChange={():void => setBetType("single")}
          />
          Single Bets
        </label>
        <label>
          <input
            type="radio"
            value="parlay"
            checked={betType === "parlay"}
            onChange={():void => setBetType("parlay")}
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
              <button className="remove-bet" onClick={():void => handleRemoveBet(index)}>❌</button>
            </li>
          ))}
        </ul>
      )}

      {betType === "parlay" && bets.length > 1 && (
        <p className="parlay-multiplier">Parlay Multiplier: {totalMultiplier}x</p>
      )}

      {error && <p className="error-message">{error}</p>}

      <button onClick={handleSubmitBets} disabled={isSubmitting || bets.length === 0}>
        {isSubmitting ? "Submitting..." : "Submit Bet"}
      </button>
    </div>
  );
};

export default BetSlip;