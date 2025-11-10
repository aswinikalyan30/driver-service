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

export const getAvailableTrips = async (req, res) => {
  try {
    const trips = await driverService.getAvailableTrips();
    res.json({
      message: "Available trips retrieved successfully",
      trips
    });
  } catch (err) {
    console.error('Error fetching available trips:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Failed to fetch available trips',
      error: err.error
    });
  }
};

export const acceptTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const { driver_id } = req.params;

    // Validate input
    if (!driver_id) {
      return res.status(400).json({ 
        message: "driver_id is required in request body" 
      });
    }

    const result = await driverService.acceptTrip(trip_id, driver_id);
    
    res.status(200).json({
      message: "Trip accepted successfully",
      data: result.data
    });
  } catch (err) {
    console.error('Error accepting trip:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Failed to accept trip',
      error: err.error
    });
  }
};

export const cancelTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;

    // Validate input
    if (!trip_id) {
      return res.status(400).json({ 
        message: "trip_id is required" 
      });
    }

    const result = await driverService.cancelTrip(trip_id);
    
    res.status(200).json({
      message: "Trip cancelled successfully",
      data: result.data
    });
  } catch (err) {
    console.error('Error cancelling trip:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Failed to cancel trip',
      error: err.error
    });
  }
};

export const endTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const { distance } = req.body;

    // Validate input
    if (!trip_id) {
      return res.status(400).json({ 
        message: "trip_id is required" 
      });
    }

    if (!distance) {
      return res.status(400).json({ 
        message: "distance is required in request body" 
      });
    }

    const result = await driverService.endTrip(trip_id, distance);
    
    res.status(200).json({
      message: "Trip ended successfully",
      data: result.data
    });
  } catch (err) {
    console.error('Error ending trip:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Failed to end trip',
      error: err.error
    });
  }
};