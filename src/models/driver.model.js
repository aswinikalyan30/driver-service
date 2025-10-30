import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Driver = sequelize.define(
  "Driver",
  {
    driver_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    vehicle_type: { type: DataTypes.STRING },
    vehicle_plate: { type: DataTypes.STRING },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: "drivers", timestamps: false }
);
