import { NextRequest, NextResponse } from "next/server";
import {
  comments,
  getCommentsByCharacterId,
  searchComments,
} from "@/lib/data/comments";
import {
  createApiResponse,
  createErrorResponse,
  paginateArray,
  optionalAuth,
  generateId,
  formatDate,
} from "@/lib/utils";
import { CreateCommentSchema } from "@/types";
import { z } from "zod";

// Query schema for comments
const CommentQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  characterId: z.string().optional(),
  userId: z.string().optional(),
  q: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  sortBy: z.enum(["createdAt", "rating"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(request: NextRequest) {
  try {
    // Get API key from headers
    const apiKey =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    // Use optional authentication for public read access
    const auth = optionalAuth(apiKey || null);
    if (!auth.isValid) {
      return NextResponse.json(
        createErrorResponse(
          "UNAUTHORIZED",
          auth.message || "Invalid API key",
          401
        ),
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const queryResult = CommentQuerySchema.safeParse(queryParams);
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

    // Filter comments based on query
    let filteredComments = [...comments];

    // Filter by character ID
    if (query.characterId) {
      filteredComments = getCommentsByCharacterId(query.characterId);
    }

    // Filter by user ID
    if (query.userId) {
      filteredComments = filteredComments.filter(
        (comment) => comment.userId === query.userId
      );
    }

    // Search by content
    if (query.q) {
      filteredComments = searchComments(query.q);
    }

    // Filter by rating
    if (query.rating) {
      filteredComments = filteredComments.filter(
        (comment) => comment.rating === query.rating
      );
    }

    // Sort comments
    filteredComments.sort((a, b) => {
      const aValue = a[query.sortBy];
      const bValue = b[query.sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return query.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return query.sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    // Paginate results
    const { data: paginatedComments, pagination } = paginateArray(
      filteredComments,
      query.page,
      query.limit
    );

    return NextResponse.json(
      createApiResponse(
        true,
        `Successfully retrieved ${paginatedComments.length} comments`,
        paginatedComments,
        pagination
      )
    );
  } catch (error) {
    console.error("Error in GET /api/comments:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from headers
    const apiKey =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    // Validate authentication
    const auth = optionalAuth(apiKey || null);
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

    // Parse request body
    const body = await request.json();

    // Validate comment data
    const validationResult = CreateCommentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse("VALIDATION_ERROR", "Invalid comment data", 400),
        { status: 400 }
      );
    }

    const commentData = validationResult.data;

    // Validate that the character exists
    const { getCharacterById } = await import("@/lib/data/characters");
    const character = getCharacterById(commentData.characterId);
    if (!character) {
      return NextResponse.json(
        createErrorResponse("NOT_FOUND", "Character not found", 404),
        { status: 404 }
      );
    }

    // Validate that the user exists
    const { getUserById } = await import("@/lib/data/users");
    const user = getUserById(commentData.userId);
    if (!user) {
      return NextResponse.json(
        createErrorResponse("NOT_FOUND", "User not found", 404),
        { status: 404 }
      );
    }

    // Check if user has already commented on this character (optional - you might want to allow multiple comments)
    const existingComment = comments.find(
      (comment) =>
        comment.characterId === commentData.characterId &&
        comment.userId === commentData.userId
    );

    if (existingComment) {
      return NextResponse.json(
        createErrorResponse(
          "CONFLICT",
          "User has already commented on this character",
          409
        ),
        { status: 409 }
      );
    }

    // Create new comment
    const now = formatDate(new Date());
    const newComment = {
      ...commentData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    // In a real application, you would save to database
    // For this demo, we'll just return the created comment
    comments.push(newComment);

    return NextResponse.json(
      createApiResponse(true, "Comment created successfully", newComment),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/comments:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}
