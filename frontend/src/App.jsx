import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/verify", { credentials: "include" });
        const data = await response.json();
        if (response.ok) setUser(data);
      } catch {
        setUser(null);
      }
    }
    checkSession();
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Login setUser={setUser} />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/betting" element={<BettingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;








