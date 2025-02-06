import { useState, useEffect } from "react";
import "../styles/Profile.css";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(user);
  const [newUsername, setNewUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("/api/auth/profile", { credentials: "include" });
      const data = await response.json();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: newUsername || profile.username, avatar }),
    });
    
    if (response.ok) {
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={profile.avatar || "/default-avatar.png"} alt="Avatar" className="profile-avatar" />
        <h2 className="profile-title">{profile.username}</h2>
        <p className="profile-subtitle">Your Betting Performance</p>

        <div className="profile-stats">
          <p>Total Bets: <span className="highlight">{profile.totalBets}</span></p>
          <p>Bets Won: <span className="highlight positive">{profile.betsWon}</span></p>
          <p>Bets Lost: <span className="highlight negative">{profile.betsLost}</span></p>
          <p>ROI: <span className="highlight roi">{profile.roi}%</span></p>
        </div>

        <div className="profile-edit">
          <input type="text" placeholder="New Username" onChange={(e) => setNewUsername(e.target.value)} />
          <input type="text" placeholder="Avatar URL" onChange={(e) => setAvatar(e.target.value)} />
          <button onClick={handleUpdate}>Update Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
