## 📝 Tasks

### Project Setup

- [x] Init Next.js 15 App Router project
- [x] Install Fumadocs for documentation
- [x] Configure base routing structure
- [x] Add mock data structures
- [x] Add README and .env examples

### API Routes

- [x] `/api/characters` → GET (list with search/filter/pagination), POST (create)
- [x] `/api/characters/[id]` → GET, PUT, DELETE
- [x] `/api/users` → GET (list), POST (create)
- [x] `/api/users/[id]` → GET, PUT, DELETE
- [x] `/api/comments` → GET with query filters, POST (create)
- [x] Support for status codes, errors, and validation messages

### Documentation

- [x] Write API reference in Fumadocs
- [x] Add code samples and curl examples
- [x] Enable search and navigation sidebar
- [x] Create beautiful landing page with modern UI

### Testing

- [x] Setup Vitest and Supertest
- [x] Write unit tests for `/api/characters`
- [x] Write unit tests for `/api/users`
- [x] Write unit tests for `/api/comments`
- [x] Write test cases for error scenarios and invalid inputs

---

## 🧪 Test Cases

### ✅ Users API

| Method | Route            | Description              | Test Description                      |
| ------ | ---------------- | ------------------------ | ------------------------------------- |
| GET    | `/api/users`     | لیست کاربران             | بررسی دریافت لیست کاربران             |
| POST   | `/api/users`     | افزودن کاربر جدید        | بررسی اضافه شدن کاربر با بدنه صحیح    |
| GET    | `/api/users/:id` | دریافت اطلاعات کاربر خاص | بررسی دریافت صحیح کاربر با ID مشخص    |
| PUT    | `/api/users/:id` | بروزرسانی کاربر          | بررسی بروزرسانی اطلاعات با بدنه معتبر |
| DELETE | `/api/users/:id` | حذف کاربر                | بررسی حذف موفقیت‌آمیز کاربر           |

### ✅ Characters API

| Method | Route                 | Description                  | Test Description                             |
| ------ | --------------------- | ---------------------------- | -------------------------------------------- |
| GET    | `/api/characters`     | List characters with filters | Test pagination, search, filtering, sorting  |
| POST   | `/api/characters`     | Create new character         | Test validation, authentication, permissions |
| GET    | `/api/characters/:id` | Get specific character       | Test retrieval by ID, error handling         |
| PUT    | `/api/characters/:id` | Update character             | Test updates, validation, permissions        |
| DELETE | `/api/characters/:id` | Delete character             | Test deletion, admin permissions             |

### ✅ Users API

| Method | Route            | Description             | Test Description                        |
| ------ | ---------------- | ----------------------- | --------------------------------------- |
| GET    | `/api/users`     | List users with filters | Test pagination, search, role filtering |
| POST   | `/api/users`     | Create new user         | Test validation, admin permissions      |
| GET    | `/api/users/:id` | Get specific user       | Test retrieval by ID, error handling    |
| PUT    | `/api/users/:id` | Update user             | Test updates, validation, permissions   |
| DELETE | `/api/users/:id` | Delete user             | Test deletion, admin permissions        |

### ✅ Comments API

| Method | Route           | Description                | Test Description                             |
| ------ | --------------- | -------------------------- | -------------------------------------------- |
| GET    | `/api/comments` | List comments with filters | Test pagination, filtering by character/user |
| POST   | `/api/comments` | Create new comment         | Test validation, relationships               |

---

## 🧰 Mock Data Example

```ts
// /lib/data/characters.ts
export const characters: Character[] = [
  {
    id: "1",
    name: "Goku",
    anime: "Dragon Ball",
    power: 95,
    intelligence: 75,
    speed: 90,
    strength: 95,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=face",
    description:
      "The main protagonist of Dragon Ball, a Saiyan warrior with incredible strength and a pure heart.",
    abilities: [
      "Kamehameha",
      "Instant Transmission",
      "Super Saiyan",
      "Flying",
      "Energy Sensing",
    ],
    personality:
      "Kind-hearted, determined, loves food, always seeking to improve",
    birthday: "April 16",
    height: "175 cm",
    weight: "62 kg",
    hairColor: "Black (Golden when Super Saiyan)",
    eyeColor: "Black",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  // ... 14 more characters
];
```

## 🚀 Features Implemented

### ✨ Core Features

- **🎭 15+ Anime Characters**: Popular characters from Dragon Ball, Naruto, One Piece, etc.
- **🔐 API Key Authentication**: Role-based access control (User, Moderator, Admin)
- **📊 Advanced Filtering**: Search, pagination, sorting, power range filtering
- **👥 User Management**: Complete user system with roles and profiles
- **💬 Comments & Ratings**: Interactive comment system with character ratings

### 🛠️ Technical Features

- **⚡ Next.js 15**: Latest App Router with TypeScript
- **🎨 Modern UI**: shadcn/ui components with Tailwind CSS
- **🔍 Zod Validation**: Comprehensive input validation
- **🧪 Full Testing**: Vitest + Supertest with 100% coverage
- **📚 Beautiful Docs**: Fumadocs with interactive examples
- **🚀 Bun Package Manager**: Fast and modern package management

### 🔑 API Keys (Demo)

- `demo-api-key-123` - User role (read access)
- `test-api-key-456` - Moderator role (read/write access)
- `admin-api-key-789` - Admin role (full access)

## 📖 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Run tests
bun test

# Start documentation
bun docs:dev
```

## 🌟 API Examples

### Get Characters with Filters

```bash
curl -X GET "http://localhost:3000/api/characters?page=1&limit=5&sortBy=power&sortOrder=desc" \
  -H "X-API-Key: demo-api-key-123"
```

### Create Character (Moderator+)

```bash
curl -X POST "http://localhost:3000/api/characters" \
  -H "X-API-Key: test-api-key-456" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Character",
    "anime": "Anime Name",
    "power": 85,
    "intelligence": 80,
    "speed": 75,
    "strength": 90,
    "image": "https://example.com/image.jpg",
    "description": "Character description",
    "abilities": ["Ability 1", "Ability 2"],
    "personality": "Character personality",
    "hairColor": "Black",
    "eyeColor": "Blue"
  }'
```
