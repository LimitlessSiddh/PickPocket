import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css";

const Profile = ({ user }) => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchBets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/api/bets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBets(response.data);
      } catch (err) {
        setError("Failed to load bet history.");
        console.error("❌ Bet History Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, [user]);

  return (
    <div className="profile-container">
      <h2>Welcome, {user.username}!</h2>
      <p>📩 {user.email}</p>
      <hr />

      <h3>📊 Betting History</h3>
      {error && <p className="error-message">{error}</p>}
      {loading ? <p>Loading bets...</p> : (
        <table className="bets-table">
          <thead>
            <tr>
              <th>Match</th>
              <th>Team Selected</th>
              <th>Odds</th>
              <th>Result</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {bets.length === 0 ? (
              <tr><td colSpan="5">No bets placed yet.</td></tr>
            ) : (
              bets.map((bet, index) => (
                <tr key={index}>
                  <td>{bet.match_id}</td>
                  <td>{bet.team_selected}</td>
                  <td>{bet.odds}</td>
                  <td className={bet.result === "win" ? "win" : bet.result === "loss" ? "loss" : "pending"}>
                    {bet.result}
                  </td>
                  <td>{new Date(bet.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Profile;


  