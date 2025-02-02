import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import BettingPage from "./pages/BettingPage";
import "./styles/global.css"; // Global styles for consistent styling

function App() {
  return (
    <>
      <Navbar /> {/* The Navbar remains at the top of the page */}
      <div className="app-container">
        <Routes>
          {/* Define the route paths and their respective components */}
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/betting" element={<BettingPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;








