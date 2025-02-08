import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // ✅ Import auth routes
import userRoutes from "./routes/user.js"; // ✅ Import user profile route
import betRoutes from "./routes/bets.js"; // ✅ Import bet routes
import pool from "./config/db.js"; // ✅ PostgreSQL Connection

dotenv.config();

const app = express(); // ✅ Declare `app` before using it

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database Connection Check
pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected to pickpocketdb"))
  .catch(err => console.error("❌ Database Connection Error:", err));

// ✅ Route Middleware
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bets", betRoutes); // ✅ Move this here after `app` is initialized

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

