import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg; // ✅ Correct way to import 'pg'

// ✅ Create PostgreSQL Pool
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "127.0.0.1",
  database: process.env.DB_NAME || "pickpocketdb",  // Ensure this is correct
  password: process.env.DB_PASSWORD || "DoublePS2025",
  port: process.env.DB_PORT || 5432,
  
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// ✅ Check Database Connection
pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected to", process.env.DB_NAME))
  .catch((err) => console.error("❌ PostgreSQL Connection Error:", err));

export default pool; // ✅ Export pool correctly




