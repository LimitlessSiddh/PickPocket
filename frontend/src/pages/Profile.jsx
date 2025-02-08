import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css"; // ✅ Ensure the CSS file exists

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await fetch("http://localhost:5002/api/user/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Profile fetch failed");
        }

        setUser(data); // ✅ Set user state with response data
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
        <h2 className="profile-title">Welcome, {user.username}!</h2>
        <p className="profile-email">📩 {user.email}</p>
        <p className="profile-status">🏆 Betting Stats Coming Soon...</p>
      </div>
    </div>
  );
};

export default Profile;







  