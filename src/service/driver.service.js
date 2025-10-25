import { Driver } from "../models/driver.model.js";
import { axiosClient } from "../utils/axiosClient.js";

export const createDriver = async (data) => await Driver.create(data);
export const getAllDrivers = async () => await Driver.findAll();
export const getDriverById = async (id) => await Driver.findByPk(id);
export const updateDriver = async (id, data) => {
  const driver = await Driver.findByPk(id);
  if (!driver) return null;
  return driver.update(data);
};
export const deleteDriver = async (id) => {
  const driver = await Driver.findByPk(id);
  if (!driver) return null;
  return driver.destroy();
};
export const toggleAvailability = async (id, status) => {
  const driver = await Driver.findByPk(id);
  if (!driver) return null;
  return driver.update({ is_active: status });
};

// Mocked Trip Service Interaction
export const getDriverTrips = async (id) => {
  try {
    const response = await axiosClient.get(`/driver/${id}/trips`);
    return response.data;
  } catch (err) {
    console.log("Trip Service not available, returning mock data");
    return [
      { trip_id: 1, status: "COMPLETED", amount: 250 },
      { trip_id: 2, status: "CANCELLED", amount: 0 },
    ];
  }
};