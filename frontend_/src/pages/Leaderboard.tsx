import { useState, useEffect } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("roi");

  useEffect(() => {
    const fetchLeaderboard = async (): Promise<void> => {
      try {
        const response = await axios.get("http://localhost:5002/api/leaderboard");
        setLeaders(response.data);
      } catch (err) {
        setError("Failed to load leaderboard.");
        console.error("Leaderboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredLeaders = [...leaders].sort((a: User, b: User) => {
    if (filter === "win_pct") return (b.total_wins / (b.total_bets || 1)) - (a.total_wins / (a.total_bets || 1));
    if (filter === "streaks") return b.longest_win_streak - a.longest_win_streak;
    return b.total_bets - a.total_bets;
  });

  return (
    <div className="flex bg-white flex-col items-center justify-center min-h-screen overflow-hidden w-full mx-auto">
      <h2 className="text-3xl font-bold mb-4">🏆 Leaderboard</h2>

      <div className="flex space-x-2 mb-4">
        {["roi", "win_pct", "streaks", "activity"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-white transition ${
              filter === type ? "bg-blue-600" : "bg-gray-500 hover:bg-gray-700"
            }`}
          >
            {type === "roi" ? "ROI %" : type === "win_pct" ? "Win %" : type === "streaks" ? "Longest Streak" : "Most Bets"}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-600 text-lg">Loading leaderboard...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4">
          <div className="grid grid-cols-6 bg-gray-200 text-gray-700 font-semibold p-2 rounded-lg">
            <span>#</span>
            <span>Username</span>
            <span>Total Bets</span>
            <span>Win %</span>
            <span>ROI</span>
            <span>🔥 Streak</span>
          </div>

          {filteredLeaders.map((leader: User, index) => (
            <div
              key={index}
              className={`grid grid-cols-6 items-center p-2 border-b ${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              }`}
            >
              <span className="font-semibold">#{index + 1}</span>
              <span className="font-medium">{leader.username}</span>
              <span>{leader.total_bets}</span>
              <span>{((leader.total_wins / (leader.total_bets || 1)) * 100).toFixed(1)}%</span>
              <span>{leader.points}%</span>
              <span className="text-red-500 font-bold">🔥 {leader.longest_win_streak} Wins</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;