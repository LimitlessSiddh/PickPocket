import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5002/api/user/profile", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Profile fetch failed");
        }

        setUser(data);
      } catch (err) {
        console.error("❌ Profile Fetch Error:", err.message);
        setError(err.message);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) return <p className="error">{error}</p>;
  if (!user) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="Profile Avatar"
          className="profile-avatar"
        />
        <h2 className="profile-title">Welcome, {user.username}!</h2>
        <p className="profile-email">📩 {user.email}</p>

        <div className="profile-stats">
          <p>🏆 <span className="highlight">Betting History:</span> Coming Soon...</p>
          <p>💰 <span className="highlight">ROI:</span> --$</p>
          <p>📊 <span className="highlight">Win Rate:</span> --%</p>
        </div>

        <div className="profile-buttons">
          <button className="edit-profile-btn">Edit Profile</button>
          <button className="upload-avatar-btn">Upload Avatar</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;







  