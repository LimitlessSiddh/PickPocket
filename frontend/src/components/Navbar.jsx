import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ user, setUser, theme, setTheme }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
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
        {/* Theme Toggle Button */}
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;












