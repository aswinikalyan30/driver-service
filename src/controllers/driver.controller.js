import * as driverService from "../service/driver.service.js";

export const registerDriver = async (req, res) => {
  try {
    const newDriver = await driverService.createDriver(req.body);
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllDrivers = async (req, res) => {
  const drivers = await driverService.getAllDrivers();
  res.json(drivers);
};

export const getDriverById = async (req, res) => {
  const driver = await driverService.getDriverById(req.params.driver_id);
  driver
    ? res.json(driver)
    : res.status(404).json({ message: "Driver not found" });
};

export const updateDriver = async (req, res) => {
  const updated = await driverService.updateDriver(req.params.driver_id, req.body);
  updated
    ? res.json(updated)
    : res.status(404).json({ message: "Driver not found" });
};

export const deleteDriver = async (req, res) => {
  const deleted = await driverService.deleteDriver(req.params.driver_id);
  deleted
    ? res.json({ message: "Driver deleted successfully" })
    : res.status(404).json({ message: "Driver not found" });
};

export const getTripsByDriver = async (req, res) => {
  const trips = await driverService.getDriverTrips(req.params.driver_id);
  res.json(trips);
};

export const findAvailableDrivers = async (req, res) => {
  // Accept query params like vehicle_type
  const constraints = { vehicle_type: req.query.vehicleType || req.query.vehicle_type };
  const drivers = await driverService.findAvailableDrivers(constraints);
  res.json(drivers);
};

export const setStatus = async (req, res) => {
  // Trip Service calls this to set availability (body: { is_active: false })
  const updated = await driverService.setDriverAvailability(
    req.params.driver_id,
    req.body.is_active
  );
  updated
    ? res.json({ message: "Status updated", driver: updated })
    : res.status(404).json({ message: "Driver not found" });
};