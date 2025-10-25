CREATE DATABASE driver_service_db;

\c driver_service_db;

CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_model VARCHAR(50),
    vehicle_plate VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
