import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Driver = sequelize.define(
  "Driver",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    license_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    vehicle_model: { type: DataTypes.STRING },
    vehicle_plate: { type: DataTypes.STRING },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    password: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "drivers", timestamps: false }
);
