import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import connectDB from "./config/db";


const PORT = process.env.PORT || 5001;


const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch {
    process.exitCode = 1;
  }
};

void startServer();
