import { Driver } from "../models/driver.model.js";
import { axiosClient } from "../utils/axiosClient.js";

export const createDriver = async (data) => await Driver.create(data);
export const getAllDrivers = async () => await Driver.findAll();

export const getDriverById = async (driver_id) => {
  const id = typeof driver_id === 'string' ? parseInt(driver_id, 10) : driver_id;
  // findByPk is sufficient and will return null if not found
  const driver = await Driver.findByPk(id);
  // Optional: driver?.reload(); if you absolutely need a fresh data pull after getting it
  return driver;
};

// Find available drivers with optional constraints (e.g., vehicle_type)
export const findAvailableDrivers = async (constraints = {}) => {
  const where = { is_active: true };
  if (constraints.vehicle_type) where.vehicle_type = constraints.vehicle_type;
  // Add other constraints (location) later if driver location is available
  return await Driver.findAll({ where });
};
export const updateDriver = async (driver_id, data) => {
  try {
    // Convert driver_id to integer if it's a string
    const id = typeof driver_id === 'string' ? parseInt(driver_id, 10) : driver_id;
    const driver = await Driver.findByPk(id);
    if (!driver) return null;
    
    // Update fields directly on the instance
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        driver[key] = data[key];
      }
    });
    
    // Explicitly save to ensure database commit
    await driver.save();
    
    // Reload to get the latest data from database
    await driver.reload();
    
    return driver;
  } catch (error) {
    console.error('Error updating driver:', error);
    throw error;
  }
};

export const deleteDriver = async (driver_id) => {
  const rowsDestroyed = await Driver.destroy({
    where: { driver_id }
  });
  return rowsDestroyed > 0;
};
export const toggleAvailability = async (driver_id, status) => {
  try {
    // Convert driver_id to integer if it's a string
    const id = typeof driver_id === 'string' ? parseInt(driver_id, 10) : driver_id;
    const driver = await Driver.findByPk(id);
    if (!driver) return null;
    
    // Update the status
    driver.is_active = status;
    
    // Explicitly save to ensure database commit
    await driver.save();
    
    // Reload to get the latest data from database
    await driver.reload();
    
    return driver;
  } catch (error) {
    console.error('Error updating driver availability:', error);
    throw error;
  }
};

export const setDriverAvailability = async (driver_id, status) => {
  return await toggleAvailability(driver_id, status);
};

// Get trips for a driver from Trip Service
export const getDriverTrips = async (driver_id) => {
  try {
    // Convert driver_id to string if it's a number (Trip Service expects string)
    const driverIdStr = String(driver_id);
    const response = await axiosClient.get(`/v1/trips/driver/${driverIdStr}`);
    
    // Transform the response to match expected format
    if (response.data && response.data.trips) {
      return response.data.trips.map(trip => ({
        trip_id: trip.trip_id,
        rider_id: trip.rider_id,
        driver_id: trip.driver_id,
        pickup_location: trip.pickup_location,
        drop_location: trip.drop_location,
        status: trip.status,
        fare: trip.fare || 0,
        distance: trip.distance || 0,
        created_at: trip.created_at,
        updated_at: trip.updated_at
      }));
    }
    
    return response.data?.trips || [];
  } catch (err) {
    console.error(`Error fetching trips for driver ${driver_id}:`, err.message);
    // Return empty array instead of mock data for better error handling
    return [];
  }
};

// Get all available trips (REQUESTED status) from Trip Service
export const getAvailableTrips = async () => {
  try {
    const response = await axiosClient.get('/v1/trips/available');
    
    // Transform the response to match expected format
    if (response.data && response.data.trips) {
      return response.data.trips.map(trip => ({
        trip_id: trip.trip_id,
        rider_id: trip.rider_id,
        pickup_location: trip.pickup_location,
        drop_location: trip.drop_location,
        status: trip.status,
        created_at: trip.created_at
      }));
    }
    
    return response.data?.trips || [];
  } catch (err) {
    console.error('Error fetching available trips:', err.message);
    throw {
      status: err.response?.status || 500,
      message: 'Failed to fetch available trips',
      error: err.response?.data || err.message
    };
  }
};

// Accept a trip by calling Trip Service
export const acceptTrip = async (trip_id, driver_id) => {
  try {
    // Validate inputs
    if (!trip_id || !driver_id) {
      throw {
        status: 400,
        message: 'trip_id and driver_id are required'
      };
    }

    // Convert driver_id to string if it's a number (Trip Service expects string)
    const driverIdStr = String(driver_id);
    
    // Call Trip Service to accept the trip
    const response = await axiosClient.post(`/v1/trips/${trip_id}/accept`, {
      driver_id: driverIdStr
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (err) {
    console.error(`Error accepting trip ${trip_id} for driver ${driver_id}:`, err.message);
    
    if (err.response) {
      // Trip Service returned an error
      throw {
        status: err.response.status,
        message: 'Trip Service Error',
        error: err.response.data
      };
    }
    
    // Re-throw if it's already a formatted error
    if (err.status) {
      throw err;
    }
    
    // Other errors (network, timeout, etc.)
    throw {
      status: 500,
      message: 'Failed to accept trip',
      error: err.message
    };
  }
};

  // Cancel a trip by calling Trip Service
  export const cancelTrip = async (trip_id) => {
    try {
      // Validate input
      if (!trip_id) {
        throw {
          status: 400,
          message: 'trip_id is required'
        };
      }
      
      // Call Trip Service to cancel the trip
      // Trip Service uses PATCH method for cancel endpoint by trip_id
      const response = await axiosClient.patch(`/v1/trips/${trip_id}/cancel`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      console.error(`Error cancelling trip ${trip_id}:`, err.message);
      
      if (err.response) {
        // Trip Service returned an error
        throw {
          status: err.response.status,
          message: 'Trip Service Error',
          error: err.response.data
        };
      }
      
      // Re-throw if it's already a formatted error
      if (err.status) {
        throw err;
      }
      
      // Other errors (network, timeout, etc.)
      throw {
        status: 500,
        message: 'Failed to cancel trip',
        error: err.message
      };
    }
  };

  // End a trip by calling Trip Service
  export const endTrip = async (trip_id, distance) => {
    try {
      // Validate inputs
      if (!trip_id) {
        throw {
          status: 400,
          message: 'trip_id is required'
        };
      }

      if (!distance || isNaN(parseFloat(distance))) {
        throw {
          status: 400,
          message: 'distance is required and must be a valid number'
        };
      }

      // Convert trip_id to string if it's a number (Trip Service expects string in URL)
      const tripIdStr = String(trip_id);
      
      // Call Trip Service to end the trip
      // Trip Service expects: POST /v1/trips/:trip_id/end with body: { distance: <number> }
      const response = await axiosClient.post(`/v1/trips/${tripIdStr}/end`, {
        distance: parseFloat(distance)
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      console.error(`Error ending trip ${trip_id}:`, err.message);
      
      if (err.response) {
        // Trip Service returned an error
        throw {
          status: err.response.status,
          message: 'Trip Service Error',
          error: err.response.data
        };
      }
      
      // Re-throw if it's already a formatted error
      if (err.status) {
        throw err;
      }
      
      // Other errors (network, timeout, etc.)
      throw {
        status: 500,
        message: 'Failed to end trip',
        error: err.message
      };
    }
  };