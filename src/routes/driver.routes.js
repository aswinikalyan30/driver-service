import express from "express";
import * as driverController from "../controllers/driver.controller.js";

const router = express.Router();

router.post("/drivers", driverController.registerDriver);
router.get("/drivers", driverController.getAllDrivers);
router.get("/drivers/:id", driverController.getDriverById);
router.put("/drivers/:id", driverController.updateDriver);
router.delete("/drivers/:id", driverController.deleteDriver);
router.patch("/drivers/:id/status", driverController.changeAvailability);
router.get("/drivers/:id/trips", driverController.getTripsByDriver);

export default router;