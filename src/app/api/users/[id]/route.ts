import { NextRequest, NextResponse } from "next/server";
import { users, getUserById } from "@/lib/data/users";
import {
  createApiResponse,
  createErrorResponse,
  requireAuth,
  requireRole,
  formatDate,
} from "@/lib/utils";
import { UpdateUserSchema } from "@/types";
import type { UpdateUser } from "@/types";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const params = request.nextUrl.searchParams;
  const id = params.get("id") || "";

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

    // Find user by ID
    const user = getUserById(id);

    if (!user) {
      return NextResponse.json(
        createErrorResponse("NOT_FOUND", "User not found", 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createApiResponse(true, "User retrieved successfully", user)
    );
  } catch (error) {
    console.error("Error in GET /api/users/[id]:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const params = request.nextUrl.searchParams;
  const id = params.get("id") || "";

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

    // Check if user has permission to update users (admin only, or user updating their own profile)
    // Allow users to update their own profile, or admins to update any profile
    if (auth.role !== "admin") {
      // In a real app, you'd get the user ID from the JWT token
      // For this demo, we'll just check if the user is trying to update their own profile
      // This is a simplified check - in production, you'd validate against the JWT payload
      return NextResponse.json(
        createErrorResponse(
          "FORBIDDEN",
          "Insufficient permissions to update users",
          403
        ),
        { status: 403 }
      );
    }

    // Find user by ID
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        createErrorResponse("NOT_FOUND", "User not found", 404),
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate update data
    const validationResult = UpdateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse("VALIDATION_ERROR", "Invalid user data", 400),
        { status: 400 }
      );
    }

    const updateData: UpdateUser = validationResult.data;

    // Check if email is being updated and if it conflicts with existing user
    if (updateData.email) {
      const existingUserByEmail = users.find(
        (user) =>
          user.id !== id &&
          user.email.toLowerCase() === updateData.email!.toLowerCase()
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
    }

    // Check if username is being updated and if it conflicts with existing user
    if (updateData.username) {
      const existingUserByUsername = users.find(
        (user) =>
          user.id !== id &&
          user.username.toLowerCase() === updateData.username!.toLowerCase()
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
    }

    // Update user
    const updatedUser = {
      ...users[userIndex],
      ...updateData,
      updatedAt: formatDate(new Date()),
    };

    users[userIndex] = updatedUser;

    return NextResponse.json(
      createApiResponse(true, "User updated successfully", updatedUser)
    );
  } catch (error) {
    console.error("Error in PUT /api/users/[id]:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const params = request.nextUrl.searchParams;
  const id = params.get("id") || "";

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

    // Check if user has permission to delete users (admin only)
    if (!requireRole("admin", auth.role as "user" | "moderator" | "admin")) {
      return NextResponse.json(
        createErrorResponse(
          "FORBIDDEN",
          "Insufficient permissions to delete users",
          403
        ),
        { status: 403 }
      );
    }

    // Find user by ID
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        createErrorResponse("NOT_FOUND", "User not found", 404),
        { status: 404 }
      );
    }

    // Prevent deletion of admin users (safety check)
    const userToDelete = users[userIndex];
    if (userToDelete.role === "admin") {
      // Prevent deletion of any admin users
      return NextResponse.json(
        createErrorResponse("FORBIDDEN", "Cannot delete admin users", 403),
        { status: 403 }
      );
    }

    // Remove user from array
    const deletedUser = users.splice(userIndex, 1)[0];

    return NextResponse.json(
      createApiResponse(true, "User deleted successfully", deletedUser)
    );
  } catch (error) {
    console.error("Error in DELETE /api/users/[id]:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}
