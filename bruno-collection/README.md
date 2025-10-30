# Driver Service - Bruno API Collection

This Bruno collection provides a complete set of API requests for testing and interacting with the Driver Service.

## 📁 Collection Structure

```
bruno-collection/
├── bruno.json                          # Collection metadata
├── environments/
│   └── Local.bru                       # Local environment (port 5001)
├── Drivers/                            # Core driver CRUD operations
│   ├── 1. Register Driver.bru
│   ├── 2. Get All Drivers.bru
│   ├── 3. Get Driver By ID.bru
│   ├── 4. Update Driver.bru
│   └── 5. Delete Driver.bru
├── Availability (Inter-Service)/       # Trip Service integration points
│   ├── 1. Find Available Drivers.bru
│   ├── 2. Mark Driver Busy.bru
│   └── 3. Mark Driver Available.bru
├── Trips/                              # Driver trip history
│   └── Get Driver Trips.bru
└── System/                             # System monitoring
    └── Health Check.bru
```

## 🚀 Getting Started

### Prerequisites
- [Bruno](https://www.usebruno.com/) installed on your machine
- Driver Service running on `http://localhost:5001`

### Import Collection

**Method 1: Open Collection (Recommended)**
1. Open Bruno application
2. Click **"Open Collection"** button (top left) or use **File → Open Collection**
3. In the file picker, navigate to: `/Users/aswinik/driver-service`
4. Select the **`bruno-collection`** folder (not individual files inside it)
5. Click **"Open"** or **"Select Folder"**

**Method 2: Drag and Drop**
1. Open Bruno application
2. Open Finder and navigate to `/Users/aswinik/driver-service`
3. Drag the **`bruno-collection`** folder into Bruno window
4. Collection will be imported automatically

**Method 3: File Menu**
1. In Bruno, go to **File → Open Collection**
2. Browse to `/Users/aswinik/driver-service/bruno-collection`
3. Click **"Open"**

> **Important**: You must select the **folder** (`bruno-collection`), not individual `.bru` files

## 🌍 Environments

### Local Environment
- **Base URL**: `http://localhost:5001/api/v1`
- **Usage**: Default environment for local development
- **File**: `environments/Local.bru`

To switch environments:
1. Click the environment dropdown in Bruno
2. Select **"Local"**

## 📝 Testing Workflows

### Complete Driver Lifecycle

1. **Register Driver**
   - Run: `Drivers > 1. Register Driver`
   - Note the `driver_id` from response

2. **Get All Drivers**
   - Run: `Drivers > 2. Get All Drivers`
   - Verify your driver is in the list

3. **Get Driver Details**
   - Run: `Drivers > 3. Get Driver By ID`
   - Update `driver_id` in URL path

4. **Update Driver Profile**
   - Run: `Drivers > 4. Update Driver`
   - Modify request body as needed

5. **Delete Driver**
   - Run: `Drivers > 5. Delete Driver`
   - Driver is permanently removed

### Trip Assignment Flow (Inter-Service)

Simulates how Trip Service interacts with Driver Service:

1. **Find Available Drivers**
   - Run: `Availability > 1. Find Available Drivers`
   - Optional: Add `?vehicleType=SUV` to filter by vehicle type
   - Trip Service calls this to find drivers

2. **Mark Driver Busy (Assignment)**
   - Run: `Availability > 2. Mark Driver Busy`
   - Trip Service calls this when assigning a trip
   - Sets `is_active: false`

3. **Mark Driver Available (After Payment)**
   - Run: `Availability > 3. Mark Driver Available`
   - Trip Service calls this after payment completes
   - Sets `is_active: true`

### Driver Trip History

1. **Get Driver Trips**
   - Run: `Trips > Get Driver Trips`
   - Returns all trips for a specific driver
   - Calls Trip Service internally

## 🔧 Customizing Requests

### Using Variables

All requests use the `{{baseUrl}}` variable. To change the base URL:

1. Open `environments/Local.bru`
2. Update the `baseUrl` variable:
   ```
   vars {
     baseUrl: http://your-new-url/api/v1
   }
   ```

### Modifying Request Bodies

Each request has pre-filled example data. Update as needed:

**Example: Register Driver**
```json
{
  "name": "Your Driver Name",
  "phone": "9876543210",
  "vehicle_type": "SUV",
  "vehicle_plate": "KA01AB1234"
}
```

**Valid Vehicle Types:**
- `SUV`
- `Sedan`
- `Hatchback`
- `Auto`
- `Bike`

### Path Parameters

For requests with `:driver_id` in the URL:
- Replace `1` with your actual driver ID
- Example: `{{baseUrl}}/drivers/5`

## 📊 Response Examples

### Successful Driver Registration (201)
```json
{
  "driver_id": 1,
  "name": "John Doe",
  "phone": "9876543210",
  "vehicle_type": "SUV",
  "vehicle_plate": "KA01AB1234",
  "is_active": true
}
```

### Available Drivers List (200)
```json
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

### Driver Not Found (404)
```json
{
  "message": "Driver not found"
}
```

## 🎯 Use Cases

### For Developers
- **Local Testing**: Run requests against your local development server
- **Integration Testing**: Verify endpoint behavior and response formats
- **Debugging**: Inspect request/response payloads

### For Trip Service Integration
Use the **Availability (Inter-Service)** folder to test:
- Finding available drivers for trip assignment
- Marking drivers busy during trips
- Marking drivers available after trip completion

### For QA Testing
- **Regression Testing**: Run all requests in sequence
- **Edge Cases**: Modify payloads to test validation
- **Error Scenarios**: Test with invalid driver IDs, duplicate phones

## 🔍 Quick Tips

1. **Run in Sequence**: Execute requests in numerical order within each folder
2. **Check Status**: Always verify `is_active` status when testing availability
3. **Unique Phones**: Phone numbers must be unique - use different numbers for each driver
4. **Driver IDs**: Update path parameters with actual IDs from your database
5. **Environment**: Ensure "Local" environment is selected before running requests

## 📚 Related Documentation

- **API Reference**: `../API_REFERENCE.md`
- **Swagger Specification**: `../swagger.yaml`
- **Integration Tests**: `../tests/driver.integration.test.js`
- **Change Log**: `../PATCH_UPDATE_SUMMARY.md`

## 🆘 Troubleshooting

### Connection Refused
- **Issue**: Cannot connect to `http://localhost:5001`
- **Solution**: Ensure Driver Service is running (`npm start`)

### 404 Driver Not Found
- **Issue**: Driver ID doesn't exist
- **Solution**: Run "Get All Drivers" to see valid IDs

### Phone Already Exists
- **Issue**: Duplicate phone number during registration
- **Solution**: Use a unique phone number

### Empty Available Drivers
- **Issue**: No drivers returned from "Find Available Drivers"
- **Solution**: Check that drivers have `is_active: true`

## 📞 Support

For issues or questions about the Driver Service API:
- Review test suite: `tests/driver.integration.test.js`
- Check service logs for errors
- Verify database connection and seed data

---

**Last Updated**: January 2025  
**Bruno Version**: Compatible with Bruno v1.x  
**API Version**: v1.0.0
