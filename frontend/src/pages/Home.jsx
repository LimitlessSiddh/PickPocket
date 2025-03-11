import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      <div className="home-header">
        <h2 className="home-title">Welcome to PickPocket</h2>
      </div>

      <div className="home-content">
        <h4 className="home-subtitle">Track your bets, prove your skills.</h4>

        <button className="bet-button" onClick={() => navigate("/betting")}>
          Let's Fleece
        </button>

      </div>

    </div>
  );
};

export default Home;










