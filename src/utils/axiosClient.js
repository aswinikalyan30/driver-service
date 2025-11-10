import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Trip Service URL - defaults to Docker service name if not set
const TRIP_SERVICE_URL = process.env.TRIP_SERVICE_URL || 'http://trip-service:5000';

export const axiosClient = axios.create({
  baseURL: TRIP_SERVICE_URL,
  timeout: 10000, // Increased timeout for better reliability
});