import { useState, useEffect } from "react";
import axios from "axios";

interface PastBetWithParlay extends PastBet {
  parlay_id?: string | null;
}

const Profile = ({ user }: ProfilePageProps) => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState<PastBetWithParlay[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "singles" | "parlays">("all");

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

  const progressPercent = (user.score % 10) * 10;
  const currentXP = user.score % 10;
  const xpToNext = 10;

  const getBadge = (level: number) => {
    if (level >= 15) return "🏆 Legend";
    if (level >= 10) return "🎯 Sharpshooter";
    if (level >= 5) return "🔵 Grinder";
    return "🟢 Rookie";
  };

  const groupBets = () => {
    const grouped: { [key: string]: PastBetWithParlay[] } = {};
    history.forEach((bet) => {
      const key = bet.parlay_id || `single-${bet.id}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(bet);
    });
    return Object.entries(grouped);
  };

  const filteredGroups = groupBets().filter(([_, group]) => {
    if (filter === "all") return true;
    if (filter === "singles") return group.length === 1;
    return group.length > 1;
  });

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="p-6 flex flex-col items-center mt-12">
        {/* Profile Card */}
        <div className="bg-[#202334] border-2 border-gray-300 text-slate-300 shadow-xl rounded-xl p-6 w-full max-w-3xl text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-300 border-4 border-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-md">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-bold mt-4 italic">{user.username}</h2>
            <p className="text-slate-400 text-lg italic">{user.email}</p>

            <div className="mt-6 w-full">
              <p className="text-lg font-semibold text-slate-200 mb-1">🏆 RP: {user.score} points</p>
              <p className="text-lg font-semibold text-green-300 mb-2 italic">
                🎯 Level {user.level} - {getBadge(user.level)}
              </p>

              <div className="relative w-full bg-slate-700 rounded-full h-6 shadow-inner">
                <div
                  className="bg-green-500 h-6 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
                <div className="absolute inset-0 flex justify-center items-center text-sm font-semibold text-white">
                  {currentXP}/{xpToNext} RP to Level {user.level + 1}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mt-8 mb-4 flex gap-4">
          {["all", "singles", "parlays"].map((type) => (
            <button
              key={type}
              className={`px-6 py-2 text-sm font-bold italic border-2 border-gray-300 rounded-md transition transform hover:scale-110 hover:bg-white hover:text-[#253a4a] hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500 ${
                filter === type ? "bg-white text-[#202334]" : "bg-[#202334] text-slate-300"
              }`}
              onClick={() => setFilter(type as typeof filter)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Betting History */}
        <div className="w-full max-w-3xl mt-4 bg-[#202334] rounded-xl border-2 border-gray-300 text-slate-200 p-6 shadow-lg">
          <h2 className="text-xl font-bold italic mb-4">Betting History</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {history.length === 0 ? (
            <p className="text-slate-400 text-center">No bets placed yet.</p>
          ) : (
            <div className="space-y-6">
              {filteredGroups.map(([groupId, group]) => (
                <details
                  key={groupId}
                  open
                  className="bg-[#202334] border-2 border-slate-600 rounded-md p-4 shadow-md hover:shadow-lg"
                >
                  <summary className="cursor-pointer text-md font-semibold italic text-blue-400 mb-2">
                    {group.length > 1 ? `🎯 Parlay (${group.length} Picks)` : "🎯 Single Bet"}
                  </summary>

                  {group.map((bet, idx) => (
                    <div key={idx} className="text-sm text-slate-300 mb-1">
                      <span className="font-bold">Match:</span> {bet.match_id} —{" "}
                      <span className="font-bold">Team:</span> {bet.team_selected} —{" "}
                      <span className="font-bold">Odds:</span> {bet.odds}
                    </div>
                  ))}

                  <div className="flex justify-between mt-3">
                    <span
                      className={`px-3 py-1 rounded-md text-sm font-bold italic ${
                        group.some((b) => b.result === "pending")
                          ? "bg-yellow-500 text-white"
                          : group.every((b) => b.result === "win")
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {group.some((b) => b.result === "pending")
                        ? "⏳ Pending"
                        : group.every((b) => b.result === "win")
                        ? "✅ Parlay Win"
                        : "❌ Parlay Loss"}
                    </span>
                    <span className="text-sm font-bold italic">
                      {group.reduce((sum, b) => sum + (b.profit_loss ?? 0), 0) > 0
                        ? `+${group.reduce((sum, b) => sum + (b.profit_loss ?? 0), 0)}`
                        : group.reduce((sum, b) => sum + (b.profit_loss ?? 0), 0)}{" "}
                      RP
                    </span>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
