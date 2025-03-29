// lib/mongodb.ts
import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    const { connection } = await mongoose.connect(MONGODB_URI);
    if (connection.readyState === 1) {
      console.log("MongoDB connected successfully");
      return Promise.resolve(true);
    }
    throw new Error("MongoDB connection not ready");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return Promise.reject(error);
  }
};

// Test it
connectDB().then(() => console.log("Test successful")).catch(console.error);