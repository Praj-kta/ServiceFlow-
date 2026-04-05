import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  const MONGODB_URI = process.env.MONGO_URI;

  console.log("🔗 MongoDB URI:", MONGODB_URI);

  if (!MONGODB_URI) {
    console.error("❌ MONGO_URI not found in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
}