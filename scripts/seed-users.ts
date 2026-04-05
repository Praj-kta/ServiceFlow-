import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../server/models/User";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGO_URI not found");
  process.exit(1);
}

const seedUsers = [
  {
    name: "John Doe",
    email: "user@test.com",
    password: "password123",
    role: "user"
  },
  {
    name: "Admin User",
    email: "admin@test.com",
    password: "admin123",
    role: "admin"
  }
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB Connected");

    await User.deleteMany({});

    const users = await Promise.all(
      seedUsers.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10)
      }))
    );

    await User.insertMany(users);

    console.log("✅ Users seeded successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();