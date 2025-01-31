import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>PickPocket</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </div>
    </nav>
  );
};

export default Navbar;


