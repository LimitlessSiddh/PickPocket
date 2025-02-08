import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // ✅ Import auth routes
import userRoutes from "./routes/user.js"; // ✅ Import user profile route
import pool from "./config/db.js"; // ✅ PostgreSQL Connection

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Route Middleware
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
