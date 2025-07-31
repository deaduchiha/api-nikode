import { beforeAll, afterAll, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global test setup
beforeAll(() => {
  // Mock environment variables
  // process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret-key";
  process.env.API_KEY = "test-api-key";
});

// Global test teardown
afterAll(() => {
  // Clean up any global state
});
