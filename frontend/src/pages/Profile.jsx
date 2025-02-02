import { useState } from "react";
import "../styles/Profile.css";

const Profile = () => {
  // Placeholder user data (can be replaced with API data later)
  const [user, setUser] = useState({
    username: "BetMaster",
    totalBets: 125,
    winningPercentage: "+12.5%",
    roi: "+10%",
  });

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">🏅 {user.username}'s Profile</h2>
        <p className="profile-subtitle">Track your betting performance</p>

        <div className="profile-stats">
          <p>Total Bets: <span className="highlight">{user.totalBets}</span></p>
          <p>Winning Percentage: <span className="highlight positive">{user.winningPercentage}</span></p>
          <p>ROI: <span className="highlight roi">{user.roi}</span></p>
        </div>

        <button className="edit-profile-btn">Edit Profile</button>
      </div>
    </div>
  );
};

export default Profile;

  