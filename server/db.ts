import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.warn("MONGODB_URI not found in environment variables. Skipped database connection.");
      return;
    }

    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // process.exit(1); // Don't exit on DB failure for debugging
  }
}
