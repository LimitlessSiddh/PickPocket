import { useState, useEffect } from "react";
import axios from "axios";
import ProfileCard from "../components/ProfileCard";
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

  return (
    <div className="profile-container">
      <ProfileCard user={user} stats={stats} />

      <div className="profile-history">
        <h3>📊 Betting Performance</h3>
        {error && <p className="error-message">{error}</p>}

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <XAxis dataKey="created_at" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="profit_loss" stroke="#00A878" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Profile;



  