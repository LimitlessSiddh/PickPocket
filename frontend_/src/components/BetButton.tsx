import { useNavigate } from "react-router-dom";

const BetButton = () => {
  const navigate = useNavigate();

  return (
    <div className="bet-button-container">
      <button className="bet-button" onClick={() => navigate("/select-bets")}>
        Make Your Picks
      </button>
    </div>
  );
};

export default BetButton;
