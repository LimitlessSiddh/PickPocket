import { useState, useEffect } from "react";
import axios from "axios";
import BetSlip from "../components/BetSlip";

const BettingPage = ({ user, bets, setBets, setShowBetSlip }) => {
  const [odds, setOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(0);
  const API_KEY = "5547690b7fe24b9ec6904dee468982d0";
  const CACHE_DURATION = 300000;

  useEffect(() => {
    const fetchOdds = async () => {
      const now = Date.now();
      if (now - lastFetched < CACHE_DURATION) return;

      try {
        const response = await axios.get(
          `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/`,
          {
            params: {
              apiKey: API_KEY,
              regions: "us",
              markets: "h2h,spreads,totals",
              oddsFormat: "decimal",
            },
          }
        );

        setOdds(response.data);
        setLastFetched(now);
      } catch (error) {
        setError("Failed to load betting odds.");
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [lastFetched]);

  const addToBetSlip = (match, outcome) => {
    if (!user) {
      alert("You must be logged in to place a bet.");
      return;
    }

    const newBet = {
      match_id: match.id,
      team_selected: outcome.name,
      odds: outcome.price,
      sport_key: match.sport_key,
      teams: `${match.home_team} vs ${match.away_team}`,
    };

    setBets([...bets, newBet]);
    setShowBetSlip(true);
  };

  return (
    <div className="w-full min-h-screen bg-white text-blue-950 p-6 pt-24">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-blue-950 text-center mb-6">
        📊 Betting Market – Live Picks & Odds
      </h2>

      {loading && <p className="text-blue-500 text-center">🔄 Loading odds...</p>}
      {error && <p className="text-red-500 text-center">❌ {error}</p>}

      {!loading && !error && odds.length > 0 && (
        <div className="overflow-x-auto">
          <div className="space-y-6">
            {odds.map((match) => (
              <div key={match.id} className="bg-[#202334] text-slate-300 p-4 rounded-lg shadow-lg">
                {/* 🏆 League Title */}
                <h3 className="text-white font-semibold text-lg mb-2">
                  {match.sport_title} - {match.competition_name}
                </h3>

                {/* Match Row */}
                <div className="grid grid-cols-3 gap-4 py-2 px-4 bg-[#253a4a] rounded-md">
                  <span className="text-left font-semibold">{match.home_team}</span>
                  <span className="text-center text-gray-400">VS</span>
                  <span className="text-right font-semibold">{match.away_team}</span>
                </div>

                {/* Betting Odds Table */}
                <div className="grid grid-cols-3 text-center mt-3 text-sm">
                  <div className="border-r border-gray-600">
                    <p className="text-gray-400">🏆 Match Winner</p>
                    {match.bookmakers[0]?.markets[0]?.outcomes.map((outcome) => (
                      <button
                        key={outcome.name}
                        className="block w-full bg-white text-[#202334] border-2 border-gray-300 font-semibold rounded-md py-2 mt-1
                                   hover:bg-[#253a4a] hover:text-white hover:shadow-lg transition"
                        onClick={() => addToBetSlip(match, outcome)}
                      >
                        {outcome.name} <span className="text-green-400">{outcome.price}</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-r border-gray-600">
                    <p className="text-gray-400">📈 Spread</p>
                    {match.bookmakers[0]?.markets[1]?.outcomes.map((outcome) => (
                      <button
                        key={outcome.name}
                        className="block w-full bg-white text-[#202334] border-2 border-gray-300 font-semibold rounded-md py-2 mt-1
                                   hover:bg-[#253a4a] hover:text-white hover:shadow-lg transition"
                        onClick={() => addToBetSlip(match, outcome)}
                      >
                        {outcome.name} <span className="text-green-400">{outcome.point} ({outcome.price})</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <p className="text-gray-400">📊 Total Points</p>
                    {match.bookmakers[0]?.markets[2]?.outcomes.map((outcome) => (
                      <button
                        key={outcome.name}
                        className="block w-full bg-white text-[#202334] border-2 border-gray-300 font-semibold rounded-md py-2 mt-1
                                   hover:bg-[#253a4a] hover:text-white hover:shadow-lg transition"
                        onClick={() => addToBetSlip(match, outcome)}
                      >
                        {outcome.name} <span className="text-green-400">{outcome.point} ({outcome.price})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user && <BetSlip bets={bets} setBets={setBets} user={user} setShowBetSlip={setShowBetSlip} />}
    </div>
  );
};

export default BettingPage;
