import mongoose from "mongoose";
import middlewareLogger from "../../../middleware/logging";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/BandA";

export default async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    // middlewareLogger.logger.fatal("Error connecting to database", error);
    console.error("❌ MongoDB connection error:", error);
  }
}

export async function closeDbConnection() {
  try {
    await mongoose.connection.close();
    console.log('Mongoose default connection closed.');
  } catch (error) {
    console.error('Error closing connection:', error);
  }
}