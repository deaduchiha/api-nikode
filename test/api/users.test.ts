import { describe, it, expect } from "vitest";
import { GET, POST } from "@/app/api/users/route";
import { GET as GET_USER, PUT, DELETE } from "@/app/api/users/[id]/route";

describe("Users API", () => {
  describe("GET /api/users", () => {
    it("should return 401 without API key", async () => {
      const request = new Request("http://localhost:3000/api/users");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("UNAUTHORIZED");
    });

    it("should return 403 with user role", async () => {
      const request = new Request("http://localhost:3000/api/users", {
        headers: {
          "x-api-key": "demo-api-key-123",
        },
      });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("FORBIDDEN");
    });

    it("should return users with moderator role", async () => {
      const request = new Request("http://localhost:3000/api/users", {
        headers: {
          "x-api-key": "test-api-key-456",
        },
      });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
      expect(data.pagination).toBeDefined();
    });

    it("should support pagination", async () => {
      const request = new Request(
        "http://localhost:3000/api/users?page=1&limit=5",
        {
          headers: {
            "x-api-key": "test-api-key-456",
          },
        }
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.length).toBeLessThanOrEqual(5);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(5);
    });

    it("should support search by username", async () => {
      const request = new Request("http://localhost:3000/api/users?q=admin", {
        headers: {
          "x-api-key": "test-api-key-456",
        },
      });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(
        data.data.some((user) => user.username.toLowerCase().includes("admin"))
      ).toBe(true);
    });

    it("should support filtering by role", async () => {
      const request = new Request(
        "http://localhost:3000/api/users?role=admin",
        {
          headers: {
            "x-api-key": "test-api-key-456",
          },
        }
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.every((user) => user.role === "admin")).toBe(true);
    });

    it("should support filtering by active status", async () => {
      const request = new Request(
        "http://localhost:3000/api/users?active=true",
        {
          headers: {
            "x-api-key": "test-api-key-456",
          },
        }
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.every((user) => user.isActive === true)).toBe(true);
    });

    it("should support sorting", async () => {
      const request = new Request(
        "http://localhost:3000/api/users?sortBy=username&sortOrder=asc",
        {
          headers: {
            "x-api-key": "test-api-key-456",
          },
        }
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      const usernames = data.data.map((user) => user.username);
      expect(usernames).toEqual([...usernames].sort());
    });
  });

  describe("POST /api/users", () => {
    it("should return 401 without API key", async () => {
      const request = new Request("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser",
          email: "test@example.com",
        }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("UNAUTHORIZED");
    });

    it("should return 403 with non-admin role", async () => {
      const request = new Request("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "test-api-key-456",
        },
        body: JSON.stringify({
          username: "testuser",
          email: "test@example.com",
        }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("FORBIDDEN");
    });

    it("should create user with admin role", async () => {
      const request = new Request("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "admin-api-key-789",
        },
        body: JSON.stringify({
          username: "newuser",
          email: "newuser@example.com",
          role: "user",
        }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.username).toBe("newuser");
      expect(data.data.email).toBe("newuser@example.com");
      expect(data.data.role).toBe("user");
      expect(data.data.id).toBeDefined();
    });

    it("should validate required fields", async () => {
      const request = new Request("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "admin-api-key-789",
        },
        body: JSON.stringify({
          username: "",
          email: "invalid-email",
        }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /api/users/[id]", () => {
    it("should return user by ID", async () => {
      const request = new Request("http://localhost:3000/api/users/1", {
        headers: {
          "x-api-key": "demo-api-key-123",
        },
      });
      const response = await GET_USER(request, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe("1");
    });

    it("should return 404 for non-existent user", async () => {
      const request = new Request("http://localhost:3000/api/users/999", {
        headers: {
          "x-api-key": "demo-api-key-123",
        },
      });
      const response = await GET_USER(request, { params: { id: "999" } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("NOT_FOUND");
    });
  });

  describe("PUT /api/users/[id]", () => {
    it("should update user with admin role", async () => {
      const request = new Request("http://localhost:3000/api/users/3", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "admin-api-key-789",
        },
        body: JSON.stringify({
          username: "updateduser",
          email: "updated@example.com",
        }),
      });
      const response = await PUT(request, { params: { id: "3" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.username).toBe("updateduser");
      expect(data.data.email).toBe("updated@example.com");
    });

    it("should return 403 with non-admin role", async () => {
      const request = new Request("http://localhost:3000/api/users/3", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "demo-api-key-123",
        },
        body: JSON.stringify({
          username: "updateduser",
        }),
      });
      const response = await PUT(request, { params: { id: "3" } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("FORBIDDEN");
    });
  });

  describe("DELETE /api/users/[id]", () => {
    it("should delete user with admin role", async () => {
      const request = new Request("http://localhost:3000/api/users/10", {
        method: "DELETE",
        headers: {
          "x-api-key": "admin-api-key-789",
        },
      });
      const response = await DELETE(request, { params: { id: "10" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe("10");
    });

    it("should return 403 with non-admin role", async () => {
      const request = new Request("http://localhost:3000/api/users/3", {
        method: "DELETE",
        headers: {
          "x-api-key": "demo-api-key-123",
        },
      });
      const response = await DELETE(request, { params: { id: "3" } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("FORBIDDEN");
    });

    it("should prevent deletion of admin users", async () => {
      const request = new Request("http://localhost:3000/api/users/1", {
        method: "DELETE",
        headers: {
          "x-api-key": "admin-api-key-789",
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
