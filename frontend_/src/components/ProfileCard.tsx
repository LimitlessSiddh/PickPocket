import { useState } from "react";
import axios from "axios";

const ProfileCard = ({ user, stats }) => {
  const [newUsername, setNewUsername] = useState("");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5002/api/user/profile",
        { username: newUsername || user.username, avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
      console.error("❌ Update Error:", err);
    }
  };

  return (
    <div className="profile-card">
      <img src={avatar || "/default-avatar.png"} alt="Avatar" className="profile-avatar" />
      <h2 className="profile-title">{user.username}</h2>
      <p className="profile-subtitle">{user.email}</p>

      <div className="profile-stats">
        <p>Total Bets: <span>{stats?.totalBets || 0}</span></p>
        <p>Bets Won: <span className="positive">{stats?.betsWon || 0}</span></p>
        <p>Bets Lost: <span className="negative">{stats?.betsLost || 0}</span></p>
        <p>ROI: <span className="roi">{stats?.roi || 0}%</span></p>
      </div>

      <div className="profile-edit">
        <input type="text" placeholder="New Username" onChange={(e) => setNewUsername(e.target.value)} />
        <input type="text" placeholder="Avatar URL" onChange={(e) => setAvatar(e.target.value)} />
        <button onClick={handleUpdate}>Update Profile</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default ProfileCard;
