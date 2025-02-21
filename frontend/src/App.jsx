import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import BettingPage from "./pages/BettingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BetSlip from "./components/BetSlip";
import axios from "axios";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [bets, setBets] = useState([]);
  const [returnPercentage, setReturnPercentage] = useState(0);
  const [showBetSlip, setShowBetSlip] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🟢 Stored Token:", token);
    
    if (!token) return;
  
    async function fetchProfile() {
      try {
        const response = await axios.get("http://localhost:5002/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("🔴 Profile Fetch Error:", error);
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
            element={user ? (
              <BettingPage 
                user={user} 
                bets={bets} 
                setBets={setBets} 
                returnPercentage={returnPercentage} 
                setReturnPercentage={setReturnPercentage} 
                setShowBetSlip={setShowBetSlip}
              />
            ) : (
              <Navigate to="/login" />
            )}
          />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {user && showBetSlip && (
        <BetSlip bets={bets} setBets={setBets} user={user} setShowBetSlip={setShowBetSlip} />
      )}
    </Router>
  );
}

export default App;
