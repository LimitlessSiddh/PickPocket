import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.ts";
import authRoutes from "./routes/auth.ts";
import betRoutes from "./routes/bets.ts"; 
import userRoutes from "./routes/user.ts";
import leaderboardRoutes from "./routes/leaderboard.ts";
import cron from "node-cron";
import { validateBets } from "./routes/validateBets.ts"; 

dotenv.config();

import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "server.log");

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, ""); // Create an empty log file if missing
}

function logMessage(message : string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  try {
    fs.appendFileSync(logFile, logEntry, "utf8");
  } catch (error) {
    console.error("Error writing to server.log:", error);
  }
}

console.log = (...args : string[]) => {
  logMessage(args.join(" "));
  process.stdout.write(args.join(" ") + "\n");
};

console.error = (...args : string[]) => {
  logMessage("ERROR: " + args.join(" "));
  process.stderr.write(args.join(" ") + "\n");
};

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
  methods: "GET,POST,PUT,DELETE",
}));

app.use(express.json());

const PORT = process.env.PORT || 5002;

app.use("/api/auth", authRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/user", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/", (req: AuthReq, res: AuthRes) => {
  res.send("Backend is running!");
});

cron.schedule("*/5 * * * *", async () => {
  console.log("Running automatic bet validation...");
  try {
    const response = await validateBets();
    console.log("Auto-validation response:", response);
  } catch (error) {
    console.error("Auto-validation failed:", error);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));