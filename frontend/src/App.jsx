import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import BettingPage from "./pages/BettingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BetSlip from "./components/BetSlip"; // ✅ Import BetSlip Component
import axios from "axios";
import "./index.css"; // ✅ Keep only index.css for global styles

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [bets, setBets] = useState([]); // ✅ Store bets in slip
  const [returnPercentage, setReturnPercentage] = useState(0); // ✅ Track return impact

  // ✅ Handle Theme Switching
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ✅ Fetch User Profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    async function fetchProfile() {
      try {
        const response = await axios.get("http://localhost:5002/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }

    fetchProfile();
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} theme={theme} setTheme={setTheme} />

      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route 
            path="/betting" 
            element={
              <BettingPage 
                bets={bets} 
                setBets={setBets} 
                returnPercentage={returnPercentage} 
                setReturnPercentage={setReturnPercentage} 
              />
            } 
          />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* ✅ Persistent Bet Slip at the bottom of the screen */}
      {bets.length > 0 && (
        <BetSlip bets={bets} setBets={setBets} returnPercentage={returnPercentage} />
      )}
    </Router>
  );
}

export default App;

