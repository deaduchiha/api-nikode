import { NextResponse, type NextRequest } from "next/server";

// CORS configuration
const ALLOWED_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
].join(", ");
const ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
  "Accept",
  "Origin",
  "Params",
  "Query",
  "Body",
  "Headers",
].join(", ");

function setCorsHeaders(
  response: NextResponse,
  origin: string | null,
  request: NextRequest
) {
  const requestOrigin = origin && origin !== "null" ? origin : null;
  const allowOrigin = requestOrigin ?? "*";

  response.headers.set("Access-Control-Allow-Origin", allowOrigin);
  if (allowOrigin !== "*") {
    response.headers.set("Vary", "Origin");
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  response.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);

  // Echo requested headers for preflight, fallback to allowed list
  const requestedHeaders = request.headers.get(
    "access-control-request-headers"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    requestedHeaders || ALLOWED_HEADERS
  );

  response.headers.set("Access-Control-Max-Age", "86400"); // 24h
}

export function middleware(request: NextRequest) {
  // Only apply to API routes via matcher below
  if (request.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 204 });
    setCorsHeaders(preflight, request.headers.get("origin"), request);
    return preflight;
  }

  const response = NextResponse.next();
  setCorsHeaders(response, request.headers.get("origin"), request);
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
