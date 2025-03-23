import express from "express";
import pool from "../config/db.ts";
import authMiddleware from "../middleware/authMiddleware.ts";
import multer from "multer";
import bcrypt from "bcryptjs";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET /profile
router.get("/profile", authMiddleware, async (req: AuthReq, res: AuthRes) => {
  try {
    const userId = req.user.id;
    const userQuery = await pool.query(
      "SELECT id, username, email, avatar, score, level FROM users WHERE id = $1",
      [userId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userQuery.rows[0]);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// PUT /profile
router.put("/profile", authMiddleware, async (req: AuthReq, res: AuthRes) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    await pool.query(
      "UPDATE users SET username = $1, email = $2 WHERE id = $3",
      [username, email, userId]
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// PUT /profile/password
router.put("/profile/password", authMiddleware, async (req: AuthReq, res: AuthRes) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const userQuery = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(currentPassword, userQuery.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedNewPassword, userId]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password Update Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// PUT /profile/avatar
router.put("/profile/avatar", authMiddleware, upload.single("avatar"), async (req: AuthReq, res: AuthRes) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: "No avatar file uploaded." });
    }

    const avatarData = req.file.buffer.toString("base64");

    await pool.query("UPDATE users SET avatar = $1 WHERE id = $2", [avatarData, userId]);

    res.status(200).json({ message: "Avatar updated successfully" });
  } catch (error) {
    console.error("Avatar Upload Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

export default router;
