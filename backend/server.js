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

import fs from "fs";
import path from "path";

// ✅ Define the correct log file path
const logFile = path.join(process.cwd(), "server.log");

// ✅ Ensure the log file exists before writing
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, ""); // Create an empty log file if missing
}

// ✅ Function to write logs
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  try {
    fs.appendFileSync(logFile, logEntry, "utf8");
  } catch (error) {
    console.error("❌ Error writing to server.log:", error);
  }
}

// ✅ Override console.log and console.error
console.log = (...args) => {
  logMessage(args.join(" "));
  process.stdout.write(args.join(" ") + "\n");
};

console.error = (...args) => {
  logMessage("ERROR: " + args.join(" "));
  process.stderr.write(args.join(" ") + "\n");
};


const app = express();

app.use(cors({
  origin: "http://localhost:5174", 
  credentials: true, 
  methods: "GET,POST,PUT,DELETE",
}));

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
