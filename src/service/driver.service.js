import { Driver } from "../models/driver.model.js";
import { axiosClient } from "../utils/axiosClient.js";

export const createDriver = async (data) => await Driver.create(data);
export const getAllDrivers = async () => await Driver.findAll();
export const getDriverById = async (driver_id) =>
  await Driver.findOne({ where: { driver_id } });

// Find available drivers with optional constraints (e.g., vehicle_type)
export const findAvailableDrivers = async (constraints = {}) => {
  const where = { is_active: true };
  if (constraints.vehicle_type) where.vehicle_type = constraints.vehicle_type;
  // Add other constraints (location) later if driver location is available
  return await Driver.findAll({ where });
};
export const updateDriver = async (driver_id, data) => {
  const driver = await Driver.findOne({ where: { driver_id } });
  if (!driver) return null;
  return driver.update(data);
};
export const deleteDriver = async (driver_id) => {
  const driver = await Driver.findOne({ where: { driver_id } });
  if (!driver) return null;
  return driver.destroy();
};
export const toggleAvailability = async (driver_id, status) => {
  const driver = await Driver.findOne({ where: { driver_id } });
  if (!driver) return null;
  return driver.update({ is_active: status });
};

export const setDriverAvailability = async (driver_id, status) => {
  return await toggleAvailability(driver_id, status);
};

// Mocked Trip Service Interaction
export const getDriverTrips = async (driver_id) => {
  try {
    const response = await axiosClient.get(`/driver/${driver_id}/trips`);
    return response.data;
  } catch (err) {
    console.log("Trip Service not available, returning mock data");
    return [
      { trip_id: 1, status: "COMPLETED", amount: 250 },
      { trip_id: 2, status: "CANCELLED", amount: 0 },
    ];
  }
};