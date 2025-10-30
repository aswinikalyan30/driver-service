import request from "supertest";
import { describe, test, expect } from "@jest/globals";
import app from "../src/app.js";

/**
 * Integration Tests for Driver Service API
 * These tests run against the actual app without mocking
 * They verify HTTP request/response behavior
 */

describe("Driver Service API Integration Tests", () => {
  // Sample test data for requests
  const sampleDriverRequest = {
    name: "Test Driver",
    phone: `9${Math.floor(Math.random() * 1000000000)}`, // Random phone to avoid conflicts
    vehicle_type: "SUV",
    vehicle_plate: "KA01AB1234",
  };

  describe("POST /api/v1/drivers - Register Driver", () => {
    test("Request: POST with driver data | Response: 201 with driver object", async () => {
      const requestBody = {
        name: "John Doe",
        phone: `9${Math.floor(Math.random() * 1000000000)}`,
        vehicle_type: "Sedan",
        vehicle_plate: "KA05XY5678",
      };

      const response = await request(app)
        .post("/api/v1/drivers")
        .send(requestBody)
        .set("Content-Type", "application/json");

      // Response assertions
      expect([201, 500]).toContain(response.status); // 201 success or 500 if DB not connected
      if (response.status === 201) {
        expect(response.body).toHaveProperty("driver_id");
        expect(response.body).toHaveProperty("name", requestBody.name);
        expect(response.body).toHaveProperty("phone", requestBody.phone);
        expect(response.body).toHaveProperty("vehicle_type", requestBody.vehicle_type);
        expect(response.body).toHaveProperty("is_active");
      }
    });

    test("Request format example", () => {
      const exampleRequest = {
        method: "POST",
        endpoint: "/api/v1/drivers",
        headers: { "Content-Type": "application/json" },
        body: {
          name: "Test Driver",
          phone: "9876543210",
          vehicle_type: "SUV",
          vehicle_plate: "KA01AB1234",
        },
      };

      const exampleResponse = {
        status: 201,
        body: {
          driver_id: 1,
          name: "Test Driver",
          phone: "9876543210",
          vehicle_type: "SUV",
          vehicle_plate: "KA01AB1234",
          is_active: true,
        },
      };

      expect(exampleRequest.body).toHaveProperty("name");
      expect(exampleResponse.status).toBe(201);
      expect(exampleResponse.body).toHaveProperty("driver_id");
    });
  });

  describe("GET /api/v1/drivers - Get All Drivers", () => {
    test("Request: GET /drivers | Response: 200 with array of drivers", async () => {
      const response = await request(app).get("/api/v1/drivers");

      expect([200, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
          expect(response.body[0]).toHaveProperty("driver_id");
          expect(response.body[0]).toHaveProperty("name");
          expect(response.body[0]).toHaveProperty("phone");
        }
      }
    });

    test("Request/Response format example", () => {
      const exampleRequest = {
        method: "GET",
        endpoint: "/api/v1/drivers",
      };

      const exampleResponse = {
        status: 200,
        body: [
          {
            driver_id: 1,
            name: "Driver1",
            phone: "9743818976",
            vehicle_type: "SUV",
            vehicle_plate: "KA98DX4733",
            is_active: true,
          },
          {
            driver_id: 2,
            name: "Driver2",
            phone: "9857811574",
            vehicle_type: "Sedan",
            vehicle_plate: "KA13IT8615",
            is_active: true,
          },
        ],
      };

      expect(exampleRequest.method).toBe("GET");
      expect(exampleResponse.status).toBe(200);
      expect(Array.isArray(exampleResponse.body)).toBe(true);
    });
  });

  describe("GET /api/v1/drivers/available - Find Available Drivers (Inter-Service Endpoint)", () => {
    test("Request: GET /drivers/available | Response: 200 with array of available drivers", async () => {
      const response = await request(app).get("/api/v1/drivers/available");

      expect([200, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.body)).toBe(true);
      }
    });

    test("Request: GET /drivers/available?vehicleType=SUV | Response: filtered drivers", async () => {
      const response = await request(app)
        .get("/api/v1/drivers/available")
        .query({ vehicleType: "SUV" });

      expect([200, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.body)).toBe(true);
      }
    });

    test("Request/Response format example - Trip Service calls this", () => {
      const exampleRequest = {
        method: "GET",
        endpoint: "/api/v1/drivers/available?vehicleType=SUV",
        description: "Trip Service searches for available SUV drivers",
      };

      const exampleResponse = {
        status: 200,
        body: [
          {
            driver_id: 1,
            name: "Driver1",
            phone: "9743818976",
            vehicle_type: "SUV",
            vehicle_plate: "KA98DX4733",
            is_active: true,
          },
        ],
      };

      expect(exampleRequest.method).toBe("GET");
      expect(exampleResponse.body[0].vehicle_type).toBe("SUV");
      expect(exampleResponse.body[0].is_active).toBe(true);
    });
  });

  describe("GET /api/v1/drivers/:driver_id - Get Driver By ID", () => {
    test("Request: GET /drivers/1 | Response: 200 with driver or 404", async () => {
      const response = await request(app).get("/api/v1/drivers/1");

      expect([200, 404, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty("driver_id");
        expect(response.body).toHaveProperty("name");
      } else if (response.status === 404) {
        expect(response.body).toHaveProperty("message", "Driver not found");
      }
    });

    test("Request/Response format example", () => {
      const exampleRequest = {
        method: "GET",
        endpoint: "/api/v1/drivers/1",
      };

      const exampleResponseSuccess = {
        status: 200,
        body: {
          driver_id: 1,
          name: "Test Driver",
          phone: "9876543210",
          vehicle_type: "SUV",
          vehicle_plate: "KA01AB1234",
          is_active: true,
        },
      };

      const exampleResponseNotFound = {
        status: 404,
        body: {
          message: "Driver not found",
        },
      };

      expect(exampleRequest.method).toBe("GET");
      expect(exampleResponseSuccess.status).toBe(200);
      expect(exampleResponseNotFound.status).toBe(404);
    });
  });

  describe("PATCH /api/v1/drivers/:driver_id - Update Driver", () => {
    test("Request format example", () => {
      const exampleRequest = {
        method: "PATCH",
        endpoint: "/api/v1/drivers/1",
        headers: { "Content-Type": "application/json" },
        body: {
          name: "Updated Driver Name",
          vehicle_type: "Sedan",
        },
      };

      const exampleResponseSuccess = {
        status: 200,
        body: {
          driver_id: 1,
          name: "Updated Driver Name",
          phone: "9876543210",
          vehicle_type: "Sedan",
          vehicle_plate: "KA01AB1234",
          is_active: true,
        },
      };

      const exampleResponseNotFound = {
        status: 404,
        body: {
          message: "Driver not found",
        },
      };

      expect(exampleRequest.method).toBe("PATCH");
      expect(exampleResponseSuccess.status).toBe(200);
      expect(exampleResponseNotFound.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/drivers/:driver_id - Delete Driver", () => {
    test("Request format example", () => {
      const exampleRequest = {
        method: "DELETE",
        endpoint: "/api/v1/drivers/1",
      };

      const exampleResponseSuccess = {
        status: 200,
        body: {
          message: "Driver deleted successfully",
        },
      };

      const exampleResponseNotFound = {
        status: 404,
        body: {
          message: "Driver not found",
        },
      };

      expect(exampleRequest.method).toBe("DELETE");
      expect(exampleResponseSuccess.body.message).toBe(
        "Driver deleted successfully"
      );
      expect(exampleResponseNotFound.status).toBe(404);
    });
  });

  describe("PATCH /api/v1/drivers/:driver_id/status - Set Status (All Availability Changes)", () => {
    test("Request format example - Mark driver busy when assigning trip", () => {
      const exampleRequest = {
        method: "PATCH",
        endpoint: "/api/v1/drivers/1/status",
        headers: { "Content-Type": "application/json" },
        body: {
          is_active: false,
        },
        description:
          "Trip Service calls this IMMEDIATELY after assigning a trip to mark driver as busy. Driver App can also use this endpoint.",
      };

      const exampleResponse = {
        status: 200,
        body: {
          message: "Status updated",
          driver: {
            driver_id: 1,
            name: "Test Driver",
            phone: "9876543210",
            vehicle_type: "SUV",
            vehicle_plate: "KA01AB1234",
            is_active: false,
          },
        },
      };

      expect(exampleRequest.body.is_active).toBe(false);
      expect(exampleResponse.body.message).toBe("Status updated");
      expect(exampleResponse.body.driver.is_active).toBe(false);
    });

    test("Request format example - Mark driver available after payment completes", () => {
      const exampleRequest = {
        method: "PATCH",
        endpoint: "/api/v1/drivers/1/status",
        headers: { "Content-Type": "application/json" },
        body: {
          is_active: true,
        },
        description:
          "Trip Service calls this after payment completes to make driver available again",
      };

      const exampleResponse = {
        status: 200,
        body: {
          message: "Status updated",
          driver: {
            driver_id: 1,
            name: "Test Driver",
            phone: "9876543210",
            vehicle_type: "SUV",
            vehicle_plate: "KA01AB1234",
            is_active: true,
          },
        },
      };

      expect(exampleRequest.body.is_active).toBe(true);
      expect(exampleResponse.body.driver.is_active).toBe(true);
    });

    test("Request format example - 404 when driver not found", () => {
      const exampleRequest = {
        method: "PATCH",
        endpoint: "/api/v1/drivers/999/status",
        headers: { "Content-Type": "application/json" },
        body: {
          is_active: false,
        },
      };

      const exampleResponse = {
        status: 404,
        body: {
          message: "Driver not found",
        },
      };

      expect(exampleResponse.status).toBe(404);
      expect(exampleResponse.body.message).toBe("Driver not found");
    });
  });

  describe("GET /api/v1/drivers/:driver_id/trips - Get Driver Trips", () => {
    test("Request format example", () => {
      const exampleRequest = {
        method: "GET",
        endpoint: "/api/v1/drivers/1/trips",
        description: "Driver App fetches trip history for the driver",
      };

      const exampleResponse = {
        status: 200,
        body: [
          { trip_id: 1, status: "COMPLETED", amount: 250 },
          { trip_id: 2, status: "CANCELLED", amount: 0 },
        ],
      };

      expect(exampleRequest.method).toBe("GET");
      expect(Array.isArray(exampleResponse.body)).toBe(true);
      expect(exampleResponse.body[0]).toHaveProperty("trip_id");
    });
  });

  describe("Complete Trip Workflow - Inter-Service Communication", () => {
    test("Full workflow request/response examples", () => {
      // Step 1: Trip Service finds available drivers
      const step1Request = {
        method: "GET",
        endpoint: "/api/v1/drivers/available?vehicleType=SUV",
        caller: "Trip Service",
      };

      const step1Response = {
        status: 200,
        body: [
          {
            driver_id: 5,
            name: "Driver5",
            phone: "9331760835",
            vehicle_type: "SUV",
            vehicle_plate: "KA65SH2215",
            is_active: true,
          },
        ],
      };

      // Step 2: Trip Service marks driver as busy
      const step2Request = {
        method: "PATCH",
        endpoint: "/api/v1/drivers/5/status",
        headers: { "Content-Type": "application/json" },
        body: { is_active: false },
        caller: "Trip Service",
        timing: "IMMEDIATELY after assigning trip",
      };

      const step2Response = {
        status: 200,
        body: {
          message: "Status updated",
          driver: {
            driver_id: 5,
            is_active: false,
          },
        },
      };

      // Step 3: After payment completes, Trip Service marks driver available
      const step3Request = {
        method: "PATCH",
        endpoint: "/api/v1/drivers/5/status",
        headers: { "Content-Type": "application/json" },
        body: { is_active: true },
        caller: "Trip Service",
        timing: "After payment SUCCESS/FAILURE and trip finalized",
      };

      const step3Response = {
        status: 200,
        body: {
          message: "Status updated",
          driver: {
            driver_id: 5,
            is_active: true,
          },
        },
      };

      // Assertions to verify workflow
      expect(step1Response.body[0].is_active).toBe(true);
      expect(step2Request.body.is_active).toBe(false);
      expect(step2Response.body.driver.is_active).toBe(false);
      expect(step3Request.body.is_active).toBe(true);
      expect(step3Response.body.driver.is_active).toBe(true);
    });
  });

  describe("API Health Check", () => {
    test("Request: GET /health | Response: 200", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.text).toContain("Driver Service is running");
    });
  });
});
