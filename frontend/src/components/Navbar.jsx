import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ user, setUser, theme, setTheme }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  // ✅ Toggle Theme Function
  const toggleTheme = () => {
    console.log("🌓 Toggling Theme...");
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">PickPocket</Link>
      </div>
      <div className="navbar-links">
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/betting">Betting</Link>
      </div>
      <div className="navbar-auth">
        {user ? (
          <>
            <Link to="/profile" className="profile-btn">👤 {user.username}</Link>
            <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">🔑 Login</Link>
            <Link to="/register" className="register-btn">📝 Register</Link>
          </>
        )}
      </div>

      {/* ✅ Toggle Switch for Dark Mode */}
      <label className="theme-switch">
        <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
        <span className="slider"></span>
      </label>
    </nav>
  );
};

export default Navbar;











