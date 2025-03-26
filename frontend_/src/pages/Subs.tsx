import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SubsPage = ({ user }: SubscriptionPageProps) => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const token = localStorage.getItem("token");

    const formatDate = (timestamp: string): string => {
        const parsedDate = new Date(timestamp);
        const year = parsedDate.getFullYear();
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = parsedDate.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const unsubscribeButtonClick = async (wantedUserID: number, wantedUserName: string): Promise<void> => {
        const message = `Are you sure you want to unsubscribe from ${wantedUserName}?`;

        if (confirm(message)) {
            const response = await axios.post("http://localhost:5002/api/subscriptions/unsubscribe", {
                wantedUserID: wantedUserID, wantedUserName: wantedUserName
            }, { headers: { Authorization: `Bearer ${token}` } })

            if (response.status === 200) {
                setSubscriptions(prevSubscriptions =>
                    prevSubscriptions.filter(subscription => subscription.sub_to_id !== wantedUserID)
                );
            }
        }
    }

    useEffect(() => {
        if (!user) return;

        const fetchSubscriptions = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5002/api/subscriptions/getSubscriptions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSubscriptions(response.data.subscriptions);
                console.log(response.data.subscriptions);
            } catch (err) {
                console.error("Subscriptions Error:", err);
                setError("Failed to load subscriptions.");
            }
        };

        fetchSubscriptions();
    }, [user]);

    if (!user) return <p className="text-gray-400 text-center mt-6">Loading user data...</p>;

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center mt-12">
                <div className="bg-white border-2 border-blue-500 text-[#202334] shadow-lg rounded-lg p-4 w-full max-w-sm text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-300 border-2 border-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold mt-2">{user.username}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                <div className="mt-6 text-center text-gray-600">
                    <p className="text-lg font-semibold">Manage your subscriptions here.</p>
                </div>

                <div className="w-auto min-w-xl max-w-3xl h-auto mt-10 bg-white rounded-xl border-1 border-blue-500 text-black p-6">
                    <h2 className="text-xl font-bold mb-4 text-center">Your Subscriptions</h2>

                    {
                        subscriptions.length > 0 ? (
                            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4">
                                <div className="grid grid-cols-4 gap-4 bg-gray-200 text-black font-bold p-3 rounded-lg">
                                    <span className="text-center">Subscription</span>
                                    <span className="text-center">Start Date</span>
                                    <span className="text-center">Monthly Price</span>
                                    <span className="text-center">Actions</span>
                                </div>

                                {subscriptions.map((subscription, index) => (
                                    <div
                                        key={subscription.id}
                                        className={`grid grid-cols-4 items-center p-3 border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                                    >
                                        <span className="font-semibold text-center text-gray-950 no-underline hover:underline"> <Link to={`/${subscription.sub_to_name}`}>{subscription.sub_to_name}</Link></span>

                                        <span className="text-center">{formatDate(subscription.created_at)}</span>

                                        <span className="text-center">${subscription.price}</span>

                                        <span className="text-center">
                                            <button onClick={() => unsubscribeButtonClick(subscription.sub_to_id!, subscription.sub_to_name!)} className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition transform hover:scale-105 focus:outline-none">
                                                Unsubscribe
                                            </button>
                                        </span>

                                    </div>
                                ))}
                            </div>) : (
                            <div className="text-center">
                                <p className="text-lg font-semibold">You currently have no subscriptions...</p>
                                <p className="text-lg font-semibold">Find players on the  <Link className="text-blue-600 no-underline hover:underline" to="/leaderboard">leaderboard</Link></p>

                            </div>

                        )
                    }

                </div>
            </div>
        </div>
    );
};

export default SubsPage;