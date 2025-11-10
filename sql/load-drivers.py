#!/usr/bin/env python3
import csv
import psycopg2
import sys
import os

# Database connection
conn = psycopg2.connect(
    host=os.getenv('DB_HOST', 'postgres-driver'),
    port=os.getenv('DB_PORT', '5432'),
    database=os.getenv('DB_NAME', 'driver_service_db'),
    user=os.getenv('DB_USER', 'driveruser'),
    password=os.getenv('DB_PASS', 'driverpass')
)

cur = conn.cursor()

# Check if drivers exist
cur.execute("SELECT COUNT(*) FROM drivers;")
count = cur.fetchone()[0]

if count == 0:
    print(f"No drivers found. Loading seed data...")
    
    # Read CSV and insert
    csv_path = '/seed-data/rhfd_drivers.csv'
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cur.execute("""
                INSERT INTO drivers (driver_id, name, phone, vehicle_type, vehicle_plate, is_active)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (driver_id) DO NOTHING
            """, (
                row['driver_id'],
                row['name'],
                row['phone'],
                row['vehicle_type'],
                row['vehicle_plate'],
                row['is_active'].lower() == 'true'
            ))
    
    conn.commit()
    
    # Get final count
    cur.execute("SELECT COUNT(*) FROM drivers;")
    final_count = cur.fetchone()[0]
    
    # Reset the sequence to match the max driver_id
    print("Resetting driver_id sequence...")
    cur.execute("SELECT setval('drivers_driver_id_seq', (SELECT MAX(driver_id) FROM drivers));")
    conn.commit()
    
    print(f"Driver seed data loading completed! Loaded {final_count} drivers.")
else:
    print(f"Database already has {count} drivers, skipping seed data")
    
    # Still reset the sequence even if data already exists (in case of manual inserts)
    print("Resetting driver_id sequence to ensure it's in sync...")
    cur.execute("SELECT setval('drivers_driver_id_seq', (SELECT MAX(driver_id) FROM drivers));")
    conn.commit()

cur.close()
conn.close()

