import "../styles/Profile.css";

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Your Profile</h2>
        <p className="profile-stats">Total Bets: <span>125</span></p>
        <p className="profile-stats">Winning Percentage: <span>+12.5%</span></p>
        <p className="profile-stats">ROI: <span>+10%</span></p>
        <button className="profile-button">Edit Profile</button>
      </div>
    </div>
  );
};

export default Profile;
