import express from "express";
import dotenv from "dotenv";
import driverRoutes from "./routes/driver.routes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/v1", driverRoutes);

app.get("/health", (req, res) => res.status(200).json({ 
    status: "healthy", 
    service: "driver-service",
    message: "Driver Service is running 🚗"
}));

export default app;
