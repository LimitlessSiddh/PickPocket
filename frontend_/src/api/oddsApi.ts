import axios from "axios";

const API_KEY = process.env.REACT_APP_ODDS_API_KEY; // Reads from .env
const BASE_URL = "https://api.the-odds-api.com/v4/sports";

export const fetchOdds = async (sport = "basketball_nba", region = "us", markets = "h2h") => {
  try {
    const response = await axios.get(`${BASE_URL}/${sport}/odds`, {
      params: {
        apiKey: API_KEY,
        regions: region,
        markets: markets, 
        oddsFormat: "decimal",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching odds:", error);
    return [];
  }
};

