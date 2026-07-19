# Household Inventory API

Express.js TypeScript API for managing household inventory with PostgreSQL backend.

## Quick Start

### Prerequisites
- Node.js 24+
- Docker & Docker Compose

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start PostgreSQL with Docker Compose**
   ```bash
   docker-compose up -d postgres
   ```

3. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:3000`

### Docker Setup (Full Stack)

Start both PostgreSQL and the API:

```bash
docker-compose up
```

The API will be available at `http://localhost:3000` and PostgreSQL at `localhost:5432`.

## Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npm run db:migrate` - Run pending database migrations
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:seed` - Seed database with example data
- `npm run db:studio` - Open Prisma Studio UI
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Endpoints

### Households
- `POST /api/households` - Create household
- `GET /api/households` - List households
- `GET /api/households/:id` - Get household details
- `PATCH /api/households/:id` - Update household
- `DELETE /api/households/:id` - Delete household

### Rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms` - List rooms (filter by householdId)
- `GET /api/rooms/:id` - Get room details
- `PATCH /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Items
- `POST /api/items` - Create item
- `GET /api/items` - List items (filter by householdId or roomId)
- `GET /api/items/:id` - Get item details
- `PATCH /api/items/:id` - Update item
- `DELETE /api/items/:id` - Archive item (soft delete)
- `POST /api/items/:id/transactions` - Add inventory transaction

### Categories
- `POST /api/categories` - Create category
- `GET /api/categories` - List categories (hierarchical)
- `GET /api/categories/:id` - Get category details
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Tags
- `POST /api/tags` - Create tag
- `GET /api/tags` - List tags
- `GET /api/tags/:id` - Get tag details
- `PATCH /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

### Health
- `GET /api/health` - Health check

## Project Structure

```
src/
├── index.ts              # Express app setup & entry point
├── routes/               # API route handlers
│   ├── households.ts
│   ├── rooms.ts
│   ├── items.ts
│   ├── categories.ts
│   └── tags.ts
├── services/
│   └── database.ts       # Prisma client & connection management
├── middleware/           # (To be added) Request validation, auth, etc.
└── types/               # (To be added) TypeScript interfaces

prisma/
├── schema.prisma        # Database schema definition
└── seed.ts             # Database seeding script

docker-compose.yml       # Local development environment
.env.example            # Environment variable template
```

## Environment Variables

See `.env.example` for required variables. Key variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - API port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string

## Database

Uses **Prisma ORM** with PostgreSQL.

### Schema Highlights

- **Core Entities**: Household, User, Room, Item, Category, Tag
- **Relationships**: Many-to-many (Items ↔ Tags), Hierarchical (Categories), Media management
- **Auditing**: Inventory transactions, location history
- **Extensibility**: JSONB attributes for item metadata, soft deletes with `archivedAt`

See `prisma/schema.prisma` for complete schema definition.

## Notes

- All timestamps use `TIMESTAMPTZ` (with timezone)
- Items use soft deletion via `archivedAt` field
- Inventory quantity is updated via `InventoryTransaction` records
- Media metadata is stored in database; actual files go to object storage (not yet implemented)

## TODO

- [ ] Authentication & authorization
- [ ] Input validation (Zod schemas)
- [ ] Error handling middleware
- [ ] Request/response pagination
- [ ] Media upload endpoints
- [ ] Search & filtering
- [ ] API documentation (OpenAPI/Swagger)
