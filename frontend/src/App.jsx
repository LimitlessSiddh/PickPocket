import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import BettingPage from "./pages/BettingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    async function checkSession() {
      try {
        console.log("🔍 Checking session...");
        const response = await fetch("http://localhost:5002/api/user/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          localStorage.removeItem("token");
          setUser(null);
          return;
        }

        const data = await response.json();
        console.log("✅ Session Active:", data);
        setUser(data);
      } catch (error) {
        console.error("❌ Session check failed:", error);
        setUser(null);
      }
    }

    checkSession();
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Login setUser={setUser} />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/betting" element={<BettingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;









