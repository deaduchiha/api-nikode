import { z } from "zod";

// Base schemas
export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  anime: z.string().min(1),
  power: z.number().min(0).max(100),
  intelligence: z.number().min(0).max(100),
  speed: z.number().min(0).max(100),
  strength: z.number().min(0).max(100),
  image: z.string().url(),
  description: z.string().min(10),
  abilities: z.array(z.string()),
  personality: z.string(),
  birthday: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  hairColor: z.string(),
  eyeColor: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Character = z.infer<typeof CharacterSchema>;

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  avatar: z.string().url().optional(),
  role: z.enum(["user", "admin", "moderator"]).default("user"),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const CommentSchema = z.object({
  id: z.string(),
  characterId: z.string(),
  userId: z.string(),
  content: z.string().min(1).max(500),
  rating: z.number().min(1).max(5).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Comment = z.infer<typeof CommentSchema>;

// Request schemas
export const CreateCharacterSchema = CharacterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateCharacter = z.infer<typeof CreateCharacterSchema>;

export const UpdateCharacterSchema = CreateCharacterSchema.partial();
export type UpdateCharacter = z.infer<typeof UpdateCharacterSchema>;

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const CreateCommentSchema = CommentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateComment = z.infer<typeof CreateCommentSchema>;

// Query schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const SearchSchema = z.object({
  q: z.string().optional(),
  anime: z.string().optional(),
  minPower: z.coerce.number().min(0).max(100).optional(),
  maxPower: z.coerce.number().min(0).max(100).optional(),
  sortBy: z
    .enum(["name", "power", "intelligence", "speed", "strength", "createdAt"])
    .default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});
export type Search = z.infer<typeof SearchSchema>;

export const CharacterQuerySchema = PaginationSchema.merge(SearchSchema);
export type CharacterQuery = z.infer<typeof CharacterQuerySchema>;

// Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
  pagination: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    })
    .optional(),
});
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
