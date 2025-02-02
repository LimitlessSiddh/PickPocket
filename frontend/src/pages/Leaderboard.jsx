import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const topBettors = [
    { username: "Kamiko", picks: 150, percentage: "+25.3%" },
    { username: "NoLimitSiddh", picks: 200, percentage: "+22.7%" },
    { username: "NiggaBalls", picks: 180, percentage: "+18.9%" },
  ];

  // Sort bettors by percentage (highest first)
  const sortedBettors = [...topBettors].sort((a, b) => 
    parseFloat(b.percentage) - parseFloat(a.percentage)
  );

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h2 className="leaderboard-title">Leaderboard</h2>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Username</th>
              <th>Picks</th>
              <th>Return Percentage</th>
            </tr>
          </thead>
          <tbody>
            {sortedBettors.map((bettor, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{bettor.username}</td>
                <td>{bettor.picks}</td>
                <td>{bettor.percentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;



