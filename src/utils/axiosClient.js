import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const axiosClient = axios.create({
  baseURL: process.env.TRIP_SERVICE_URL,
  timeout: 5000,
});