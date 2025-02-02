import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const topBettors = [
    { username: "SharpShooter", percentage: "+25.3%" },
    { username: "BetKing", percentage: "+22.7%" },
    { username: "HotHand", percentage: "+18.9%" },
  ];

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h2 className="leaderboard-title">Leaderboard</h2>
        <ul className="leaderboard-list">
          {topBettors.map((bettor, index) => (
            <li key={index} className="leaderboard-item">
              <span>{bettor.username}</span>
              <span>{bettor.percentage}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;


