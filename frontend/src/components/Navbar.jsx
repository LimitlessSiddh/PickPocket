import { Link } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">PickPocket</Link>
      <div className="nav-links">
        <Link to="/leaderboard">Leaderboard</Link>
        {user ? (
          <>
            <Link to="/profile">{user.username}</Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



