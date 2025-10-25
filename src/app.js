import express from "express";
import dotenv from "dotenv";
import driverRoutes from "./routes/driver.routes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/v1", driverRoutes);

app.get("/health", (req, res) => res.send("Driver Service is running 🚗"));

connectDB();

export default app;
