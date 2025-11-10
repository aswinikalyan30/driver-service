#!/bin/bash
set -e

echo "Loading driver seed data from CSV..."

# Check if drivers table has data
DRIVER_COUNT=$(PGPASSWORD=driverpass psql -h postgres-driver -U driveruser -d driver_service_db -t -A -c "SELECT COUNT(*) FROM drivers;" 2>/dev/null || echo "0")

if [ "$DRIVER_COUNT" = "0" ]; then
    echo "No drivers found, loading seed data..."
    PGPASSWORD=driverpass psql -h postgres-driver -U driveruser -d driver_service_db <<SQL
    COPY drivers(driver_id, name, phone, vehicle_type, vehicle_plate, is_active) 
    FROM STDIN 
    WITH (FORMAT csv, HEADER true, DELIMITER ',');
SQL
    cat /seed-data/rhfd_drivers.csv
    
    FINAL_COUNT=$(PGPASSWORD=driverpass psql -h postgres-driver -U driveruser -d driver_service_db -t -A -c "SELECT COUNT(*) FROM drivers;" 2>/dev/null)
    echo "Driver seed data loading completed! Loaded $FINAL_COUNT drivers."
else
    echo "Database already has $DRIVER_COUNT drivers, skipping seed data"
fi

