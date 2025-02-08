import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Profile = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/api/bets/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(response.data);
      } catch (error) {
        console.error("❌ Error fetching betting stats:", error);
      }
    };

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5002/api/bets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHistory(response.data);
      } catch (error) {
        console.error("❌ Error fetching bet history:", error);
      }
    };

    fetchStats();
    fetchHistory();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Welcome, {user.username}!</h2>
        <p>📩 {user.email}</p>
        <hr />
        <h3>Betting History</h3>
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



  