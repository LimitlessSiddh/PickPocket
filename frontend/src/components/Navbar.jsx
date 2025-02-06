import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ user, setUser }) => {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">PickPocket</Link>
      <div className="nav-links">
        <Link to="/leaderboard" className="nav-button leaderboard-button">Leaderboard</Link>
        {user ? (
          <>
            <Link to="/profile" className="nav-button">{user.username}</Link>
            <button className="nav-button logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/register" className="nav-button signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;




