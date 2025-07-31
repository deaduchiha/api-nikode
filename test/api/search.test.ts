import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/search/route";

describe("Search API", () => {
  describe("GET /api/search", () => {
    it("should work without API key (public access)", async () => {
      const request = new Request("http://localhost:3000/api/search?q=test");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.query).toBe("test");
    });

    it("should return 401 with invalid API key", async () => {
      const request = new Request("http://localhost:3000/api/search?q=test", {
        headers: {
          "x-api-key": "invalid-key",
        },
      });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("UNAUTHORIZED");
    });

    it("should work with valid API key", async () => {
      const request = new Request("http://localhost:3000/api/search?q=test", {
        headers: {
          "x-api-key": "demo-api-key-123",
        },
      });
      const response = await GET(request);

      // The search should work with valid authentication
      expect(response.status).toBe(200);
    });

    it("should work with Bearer token", async () => {
      const request = new Request("http://localhost:3000/api/search?q=test", {
        headers: {
          authorization: "Bearer demo-api-key-123",
        },
      });
      const response = await GET(request);

      // The search should work with Bearer token authentication
      expect(response.status).toBe(200);
    });
  });
});
