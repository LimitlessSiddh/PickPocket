import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const ODDS_API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = "https://api.the-odds-api.com/v4/sports";

// ✅ Fetch live odds for a specific sport
router.get("/:sport", async (req, res) => {
  try {
    const sport = req.params.sport; // Example: "soccer_epl"
    const region = "us"; // Change based on where most users are
    const markets = "h2h,spreads,totals"; // Moneyline, Spreads, Totals

    const response = await axios.get(
      `${BASE_URL}/${sport}/odds`, {
        params: {
          apiKey: ODDS_API_KEY,
          regions: region,
          markets: markets
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching odds:", error);
    res.status(500).json({ message: "Failed to fetch odds." });
  }
});

export default router;
