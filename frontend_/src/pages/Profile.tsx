import { useState, useEffect } from "react";
import axios from "axios";

const Profile = ({ user }: ProfilePageProps) => {
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
        console.error("Betting Stats Error:", err);
        setError("Failed to load betting stats.");
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
        console.error("Bet History Error:", err);
        setError("Failed to load bet history.");
      }
    };

    fetchStats();
    fetchHistory();
  }, [user]);

  if (!user) return <p className="text-gray-400 text-center mt-6">Loading user data...</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-6 ">
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center mt-12">
      {/* Profile Card */}
      <div className="bg-white border-2 border-blue-500 text-[#202334] shadow-lg rounded-lg p-6 w-full max-w-3xl text-center">
        <div className="flex flex-col items-center">
          {/* Profile Icon */}
          <div className="w-16 h-16 bg-blue-300 border-2 border-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold mt-2">{user.username}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Betting History Cards */}
      <div className="w-full max-w-3xl mt-10 bg-white rounded-xl border-1 border-blue-500 text-black p-6">
        <h2 className="text-xl font-bold  mb-4">Betting History</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {history.length === 0 ? (
          <p className="text-gray-500 text-center">No bets placed yet.</p>
        ) : (
          <div className="space-y-4">
            {history.map((bet: PastBet, index: number) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-300 text-[#202334] p-4 rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-lg"
              >
                <p className="text-gray-600 text-sm">
                  <span className="font-bold text-[#253a4a]">Match:</span> {bet.match_id}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-bold text-[#253a4a]">Team:</span> {bet.team_selected}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-bold text-[#253a4a]">Odds:</span> {bet.odds}
                </p>
                <div className="flex justify-between mt-3">
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-bold ${
                      bet.result === "win"
                        ? "bg-green-500 text-white"
                        : bet.result === "loss"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {bet.result === "win" ? "Win" : bet.result === "loss" ? "Loss" : "⏳ Pending"}
                  </span>
                  <span className={`text-lg font-bold ${bet.profit_loss >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {bet.profit_loss >= 0 ? `+${bet.profit_loss}` : bet.profit_loss}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Profile;