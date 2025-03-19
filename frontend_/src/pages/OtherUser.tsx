import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OtherUser = ({ user }: OtherUserProps) => {
    const { userName } = useParams();
    const navigate = useNavigate();
    const [wantedUser, setWantedUser] = useState<User | null>(null);
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
    }, [userName, navigate])

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!wantedUser) {
        return <div>User not found</div>;
    }


    return (

        <div className="bg-gray-100 min-h-screen p-6 ">
            <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center mt-12">
                {/* Profile Card */}
                <div className="bg-white border-2 border-blue-500 text-[#202334] shadow-lg rounded-lg p-6 w-full max-w-3xl text-center">
                    <div className="flex flex-col items-center">
                        {/* Profile Icon */}
                        <div className="w-16 h-16 bg-blue-300 border-2 border-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            {wantedUser.username.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold mt-2">{wantedUser.username}</h2>
                        <p className="text-gray-600">{wantedUser.email}</p>
                    </div>
                </div>
            </div>
        </div>

    );

}

export default OtherUser;