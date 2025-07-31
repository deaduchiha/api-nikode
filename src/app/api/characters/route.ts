import { NextResponse } from "next/server";

import { characters } from "@/lib/data/characters";
import {
  createApiResponse,
  createErrorResponse,
  paginateArray,
  filterCharactersByQuery,
  optionalAuth,
  requireRole,
  generateId,
  formatDate,
} from "@/lib/utils";

import { CharacterQuerySchema, CreateCharacterSchema } from "@/types";
import type { CreateCharacter } from "@/types";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Get API key from headers
    const apiKey =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      null;

    // Use optional authentication for public read access
    const auth = optionalAuth(apiKey);
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

    const queryResult = CharacterQuerySchema.safeParse(queryParams);
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

    // Filter and sort characters based on query
    const filteredCharacters = filterCharactersByQuery(characters, query);

    // Paginate results
    const { data: paginatedCharacters, pagination } = paginateArray(
      filteredCharacters,
      query.page,
      query.limit
    );

    return NextResponse.json(
      createApiResponse(
        true,
        `Successfully retrieved ${paginatedCharacters.length} characters`,
        paginatedCharacters,
        pagination
      )
    );
  } catch (error) {
    console.error("Error in GET /api/characters:", error);
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

    // Require authentication for write operations
    const auth = optionalAuth(apiKey);
    if (!auth.isValid) {
      return NextResponse.json(
        createErrorResponse(
          "UNAUTHORIZED",
          auth.message || "Authentication required for write operations",
          401
        ),
        { status: 401 }
      );
    }

    // Check if user has permission to create characters (moderator or admin)
    if (
      auth.role === "guest" ||
      !requireRole("moderator", auth.role as "user" | "moderator" | "admin")
    ) {
      return NextResponse.json(
        createErrorResponse(
          "FORBIDDEN",
          "Insufficient permissions to create characters",
          403
        ),
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate character data
    const validationResult = CreateCharacterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse("VALIDATION_ERROR", "Invalid character data", 400),
        { status: 400 }
      );
    }

    const characterData: CreateCharacter = validationResult.data;

    // Check if character with same name already exists
    const existingCharacter = characters.find(
      (char) => char.name.toLowerCase() === characterData.name.toLowerCase()
    );

    if (existingCharacter) {
      return NextResponse.json(
        createErrorResponse(
          "CONFLICT",
          "Character with this name already exists",
          409
        ),
        { status: 409 }
      );
    }

    // Create new character
    const now = formatDate(new Date());
    const newCharacter = {
      ...characterData,
      id: generateId(),
      birthday: characterData.birthday || "",
      height: characterData.height || "",
      weight: characterData.weight || "",
      createdAt: now,
      updatedAt: now,
    };

    // In a real application, you would save to database
    // For this demo, we'll just return the created character
    characters.push(newCharacter);

    return NextResponse.json(
      createApiResponse(true, "Character created successfully", newCharacter),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/characters:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}
