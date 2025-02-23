import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css";

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
        console.log("✅ Betting Stats Fetched:", response.data);
        setStats(response.data);
      } catch (err) {
        console.error("❌ Betting Stats Error:", err);
        setError("Failed to load betting stats.");
      }
    };

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/api/bets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Betting History Fetched:", response.data);
        setHistory(response.data);
      } catch (err) {
        console.error("❌ Bet History Error:", err);
        setError("Failed to load bet history.");
      }
    };

    fetchStats();
    fetchHistory();
  }, [user]);

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="profile-container">
      <h2>📜 Betting History</h2>
      {error && <p className="error-message">{error}</p>}

      {history.length === 0 ? (
        <p className="empty-history">No bets placed yet.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Match ID</th>
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
  );
};

export default Profile;