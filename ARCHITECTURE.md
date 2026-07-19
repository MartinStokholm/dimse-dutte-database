# Project Architecture

## Overview

This is a clean-layered Express.js TypeScript API following industry best practices:

```
HTTP Request
    ↓
Routes (thin)          — Define endpoints, delegate to controllers
    ↓
Controllers (lean)     — Handle req/res, validate input, orchestrate services
    ↓
Services               — Business logic, database operations, Prisma ORM
    ↓
Database (PostgreSQL)  — Normalized relational schema
```

## Project Structure

```
src/
├── index.ts                      # Express app setup, middleware, server startup
│
├── routes/                       # Route definitions (thin layer)
│   ├── households.ts            # Just maps HTTP verbs to controller functions
│   ├── rooms.ts
│   ├── items.ts
│   ├── categories.ts
│   └── tags.ts
│
├── controllers/                 # Request handling & orchestration
│   ├── householdController.ts   # Validates input, calls services, returns responses
│   ├── roomController.ts
│   ├── itemController.ts
│   ├── categoryController.ts
│   └── tagController.ts
│
├── services/                    # Business logic & data access
│   ├── index.ts                 # All service functions (householdService, etc.)
│   └── database.ts              # Prisma client initialization
│
├── middleware/                  # (To be added) Auth, logging, error handling
├── types/                       # (To be added) TypeScript interfaces & types
└── utils/                       # (To be added) Helpers, validators, formatters
```

## Data Flow Example

**Request**: `POST /api/households` with `{ name: "My House" }`

1. **Route** (`src/routes/households.ts`)
   ```ts
   router.post('/', createHousehold);
   ```
   Simply delegates to the controller function.

2. **Controller** (`src/controllers/householdController.ts`)
   ```ts
   export const createHousehold = async (req, res) => {
     const { name, description } = req.body;
     
     if (!name) {
       res.status(400).json({ error: 'Name is required' });
       return;
     }
     
     const household = await householdService.create({ name, description });
     res.status(201).json(household);
   };
   ```
   - Extracts request body
   - Validates input
   - Calls the appropriate service
   - Returns formatted response

3. **Service** (`src/services/index.ts`)
   ```ts
   export const householdService = {
     create: async (data) => {
       return prisma.household.create({ data });
     },
     // ... other methods
   };
   ```
   - Calls Prisma ORM
   - Contains business logic
   - Returns data to controller

4. **Database** (`prisma/schema.prisma`)
   - Prisma generates SQL
   - PostgreSQL executes query
   - Returns record

## Key Principles

- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Services can be tested independently from HTTP
- **Reusability**: Services can be called from multiple sources (API, CLI, etc.)
- **Maintainability**: Changes to database logic don't affect routes
- **Scalability**: Easy to add middleware, logging, caching at appropriate layers

## Services (in `src/services/index.ts`)

Each service exposes a simple interface:

- `householdService` — CRUD for households
- `roomService` — CRUD for rooms with filtering
- `itemService` — CRUD for items, with soft-delete and transaction support
- `categoryService` — CRUD for categories with hierarchical support
- `tagService` — CRUD for tags

### Example Service Pattern

```ts
export const entityService = {
  create: async (data) => prisma.entity.create({ data }),
  findAll: async (filters) => prisma.entity.findMany({ where: filters }),
  findById: async (id) => prisma.entity.findUnique({ where: { id }, include: {...} }),
  update: async (id, data) => prisma.entity.update({ where: { id }, data }),
  delete: async (id) => prisma.entity.delete({ where: { id } }),
};
```

## Next Steps

### Middleware
- **Authentication** — Verify JWT tokens
- **Authorization** — Check user permissions
- **Error Handling** — Catch errors, format responses
- **Logging** — Request/response logging
- **Validation** — Input validation (Zod schemas)

### Types
- Request DTOs (Data Transfer Objects)
- Response types
- Service parameter types

### Utils
- Validators (Zod)
- Error utilities
- Response formatters

## Development Workflow

1. **Add a feature**:
   - Add endpoint to route
   - Create controller function with validation
   - Add/update service method
   - Service uses Prisma ORM

2. **Test locally**:
   ```bash
   npm run dev          # Start with auto-reload
   npm run db:migrate   # Apply migrations
   npm run db:studio    # Open Prisma Studio UI
   ```

3. **With Docker**:
   ```bash
   docker-compose up    # Start API + PostgreSQL
   ```

## TypeScript Strict Mode

All files use strict TypeScript settings:
- `noImplicitAny` — No untyped variables
- `strictNullChecks` — Handle null/undefined explicitly
- `noUnusedLocals/Parameters` — No dead code
- Full return type annotations required
