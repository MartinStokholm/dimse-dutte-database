# Swagger API Documentation

## Access Swagger UI

The interactive API documentation is available at:

```
http://localhost:3000/api-docs
```

### During Development

```bash
npm run dev
# Visit http://localhost:3000/api-docs
```

### In Docker

```bash
docker-compose up
# Visit http://localhost:3000/api-docs
```

## Features

The Swagger UI provides:

- **Endpoint Documentation** — All API routes with parameters and responses
- **Request Examples** — Try requests directly from the UI
- **Response Schemas** — View data structure for each endpoint
- **Error Responses** — See possible HTTP status codes and errors

## Available Endpoints

### Households
- `POST /api/households` — Create household
- `GET /api/households` — List all households
- `GET /api/households/{id}` — Get household details
- `PATCH /api/households/{id}` — Update household
- `DELETE /api/households/{id}` — Delete household

### Rooms
- `POST /api/rooms` — Create room
- `GET /api/rooms` — List rooms (filter by householdId)
- `GET /api/rooms/{id}` — Get room details
- `PATCH /api/rooms/{id}` — Update room
- `DELETE /api/rooms/{id}` — Delete room

### Items
- `POST /api/items` — Create item
- `GET /api/items` — List items (filter by householdId or roomId)
- `GET /api/items/{id}` — Get item details
- `PATCH /api/items/{id}` — Update item
- `DELETE /api/items/{id}` — Archive item (soft delete)
- `POST /api/items/{id}/transactions` — Add inventory transaction

### Categories
- `POST /api/categories` — Create category
- `GET /api/categories` — List all categories (hierarchical)
- `GET /api/categories/{id}` — Get category details
- `PATCH /api/categories/{id}` — Update category
- `DELETE /api/categories/{id}` — Delete category

### Tags
- `POST /api/tags` — Create tag
- `GET /api/tags` — List all tags
- `GET /api/tags/{id}` — Get tag details
- `PATCH /api/tags/{id}` — Update tag
- `DELETE /api/tags/{id}` — Delete tag

### System
- `GET /api/health` — Health check

## Testing Endpoints

### Example: Create a Household

**Request**
```bash
curl -X POST http://localhost:3000/api/households \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My House",
    "description": "My family home"
  }'
```

**Response**
```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "My House",
  "description": "My family home",
  "createdAt": "2025-01-19T10:30:00.000Z",
  "updatedAt": "2025-01-19T10:30:00.000Z"
}
```

### Example: Add Inventory Transaction

**Request**
```bash
curl -X POST http://localhost:3000/api/items/{itemId}/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "change": 5,
    "reason": "Purchased",
    "createdBy": "john@example.com"
  }'
```

**Response**
```json
{
  "id": "a7f9e10c-58cc-4372-b567-1e02b2c3d480",
  "itemId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "change": 5,
  "reason": "Purchased",
  "createdAt": "2025-01-19T11:00:00.000Z",
  "createdBy": "john@example.com"
}
```

## Schema Reference

### Household
- `id` — UUID (unique identifier)
- `name` — String, required
- `description` — String, optional
- `createdAt` — DateTime (auto-set)
- `updatedAt` — DateTime (auto-updated)

### Room
- `id` — UUID
- `householdId` — UUID (foreign key)
- `name` — String, required
- `description` — String, optional
- `createdAt` — DateTime
- `updatedAt` — DateTime

### Item
- `id` — UUID
- `householdId` — UUID (foreign key)
- `roomId` — UUID (foreign key)
- `categoryId` — UUID, optional (foreign key)
- `name` — String, required
- `description` — String, optional
- `quantity` — Integer, default: 1
- `notes` — String, optional
- `attributes` — JSON object, optional (extensible metadata)
- `createdAt` — DateTime
- `updatedAt` — DateTime
- `archivedAt` — DateTime, optional (for soft delete)

### Category
- `id` — UUID
- `name` — String, required
- `description` — String, optional
- `parentCategoryId` — UUID, optional (for hierarchy)
- `createdAt` — DateTime
- `updatedAt` — DateTime

### Tag
- `id` — UUID
- `name` — String, required, unique
- `createdAt` — DateTime

### InventoryTransaction
- `id` — UUID
- `itemId` — UUID (foreign key)
- `change` — Integer (positive or negative)
- `reason` — String, required (e.g., "Purchased", "Consumed")
- `createdAt` — DateTime
- `createdBy` — String (user email or identifier)

## Documentation Approach

The API documentation is auto-generated from JSDoc comments in route files:

```typescript
/**
 * @swagger
 * /api/households:
 *   post:
 *     tags: [Households]
 *     summary: Create a new household
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Household
 */
router.post('/', createHousehold);
```

When you add new endpoints, add JSDoc comments to automatically update Swagger documentation.

## Next Steps

1. **Add Authentication** — Protect endpoints with JWT
2. **Add Validation** — Use Zod for request validation
3. **Add Filtering** — Implement advanced search and pagination
4. **Add Media Upload** — Integrate with S3/Cloudflare R2
