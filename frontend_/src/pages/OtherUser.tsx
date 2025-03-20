import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OtherUser = ({ user }: OtherUserProps) => {
    const { userName } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [wantedUser, setWantedUser] = useState<User | null>(null);
    const [history, setHistory] = useState<Bet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getProfile = async () => {
            try {
                if (!userName) {
                    navigate("/");
                }

                const response = await axios.get(`http://localhost:5002/api/${userName}`);
                if (response.status == 500) {
                    navigate("/")
                }

                setWantedUser(response.data.wantedUser);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getProfile();
    }, [userName]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (!userName) {
                    navigate("/");
                }

                const response = await axios.get(`http://localhost:5002/api/${userName}/bets`);
                if (response.status == 500) {
                    navigate("/")
                    setError("No bets placed yet.")
                }

                setHistory(response.data.bets);


            } catch (error) {
                console.log(error);
                setError("Error fetching history");
            } finally {
                setLoading(false);
            }

        };
        fetchHistory();
    }, [wantedUser, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!wantedUser) {
        return <div>User not found</div>;
    }




    return (

        <div className="bg-gray-100 min-h-screen p-12 flex flex-col items-center mt-12">
            {/* Profile Card */}
            <div className="bg-white border-2 border-blue-500 text-[#202334] shadow-lg rounded-lg p-6 w-full max-w-3xl text-center">
                <div className="flex flex-col items-center">
                    {/* Profile Icon */}
                    <div className="w-16 h-16 bg-blue-300 border-2 border-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        {wantedUser.username && wantedUser.username.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold mt-2">{wantedUser.username}</h2>
                    <p className="text-gray-600">{wantedUser.email}</p>
                </div>
            </div>

            {
                (user.username != wantedUser.username) &&
                <button className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-500 mt-12 transition-transform transform hover:scale-105">
                    Subscribe
                </button>
            }

            <div className="w-full max-w-3xl mt-10 bg-white rounded-xl border-1 border-blue-500 text-black p-6">
                <h2 className="text-xl font-bold mb-4">Betting History</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                {history.length === 0 ? (
                    <p className="text-gray-500 text-center">No bets placed yet.</p>
                ) : (
                    <div className="space-y-4">
                        {history.map((bet: Bet, index: number) => (
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
                                        className={`px-3 py-1 rounded-md text-sm font-bold ${bet.result === "win"
                                            ? "bg-green-500 text-white"
                                            : bet.result === "loss"
                                                ? "bg-red-500 text-white"
                                                : "bg-yellow-500 text-white"
                                            }`}
                                    >
                                        {bet.result === "win"
                                            ? "Win"
                                            : bet.result === "loss"
                                                ? "Loss"
                                                : "⏳ Pending"}
                                    </span>
                                    <span
                                        className={`text-lg font-bold ${bet.profit_loss >= 0 ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {bet.profit_loss >= 0 ? `+${bet.profit_loss}` : bet.profit_loss}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>


    );

}

export default OtherUser;