import { NextResponse } from "next/server";
import { getCharacterById } from "@/lib/data/characters";
import { characters } from "@/lib/data/characters";
import {
  createApiResponse,
  createErrorResponse,
  requireAuth,
  requireRole,
  formatDate,
} from "@/lib/utils";
import { UpdateCharacterSchema } from "@/types";
import type { UpdateCharacter } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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

    const { id } = params;

    // Find character by ID
    const character = getCharacterById(id);

    if (!character) {
      return NextResponse.json(
        createErrorResponse("NOT_FOUND", "Character not found", 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createApiResponse(true, "Character retrieved successfully", character)
    );
  } catch (error) {
    console.error("Error in GET /api/characters/[id]:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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

    // Check if user has permission to update characters (moderator or admin)
    if (
      !requireRole("moderator", auth.role as "user" | "moderator" | "admin")
    ) {
      return NextResponse.json(
        createErrorResponse(
          "FORBIDDEN",
          "Insufficient permissions to update characters",
          403
        ),
        { status: 403 }
      );
    }

    const { id } = params;

    // Find character by ID
    const characterIndex = characters.findIndex((char) => char.id === id);

    if (characterIndex === -1) {
      return NextResponse.json(
        createErrorResponse("NOT_FOUND", "Character not found", 404),
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate update data
    const validationResult = UpdateCharacterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse("VALIDATION_ERROR", "Invalid character data", 400),
        { status: 400 }
      );
    }

    const updateData: UpdateCharacter = validationResult.data;

    // Check if name is being updated and if it conflicts with existing character
    if (updateData.name) {
      const existingCharacter = characters.find(
        (char) =>
          char.id !== id &&
          char.name.toLowerCase() === updateData.name!.toLowerCase()
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
    }

    // Update character
    const updatedCharacter = {
      ...characters[characterIndex],
      ...updateData,
      updatedAt: formatDate(new Date()),
    };

    characters[characterIndex] = updatedCharacter;

    return NextResponse.json(
      createApiResponse(
        true,
        "Character updated successfully",
        updatedCharacter
      )
    );
  } catch (error) {
    console.error("Error in PUT /api/characters/[id]:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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

    // Check if user has permission to delete characters (admin only)
    if (!requireRole("admin", auth.role as "user" | "moderator" | "admin")) {
      return NextResponse.json(
        createErrorResponse(
          "FORBIDDEN",
          "Insufficient permissions to delete characters",
          403
        ),
        { status: 403 }
      );
    }

    const { id } = params;

    // Find character by ID
    const characterIndex = characters.findIndex((char) => char.id === id);

    if (characterIndex === -1) {
      return NextResponse.json(
        createErrorResponse("NOT_FOUND", "Character not found", 404),
        { status: 404 }
      );
    }

    // Remove character from array
    const deletedCharacter = characters.splice(characterIndex, 1)[0];

    return NextResponse.json(
      createApiResponse(
        true,
        "Character deleted successfully",
        deletedCharacter
      )
    );
  } catch (error) {
    console.error("Error in DELETE /api/characters/[id]:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}
