import { useState, useEffect } from "react";
import axios from "axios";
import BetSlip from "../components/BetSlip";

const BettingPage = ({ user, bets, setBets, setShowBetSlip }: BettingPageProps) => {
  const [odds, setOdds] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number>(0);
  const CACHE_DURATION = 300000;
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchOdds = async () => {
      const now = Date.now();
      if (now - lastFetched < CACHE_DURATION) {
        console.log("⏳ Using cached odds data.");
        return;
      }

      try {
        console.log("🔍 Fetching odds...");
        const response = await axios.get(
          `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/`,
          {
            params: {
              apiKey: API_KEY,
              regions: "us",
              markets: "h2h",
              oddsFormat: "decimal",
            },
          }
        );

        if (response.data.error_code === "OUT_OF_USAGE_CREDITS") {
          console.error("❌ API Quota Exceeded. Stopping requests.");
          setError("API quota exceeded. Try again later.");
          return;
        }

        setOdds(response.data);
        setLastFetched(now);
        console.log("✅ Odds Fetched:", response.data);
      } catch (error) {
        console.error("❌ Error fetching odds:", error);
        setError("Failed to load betting odds.");
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [lastFetched]);

  type Match = {
    id: number;
    home_team: string;
    away_team: string;
    sport_key: string;
    sport_title: string;
    bookmakers: {
      title: string;
      markets: {
        key: string;
        outcomes: {
          name: string;
          price: number;
        }[];
      }[];
    }[];
  };

  type Outcome = {
    price: number;
    name: string;
  };

  // Fix: Ensure BetSlip is always shown when a new bet is added
  const addToBetSlip = (match: Match, outcome: Outcome) => {
    if (!user) {
      alert("You must be logged in to place a bet.");
      return;
    }

    const newBet = {
      match_id: match.id,
      team_selected: outcome.name,
      odds: outcome.price,
      amount_wagered: 100, // FIX: Ensures `amount_wagered` is always included
      sport_key: match.sport_key,
      teams: `${match.home_team} vs ${match.away_team}`,
      id: Date.now(),
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setBets((prevBets) => {
      setShowBetSlip(true); // Ensure BetSlip appears on new bet
      return [...prevBets, newBet];
    });
  };

  // Auto-hide BetSlip after 4 seconds if no new bets are added
  useEffect(() => {
    if (bets.length === 0) return;

    const timer = setTimeout(() => {
      setShowBetSlip(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [bets]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#202334] mb-6 text-center mt-20">
        📊 Latest Betting Odds
      </h2>

      {loading && <p className="text-gray-600 text-center">Loading odds...</p>}
      {error && <p className="text-red-500 text-center">❌ {error}</p>}

      {!loading && !error && odds.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {odds.map((match: Match) => (
              <div
                key={match.id}
                className="bg-white text-[#202334] border-2 border-blue-500 rounded-md p-4 shadow-md"
              >
                <h3 className="text-lg font-bold italic text-[#253a4a]">
                  {match.sport_title}
                </h3>
                <p className="text-md font-semibold text-gray-600">
                  {match.home_team} vs {match.away_team}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {match.bookmakers[0]?.markets[0]?.outcomes.map((outcome) => (
                    <button
                      key={outcome.name}
                      className="px-6 py-4 text-lg font-bold italic border-2 border-gray-300 
                      bg-[#202334] text-slate-300 rounded-md transition transform 
                      hover:scale-110 hover:bg-white hover:text-[#253a4a] hover:shadow-lg 
                      active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500"
                      onClick={() => addToBetSlip(match, outcome)}
                    >
                      {outcome.name}: {outcome.price}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user && (
        <div className="mt-6 w-full max-w-2xl">
          <BetSlip
            bets={bets}
            setBets={setBets}
            user={user}
            setShowBetSlip={setShowBetSlip}
          />
        </div>
      )}
    </div>
  );
};

export default BettingPage;
