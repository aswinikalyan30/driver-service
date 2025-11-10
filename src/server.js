import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

// Connect to database first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚘 Driver Service running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("❌ Failed to start server due to database connection error:", error);
  process.exit(1);
});
