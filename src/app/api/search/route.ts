import { NextResponse } from "next/server";
import { characters } from "@/lib/data/characters";
import { users } from "@/lib/data/users";
import { comments } from "@/lib/data/comments";
import {
  optionalAuth,
  createErrorResponse,
  createApiResponse,
} from "@/lib/utils";
import { z } from "zod";

// Search query schema
const SearchQuerySchema = z.object({
  q: z.string().min(1),
  type: z.enum(["all", "characters", "users", "comments"]).default("all"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(["relevance", "createdAt", "updatedAt"]).default("relevance"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

interface SearchResult {
  type: "character" | "user" | "comment";
  id: string;
  relevanceScore: number;
  [key: string]: unknown;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Get API key from headers
    const apiKey =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      null;

    // Use optional authentication for public search access
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

    const queryResult = SearchQuerySchema.safeParse(queryParams);
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
    const searchTerm = query.q.toLowerCase();
    const results: SearchResult[] = [];

    // Search characters
    if (query.type === "all" || query.type === "characters") {
      const characterResults = characters
        .filter(
          (char) =>
            char.name.toLowerCase().includes(searchTerm) ||
            char.anime.toLowerCase().includes(searchTerm) ||
            char.description.toLowerCase().includes(searchTerm)
        )
        .map((char) => ({
          type: "character" as const,
          relevanceScore: calculateRelevance(char, searchTerm),
          ...char,
        }));
      results.push(...characterResults);
    }

    // Search users (only if user has permission)
    if (
      (query.type === "all" || query.type === "users") &&
      auth.role !== "guest" &&
      auth.role !== "user"
    ) {
      const userResults = users
        .filter(
          (user) =>
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        )
        .map((user) => ({
          type: "user" as const,
          relevanceScore: calculateRelevance(user, searchTerm),
          ...user,
        }));
      results.push(...userResults);
    }

    // Search comments
    if (query.type === "all" || query.type === "comments") {
      const commentResults = comments
        .filter((comment) => comment.content.toLowerCase().includes(searchTerm))
        .map((comment) => ({
          type: "comment" as const,
          relevanceScore: calculateRelevance(comment, searchTerm),
          ...comment,
        }));
      results.push(...commentResults);
    }

    // Sort results
    if (query.sortBy === "relevance") {
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else {
      results.sort((a, b) => {
        const aValue = a[query.sortBy];
        const bValue = b[query.sortBy];
        if (typeof aValue === "string" && typeof bValue === "string") {
          return query.sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    // Paginate results
    const startIndex = (query.page - 1) * query.limit;
    const endIndex = startIndex + query.limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    // Calculate facets
    const facets = {
      types: {
        character: results.filter((r) => r.type === "character").length,
        user: results.filter((r) => r.type === "user").length,
        comment: results.filter((r) => r.type === "comment").length,
      },
    };

    return NextResponse.json(
      createApiResponse(
        true,
        `Found ${results.length} results for "${query.q}"`,
        {
          query: query.q,
          totalResults: results.length,
          results: paginatedResults,
          facets,
        }
      )
    );
  } catch (error) {
    console.error("Error in search:", error);
    return NextResponse.json(
      createErrorResponse("INTERNAL_ERROR", "Internal server error", 500),
      { status: 500 }
    );
  }
}

function calculateRelevance(
  item: Record<string, unknown>,
  searchTerm: string
): number {
  let score = 0;
  const term = searchTerm.toLowerCase();

  // Exact matches get higher scores
  if (
    item.name &&
    typeof item.name === "string" &&
    item.name.toLowerCase() === term
  )
    score += 10;
  if (
    item.username &&
    typeof item.username === "string" &&
    item.username.toLowerCase() === term
  )
    score += 10;
  if (
    item.content &&
    typeof item.content === "string" &&
    item.content.toLowerCase().includes(term)
  )
    score += 5;

  // Partial matches
  if (
    item.name &&
    typeof item.name === "string" &&
    item.name.toLowerCase().includes(term)
  )
    score += 3;
  if (
    item.username &&
    typeof item.username === "string" &&
    item.username.toLowerCase().includes(term)
  )
    score += 3;
  if (
    item.description &&
    typeof item.description === "string" &&
    item.description.toLowerCase().includes(term)
  )
    score += 2;
  if (
    item.anime &&
    typeof item.anime === "string" &&
    item.anime.toLowerCase().includes(term)
  )
    score += 2;

  return Math.min(score, 10); // Cap at 10
}
