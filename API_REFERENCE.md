# Driver Service - API Quick Reference

## Base URL
```
http://localhost:5001/api/v1
```

---

## All Endpoints

### 1. Register Driver
```http### 8. Get Driver Trips
```http
GET /drivers/1/trips

Response: 200
[
  { "trip_id": 1, "status": "COMPLETED", "amount": 250 },
  { "trip_id": 2, "status": "CANCELLED", "amount": 0 }
]
```

### 9. Health Checkrs
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",
  "vehicle_type": "SUV",
  "vehicle_plate": "KA01AB1234"
}

Response: 201
{
  "driver_id": 1,
  "name": "John Doe",
  "phone": "9876543210",
  "vehicle_type": "SUV",
  "vehicle_plate": "KA01AB1234",
  "is_active": true
}
```

### 2. Get All Drivers
```http
GET /drivers

Response: 200
[
  {
    "driver_id": 1,
    "name": "Driver1",
    "phone": "9743818976",
    "vehicle_type": "SUV",
    "vehicle_plate": "KA98DX4733",
    "is_active": true
  }
]
```

### 3. Find Available Drivers (Trip Service)
```http
GET /drivers/available
GET /drivers/available?vehicleType=SUV

Response: 200
[
  {
    "driver_id": 1,
    "name": "Driver1",
    "phone": "9743818976",
    "vehicle_type": "SUV",
    "vehicle_plate": "KA98DX4733",
    "is_active": true
  }
]
```

### 4. Get Driver By ID
```http
GET /drivers/1

Response: 200
{
  "driver_id": 1,
  "name": "Test Driver",
  "phone": "9876543210",
  "vehicle_type": "SUV",
  "vehicle_plate": "KA01AB1234",
  "is_active": true
}

Response: 404
{
  "message": "Driver not found"
}
```

### 5. Update Driver (Partial Update)
```http
PATCH /drivers/1
Content-Type: application/json

{
  "name": "Updated Name",
  "vehicle_type": "Sedan"
}

Response: 200
{
  "driver_id": 1,
  "name": "Updated Name",
  "phone": "9876543210",
  "vehicle_type": "Sedan",
  "vehicle_plate": "KA01AB1234",
  "is_active": true
}
```

### 6. Delete Driver
```http
DELETE /drivers/1

Response: 200
{
  "message": "Driver deleted successfully"
}
```

### 7. Set Status - Change Availability (Trip Service & Driver App)
```http
PATCH /drivers/1/status
Content-Type: application/json

{
  "is_active": false
}

Response: 200
{
  "message": "Status updated",
  "driver": {
    "driver_id": 1,
    "name": "Test Driver",
    "phone": "9876543210",
    "vehicle_type": "SUV",
    "vehicle_plate": "KA01AB1234",
    "is_active": false
  }
}
```

### 8. Get Driver Trips
```http
GET /drivers/1/trips

Response: 200
[
  { "trip_id": 1, "status": "COMPLETED", "amount": 250 },
  { "trip_id": 2, "status": "CANCELLED", "amount": 0 }
]
```

### 10. Health Check
```http
GET /health

Response: 200
Driver Service is running 🚗
```

---

## Inter-Service Workflow

### Trip Assignment Flow

**1. Find Available Drivers**
```bash
curl 'http://localhost:5001/api/v1/drivers/available?vehicleType=SUV'
```

**2. Mark Driver Busy (Assign Trip)**
```bash
curl -X PATCH 'http://localhost:5001/api/v1/drivers/1/status' \
  -H 'Content-Type: application/json' \
  -d '{"is_active": false}'
```

**3. Mark Driver Available (After Payment)**
```bash
curl -X PATCH 'http://localhost:5001/api/v1/drivers/1/status' \
  -H 'Content-Type: application/json' \
  -d '{"is_active": true}'
```

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Database Schema

```sql
CREATE TABLE drivers (
    driver_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50),
    vehicle_plate VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE
);
```
