import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">PickPocket</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/betting">Betting</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;



