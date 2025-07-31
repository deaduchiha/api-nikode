import { describe, it, expect } from "vitest";
import { GET, POST } from "@/app/api/characters/route";
import {
  GET as GET_CHARACTER,
  PUT,
  DELETE,
} from "@/app/api/characters/[id]/route";

describe("Characters API", () => {
  describe("GET /api/characters", () => {
    it("should return characters without API key (public access)", async () => {
      const request = new Request("http://localhost:3000/api/characters");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("should return characters with valid API key", async () => {
      const request = new Request("http://localhost:3000/api/characters", {
        headers: {
          "x-api-key": "demo-api-key-123",
        },
      });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("should support pagination", async () => {
      const request = new Request(
        "http://localhost:3000/api/characters?page=1&limit=5"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(5);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(5);
    });

    it("should support search by name", async () => {
      const request = new Request(
        "http://localhost:3000/api/characters?q=goku"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.length).toBeGreaterThan(0);
      expect(data.data[0].name.toLowerCase()).toContain("goku");
    });

    it("should support filtering by anime", async () => {
      const request = new Request(
        "http://localhost:3000/api/characters?anime=dragon%20ball"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.length).toBeGreaterThan(0);
      expect(data.data[0].anime.toLowerCase()).toBe("dragon ball");
    });

    it("should support sorting by power", async () => {
      const request = new Request(
        "http://localhost:3000/api/characters?sortBy=power&sortOrder=desc"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.length).toBeGreaterThan(1);
      expect(data.data[0].power).toBeGreaterThanOrEqual(data.data[1].power);
    });

    it("should support power range filtering", async () => {
      const request = new Request(
        "http://localhost:3000/api/characters?minPower=90&maxPower=100"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.length).toBeGreaterThan(0);
      data.data.forEach((character: { power: number }) => {
        expect(character.power).toBeGreaterThanOrEqual(90);
        expect(character.power).toBeLessThanOrEqual(100);
      });
    });
  });

  describe("POST /api/characters", () => {
    it("should return 403 without API key (write operations require auth)", async () => {
      const request = new Request("http://localhost:3000/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Character",
          anime: "Test Anime",
          power: 50,
          intelligence: 50,
          speed: 50,
          strength: 50,
          image: "https://example.com/image.jpg",
          description: "A test character",
          abilities: ["Test Ability"],
          personality: "Test personality",
        }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("FORBIDDEN");
    });

    it("should return 403 with user role", async () => {
      const request = new Request("http://localhost:3000/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "demo-api-key-123",
        },
        body: JSON.stringify({
          name: "Test Character",
          anime: "Test Anime",
          power: 80,
          intelligence: 70,
          speed: 75,
          strength: 85,
          image: "https://example.com/image.jpg",
          description: "A test character for testing purposes",
          abilities: ["Test Ability"],
          personality: "Test personality",
          hairColor: "Black",
          eyeColor: "Blue",
        }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("FORBIDDEN");
    });

    it("should create character with moderator role", async () => {
      const request = new Request("http://localhost:3000/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "test-api-key-456",
        },
        body: JSON.stringify({
          name: "Test Character",
          anime: "Test Anime",
          power: 80,
          intelligence: 70,
          speed: 75,
          strength: 85,
          image: "https://example.com/image.jpg",
          description: "A test character for testing purposes",
          abilities: ["Test Ability"],
          personality: "Test personality",
          hairColor: "Black",
          eyeColor: "Blue",
        }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe("Test Character");
      expect(data.data.id).toBeDefined();
    });

    it("should validate required fields", async () => {
      const request = new Request("http://localhost:3000/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "test-api-key-456",
        },
        body: JSON.stringify({
          name: "",
          anime: "Test Anime",
          power: 80,
        }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /api/characters/[id]", () => {
    it("should return character by ID", async () => {
      const request = new Request("http://localhost:3000/api/characters/1", {
        headers: {
          "x-api-key": "demo-api-key-123",
        },
      });
      const response = await GET_CHARACTER(request, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe("1");
    });

    it("should return 404 for non-existent character", async () => {
      const request = new Request("http://localhost:3000/api/characters/999", {
        headers: {
          "x-api-key": "demo-api-key-123",
        },
      });
      const response = await GET_CHARACTER(request, { params: { id: "999" } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("NOT_FOUND");
    });
  });

  describe("PUT /api/characters/[id]", () => {
    it("should update character with moderator role", async () => {
      const request = new Request("http://localhost:3000/api/characters/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "test-api-key-456",
        },
        body: JSON.stringify({
          power: 99,
          description: "Updated description",
        }),
      });
      const response = await PUT(request, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.power).toBe(99);
      expect(data.data.description).toBe("Updated description");
    });

    it("should return 403 with user role", async () => {
      const request = new Request("http://localhost:3000/api/characters/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "demo-api-key-123",
        },
        body: JSON.stringify({
          power: 99,
        }),
      });
      const response = await PUT(request, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("FORBIDDEN");
    });
  });

  describe("DELETE /api/characters/[id]", () => {
    it("should delete character with admin role", async () => {
      const request = new Request("http://localhost:3000/api/characters/15", {
        method: "DELETE",
        headers: {
          "x-api-key": "admin-api-key-789",
        },
      });
      const response = await DELETE(request, { params: { id: "15" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe("15");
    });

    it("should return 403 with non-admin role", async () => {
      const request = new Request("http://localhost:3000/api/characters/1", {
        method: "DELETE",
        headers: {
          "x-api-key": "demo-api-key-123",
        },
      });
      const response = await DELETE(request, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("FORBIDDEN");
    });
  });
});
