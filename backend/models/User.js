import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "default-avatar.png" }, // Profile Picture
  totalBets: { type: Number, default: 0 },
  betsWon: { type: Number, default: 0 },
  betsLost: { type: Number, default: 0 },
  roi: { type: Number, default: 0 }, // Return on investment percentage
}, { timestamps: true });

export default mongoose.model("User", UserSchema);





