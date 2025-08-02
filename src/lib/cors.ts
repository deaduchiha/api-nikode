import { NextRequest, NextResponse } from "next/server";

export interface CorsConfig {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const defaultConfig: CorsConfig = {
  origin: "*", // Allow all origins in development
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-api-key",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
};

export function createCorsMiddleware(config: CorsConfig = {}) {
  const corsConfig = { ...defaultConfig, ...config };

  return function corsMiddleware(request: NextRequest) {
    const origin = request.headers.get("origin");
    const method = request.method;

    // Handle preflight requests
    if (method === "OPTIONS") {
      const response = new NextResponse(null, { status: 200 });

      // Set CORS headers
      if (corsConfig.origin === "*" || corsConfig.origin === true) {
        response.headers.set("Access-Control-Allow-Origin", "*");
      } else if (typeof corsConfig.origin === "string") {
        response.headers.set("Access-Control-Allow-Origin", corsConfig.origin);
      } else if (Array.isArray(corsConfig.origin)) {
        if (origin && corsConfig.origin.includes(origin)) {
          response.headers.set("Access-Control-Allow-Origin", origin);
        }
      }

      if (corsConfig.methods) {
        response.headers.set(
          "Access-Control-Allow-Methods",
          corsConfig.methods.join(", ")
        );
      }

      if (corsConfig.allowedHeaders) {
        response.headers.set(
          "Access-Control-Allow-Headers",
          corsConfig.allowedHeaders.join(", ")
        );
      }

      if (corsConfig.credentials) {
        response.headers.set("Access-Control-Allow-Credentials", "true");
      }

      if (corsConfig.maxAge) {
        response.headers.set(
          "Access-Control-Max-Age",
          corsConfig.maxAge.toString()
        );
      }

      return response;
    }

    return null; // Continue to the actual handler
  };
}

export function addCorsHeaders(
  response: NextResponse,
  config: CorsConfig = {}
) {
  const corsConfig = { ...defaultConfig, ...config };
  const origin = "*"; // You can make this dynamic based on the request

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    corsConfig.methods?.join(", ") || "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    corsConfig.allowedHeaders?.join(", ") ||
      "Content-Type, Authorization, x-api-key, X-Requested-With, Accept, Origin"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

// Helper function to handle CORS in API routes
export function withCors(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config?: CorsConfig
) {
  return async function corsHandler(request: NextRequest) {
    // Handle preflight requests
    if (request.method === "OPTIONS") {
      const corsMiddleware = createCorsMiddleware(config);
      const preflightResponse = corsMiddleware(request);
      if (preflightResponse) {
        return preflightResponse;
      }
    }

    // Call the actual handler
    const response = await handler(request);

    // Add CORS headers to the response
    return addCorsHeaders(response, config);
  };
}
