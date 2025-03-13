import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET : string = process.env.JWT_SECRET!;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  console.log("Incoming Request to Protected Route");
  console.log("Headers Received:", req.headers);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided in headers");
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  const token = authHeader.split(" ")[1]; 
  console.log("🔍 Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    console.log("Invalid or Expired Token:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
