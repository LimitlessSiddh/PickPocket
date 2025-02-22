import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Profile = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/api/bets/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(response.data);
      } catch (err) {
        setError("Failed to load betting stats.");
        console.error("❌ Betting Stats Error:", err);
      }
    };

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/api/bets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHistory(response.data);
      } catch (err) {
        setError("Failed to load bet history.");
        console.error("❌ Bet History Error:", err);
      }
    };

    fetchStats();
    fetchHistory();
  }, [user]);

  if (!user) return <p>Loading user data...</p>;

  // 🔥 Define Streak Status
  const streakType =
    stats?.current_win_streak > 0
      ? `🔥 ${stats.current_win_streak}-Day Streak`
      : stats?.current_loss_streak > 0
      ? `❄️ ${stats.current_loss_streak}-Day Cold Streak`
      : "";

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <img src={user.avatar || "/default-avatar.png"} alt="Avatar" className="profile-avatar" />
        <div className="profile-info">
          <h2 className="profile-username">
            {user.username} <span className="streak-indicator">{streakType}</span>
          </h2>
          <p className="profile-rank">🏆 {stats?.roi > 20 ? "High Roller" : "Rising Star"}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="profile-stats">
        <div className="stat-card total-bets">
          <h3>Total Bets</h3>
          <p>{stats?.total_bets || 0}</p>
        </div>
        <div className="stat-card win-card">
          <h3>Wins</h3>
          <p>{stats?.wins || 0} ✅</p>
        </div>
        <div className="stat-card loss-card">
          <h3>Losses</h3>
          <p>{stats?.losses || 0} ❌</p>
        </div>
        <div className="stat-card roi-card">
          <h3>ROI %</h3>
          <p>{stats?.roi || 0}% 📈</p>
        </div>
      </div>

      {/* Betting History */}
      <div className="bet-history">
        <h3>📜 Betting History</h3>
        {error && <p className="error-message">{error}</p>}
        {history.length === 0 ? (
          <p className="empty-history">No bets placed yet.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Match</th>
                <th>Team</th>
                <th>Odds</th>
                <th>Result</th>
                <th>Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {history.map((bet, index) => (
                <tr key={index} className={bet.result}>
                  <td>{bet.match_id}</td>
                  <td>{bet.team_selected}</td>
                  <td>{bet.odds}</td>
                  <td className={`bet-result ${bet.result}`}>
                    {bet.result === "win" ? "✅ Win" : bet.result === "loss" ? "❌ Loss" : "⏳ Pending"}
                  </td>
                  <td className="profit-loss">
                    {bet.profit_loss >= 0 ? `+${bet.profit_loss}` : bet.profit_loss}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Performance Chart */}
      <div className="performance-chart">
        <h3>📊 Profit/Loss Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <XAxis dataKey="created_at" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Line type="monotone" dataKey="profit_loss" stroke="#00ff7f" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Profile;