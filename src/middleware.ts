import { NextResponse, type NextRequest } from "next/server";

// CORS configuration
const ALLOWED_ORIGIN = "*"; // Change to your domain in production
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
].join(", ");

function setCorsHeaders(response: NextResponse, origin: string | null) {
  response.headers.set(
    "Access-Control-Allow-Origin",
    ALLOWED_ORIGIN === "*" ? "*" : origin || ALLOWED_ORIGIN
  );
  response.headers.set("Vary", "Origin");
  response.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  response.headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400"); // 24h
}

export function middleware(request: NextRequest) {
  // Only apply to API routes via matcher below
  if (request.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 204 });
    setCorsHeaders(preflight, request.headers.get("origin"));
    return preflight;
  }

  const response = NextResponse.next();
  setCorsHeaders(response, request.headers.get("origin"));
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
