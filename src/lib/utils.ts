import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  CharacterQuery,
  Character,
  ApiResponse,
  ErrorResponse,
} from "@/types";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function createApiResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
): ApiResponse {
  return {
    success,
    message,
    data,
    pagination,
  };
}

export function createErrorResponse(
  error: string,
  message: string,
  statusCode: number = 400
): ErrorResponse {
  return {
    success: false,
    error,
    message,
    statusCode,
  };
}

export function createPaginationInfo(
  page: number,
  limit: number,
  total: number
): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function paginateArray<T>(
  array: T[],
  page: number,
  limit: number
): { data: T[]; pagination: ReturnType<typeof createPaginationInfo> } {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = array.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: createPaginationInfo(page, limit, array.length),
  };
}

export function sortArray<T extends Record<string, unknown>>(
  array: T[],
  sortBy: keyof T,
  sortOrder: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
}

export function filterCharactersByQuery(
  characters: Character[],
  query: CharacterQuery
): Character[] {
  let filtered = [...characters];

  // Search by name, anime, or description
  if (query.q) {
    const searchTerm = query.q.toLowerCase();
    filtered = filtered.filter(
      (character) =>
        character.name.toLowerCase().includes(searchTerm) ||
        character.anime.toLowerCase().includes(searchTerm) ||
        character.description.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by anime
  if (query.anime) {
    filtered = filtered.filter(
      (character) =>
        character.anime.toLowerCase() === query.anime!.toLowerCase()
    );
  }

  // Filter by power range
  if (query.minPower !== undefined) {
    filtered = filtered.filter(
      (character) => character.power >= query.minPower!
    );
  }

  if (query.maxPower !== undefined) {
    filtered = filtered.filter(
      (character) => character.power <= query.maxPower!
    );
  }

  // Sort
  filtered = sortArray(filtered, query.sortBy, query.sortOrder);

  return filtered;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: Date): string {
  return date.toISOString();
}
