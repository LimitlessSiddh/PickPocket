import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("roi");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/leaderboard");
        setLeaders(response.data);
      } catch (err) {
        setError("Failed to load leaderboard.");
        console.error("❌ Leaderboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredLeaders = [...leaders].sort((a, b) => {
    if (filter === "roi") return b.roi - a.roi;
    if (filter === "win_pct") return (b.wins / (b.total_bets || 1)) - (a.wins / (a.total_bets || 1));
    if (filter === "streaks") return b.longest_win_streak - a.longest_win_streak;
    return b.total_bets - a.total_bets;
  });

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Leaderboard</h2>

      <div className="leaderboard-filters">
        <button onClick={() => setFilter("roi")}>ROI %</button>
        <button onClick={() => setFilter("win_pct")}>Win %</button>
        <button onClick={() => setFilter("streaks")}>Longest Streak</button>
        <button onClick={() => setFilter("activity")}>Most Bets</button>
      </div>

      {loading && <p className="loading-message">Loading leaderboard...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="leaderboard-table">
          <div className="leaderboard-header">
            <span>#</span>
            <span>Username</span>
            <span>Total Bets</span>
            <span>Win %</span>
            <span>ROI</span>
            <span>🔥 Streak</span>
          </div>

          {filteredLeaders.map((leader, index) => (
            <div key={index} className={`leader-row rank-${index + 1}`}>
              <span className="rank-number">#{index + 1}</span>
              <span className="leader-name">{leader.username}</span>
              <span>{leader.total_bets}</span>
              <span>{((leader.wins / (leader.total_bets || 1)) * 100).toFixed(1)}%</span>
              <span>{leader.roi}%</span>
              <span className="leader-streak">🔥 {leader.longest_win_streak} Wins</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;