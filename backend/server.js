import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";
import authRoutes from "./routes/auth.js";
import betRoutes from "./routes/bets.js"; // ✅ Keep this for placing/retrieving bets
import userRoutes from "./routes/user.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import cron from "node-cron";
import { validateBets } from "./routes/validateBets.js"; // ✅ Import new function

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5002;

// ✅ Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/user", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ✅ CRON JOB: Auto-validate bets every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("🔄 Running automatic bet validation...");
  try {
    const response = await validateBets();
    console.log("✅ Auto-validation response:", response);
  } catch (error) {
    console.error("❌ Auto-validation failed:", error);
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));