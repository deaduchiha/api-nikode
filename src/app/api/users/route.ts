import { NextResponse } from "next/server";
import { users, searchUsers } from "@/lib/data/users";
import {
  createApiResponse,
  createErrorResponse,
  paginateArray,
  requireAuth,
  requireRole,
  generateId,
  formatDate,
} from "@/lib/utils";
import { CreateUserSchema } from "@/types";
import { z } from "zod";
import type { CreateUser } from "@/types";

// Query schema for users
const UserQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  q: z.string().optional(),
  role: z.enum(["user", "moderator", "admin"]).optional(),
  active: z.coerce.boolean().optional(),
  sortBy: z
    .enum(["username", "email", "role", "createdAt"])
    .default("username"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Get API key from headers
    const apiKey =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      null;

    // Validate authentication
    const auth = requireAuth(apiKey);
    if (!auth.isValid) {
      return NextResponse.json(
        createErrorResponse(
          "UNAUTHORIZED",
          auth.message || "Authentication required",
          401
        ),
        { status: 401 }
      );
    }

    // Check if user has permission to view users (moderator or admin)
    if (
      !requireRole("moderator", auth.role as "user" | "moderator" | "admin")
    ) {
      return NextResponse.json(
        createErrorResponse(
          "FORBIDDEN",
          "Insufficient permissions to view users",
          403
        ),
        { status: 403 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const queryResult = UserQuerySchema.safeParse(queryParams);
    if (!queryResult.success) {
      return NextResponse.json(
        createErrorResponse(
          "VALIDATION_ERROR",
          "Invalid query parameters",
          400
        ),
        { status: 400 }
      );
    }

    const query = queryResult.data;

    // Filter users based on query
    let filteredUsers = [...users];

    // Search by username or email
    if (query.q) {
      filteredUsers = searchUsers(query.q);
    }

    // Filter by role
    if (query.role) {
      filteredUsers = filteredUsers.filter((user) => user.role === query.role);
    }

    // Filter by active status
    if (query.active !== undefined) {
      filteredUsers = filteredUsers.filter(
        (user) => user.isActive === query.active
      );
    }

    // Sort users
    filteredUsers.sort((a, b) => {
      const aValue = a[query.sortBy];
      const bValue = b[query.sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return query.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    // Paginate results
    const { data: paginatedUsers, pagination } = paginateArray(
      filteredUsers,
      query.page,
      query.limit
    );

    return NextResponse.json(
      createApiResponse(
        true,
        `Successfully retrieved ${paginatedUsers.length} users`,
        paginatedUsers,
        pagination
      )
    );
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Get API key from headers
    const apiKey =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      null;

    // Validate authentication
    const auth = requireAuth(apiKey);
    if (!auth.isValid) {
      return NextResponse.json(
        createErrorResponse(
          "UNAUTHORIZED",
          auth.message || "Authentication required",
          401
        ),
        { status: 401 }
      );
    }

    // Check if user has permission to create users (admin only)
    if (!requireRole("admin", auth.role as "user" | "moderator" | "admin")) {
      return NextResponse.json(
        createErrorResponse(
          "FORBIDDEN",
          "Insufficient permissions to create users",
          403
        ),
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate user data
    const validationResult = CreateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse("VALIDATION_ERROR", "Invalid user data", 400),
        { status: 400 }
      );
    }

    const userData: CreateUser = validationResult.data;

    // Check if user with same email already exists
    const existingUserByEmail = users.find(
      (user) => user.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (existingUserByEmail) {
      return NextResponse.json(
        createErrorResponse(
          "CONFLICT",
          "User with this email already exists",
          409
        ),
        { status: 409 }
      );
    }

    // Check if user with same username already exists
    const existingUserByUsername = users.find(
      (user) => user.username.toLowerCase() === userData.username.toLowerCase()
    );

    if (existingUserByUsername) {
      return NextResponse.json(
        createErrorResponse(
          "CONFLICT",
          "User with this username already exists",
          409
        ),
        { status: 409 }
      );
    }

    // Create new user
    const now = formatDate(new Date());
    const newUser = {
      ...userData,
      id: generateId(),
      avatar: userData.avatar || "",
      role: userData.role || "user",
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: now,
      updatedAt: now,
    };

    // In a real application, you would save to database
    // For this demo, we'll just return the created user
    users.push(newUser);

    return NextResponse.json(
      createApiResponse(true, "User created successfully", newUser),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}
