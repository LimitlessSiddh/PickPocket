import dotenv from "dotenv";
dotenv.config();  // Load environment variables

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔍 Attempting MongoDB Connection...");
    console.log(`🔹 MONGO_URI: ${process.env.MONGO_URI || "Not Found!"}`); // Debugging

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop the server if MongoDB is not connected
  }
};

connectDB();





