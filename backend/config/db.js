import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg; // ✅ Correct way to import 'pg'

// ✅ Create PostgreSQL Pool
const pool = new Pool({
  user: process.env.VITE_DB_USER ,
  host: process.env.VITE_DB_HOST,
  database: process.env.VITE_DB_NAME,  // Ensure this is correct
  password: process.env.VITE_DB_PASSWORD,
  port: process.env.VITE_DB_PORT,
  
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// ✅ Check Database Connection
pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected to", process.env.DB_NAME))
  .catch((err) => console.error("❌ PostgreSQL Connection Error:", err));

export default pool; // ✅ Export pool correctly




