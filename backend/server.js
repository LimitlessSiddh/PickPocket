import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";
import authRoutes from "./routes/auth.js"; // ✅ Import auth routes
import betRoutes from "./routes/bets.js"; // ✅ Import bets route
import userRoutes from "./routes/user.js"; // ✅ Import user route
import leaderboardRoutes from "./routes/leaderboard.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/user", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));