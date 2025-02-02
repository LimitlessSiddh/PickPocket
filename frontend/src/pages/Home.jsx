import { useNavigate } from "react-router-dom";
import "../styles/Home.css";


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
     
      <h2 className="home-title">Welcome to PickPocket</h2>
      <p className="home-subtitle">Track your bets, prove your skills.</p>

      <button className="bet-button" onClick={() => navigate("/betting")}>
        Let's Fleece
      </button>
    </div>
  );
};

export default Home;










  