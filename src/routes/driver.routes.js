import express from "express";
import * as driverController from "../controllers/driver.controller.js";

const router = express.Router();

router.post("/drivers", driverController.registerDriver);
router.get("/drivers", driverController.getAllDrivers);
router.get("/drivers/available", driverController.findAvailableDrivers);
router.get("/drivers/:driver_id", driverController.getDriverById);
router.patch("/drivers/:driver_id", driverController.updateDriver);
router.delete("/drivers/:driver_id", driverController.deleteDriver);
router.patch("/drivers/:driver_id/status", driverController.setStatus);
router.get("/drivers/:driver_id/trips", driverController.getTripsByDriver);

export default router;