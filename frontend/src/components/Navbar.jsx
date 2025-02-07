import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css"; // ✅ Ensure the CSS file exists

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login"); // ✅ Redirect after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/"> PickPocket</Link>
      </div>
      <div className="navbar-links">
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/betting">Betting</Link>
      </div>
      <div className="navbar-auth">
        {user ? (
          <>
            {/* ✅ Click on username navigates correctly */}
            <button className="profile-btn" onClick={() => navigate("/profile")}>
              👤 {user.username}
            </button>
            <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">🔑 Login</Link>
            <Link to="/register" className="register-btn">📝 Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;






