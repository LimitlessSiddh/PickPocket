import { Link } from "react-router-dom";
import "../styles/Nav.css";

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/"><h1>PickPocket</h1></Link>
      </div>
      <nav className="navbar-right">
        {user ? (
          <>
            <Link to="/profile" className="profile-btn"> {user.username}</Link>
            <button onClick={handleLogout} className="navbar-links">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-links"><h3>Login</h3></Link>
          </>
        )}
        <Link to="/leaderboard"><h3>Leaderboard</h3></Link>
      </nav>
    </header>
  );
};

export default Navbar;












