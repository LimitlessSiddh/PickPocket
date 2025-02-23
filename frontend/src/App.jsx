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
    console.log("🟢 Stored Token:", localStorage.getItem("token"));
  
    if (!localStorage.getItem("token")) {
      console.log("🔴 No token found, user is NULL.");
      return;
    }

    async function fetchProfile() {
      try {
        const response = await axios.get("http://localhost:5002/api/user/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("✅ User data fetched:", response.data);
        setUser(response.data);

        // ✅ Fetch user's bet history to sync frontend
        fetchUserBets();
      } catch (error) {
        console.error("🔴 Profile Fetch Error:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }

    fetchProfile();
  }, []);

  const fetchUserBets = async () => {
    if (!user) return;

    try {
      const response = await axios.get("http://localhost:5002/api/bets", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("✅ User Bets Fetched:", response.data);
      setBets(response.data);
    } catch (error) {
      console.error("❌ Error fetching bets:", error);
    }
  };

  useEffect(() => {
    console.log("🟢 Current User in State:", user);
  }, [user]);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} theme={theme} setTheme={setTheme} />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={user ? <Profile user={user} fetchUserBets={fetchUserBets} /> : <Navigate to="/login" />} />
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
                fetchUserBets={fetchUserBets}
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
        <BetSlip bets={bets} setBets={setBets} user={user} setShowBetSlip={setShowBetSlip} fetchUserBets={fetchUserBets} />
      )}
    </Router>
  );
}

export default App;