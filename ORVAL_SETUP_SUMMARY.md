# Orval API Client Setup - Complete ✅

## What Was Done

### 1. Enhanced OpenAPI Specification (`web-api/src/utils/swagger.ts`)
- ✅ Added **required fields** to all schemas (id, timestamps, etc.)
- ✅ Added **enum support** for `InventoryTransactionReason`
- ✅ Added **error response schemas** (ErrorResponse, ValidationError)
- ✅ Added **detailed examples** to properties (e.g., "Blender", "Kitchen")
- ✅ Added **nullable/optional field annotations** (@nullable)
- ✅ Added **validation constraints** (minimum: 0 for quantities)
- ✅ Added **relationships** (Item.tags array)

### 2. Created OpenAPI JSON Endpoint
- ✅ Added `/api-docs-json` endpoint in `web-api/src/index.ts`
- ✅ Allows Orval to fetch the live spec for code generation

### 3. Installed Orval
- ✅ `orval@8.22.0` installed in web-ui
- ✅ `axios` installed (HTTP client for API calls)
- ✅ Both as dependencies (not just devDependencies, needed by generated code)

### 4. Created Orval Configuration
- ✅ `web-ui/orval.config.ts` configured with:
  - Input: `http://localhost:3000/api-docs-json`
  - Output: `src/generated/api` (tags-split mode)
  - Client: React Query (TanStack Query integration)
  - HTTP: Axios with TypeScript support
  - Auto-formatting with Prettier

### 5. Generated API Client Stubs
Ran: `npx orval --project api`

Generated files:
```
src/generated/api/
├── items/items.ts                          # TanStack Query hooks for items
├── households/households.ts               # TanStack Query hooks for households
├── rooms/rooms.ts                         # TanStack Query hooks for rooms
├── categories/categories.ts               # TanStack Query hooks for categories
├── tags/tags.ts                           # TanStack Query hooks for tags
└── householdInventoryAPI.schemas.ts       # All TypeScript types/interfaces
```

All hooks are fully typed:
- `useGetApiItems()` - GET /api/items
- `usePostApiItemsMutation()` - POST /api/items
- `usePatchApiItemsIdMutation()` - PATCH /api/items/{id}
- `useDeleteApiItemsIdMutation()` - DELETE /api/items/{id}
- ... and similar for other resources

### 6. Created Documentation
- ✅ `web-ui/ORVAL_USAGE.md` - Complete usage guide with examples
- ✅ `web-ui/src/components/api-examples.tsx` - Working component example

### 7. Updated Frontend Build
- ✅ Added `"orval": "orval --project api"` script to `web-ui/package.json`
- ✅ Added `src/generated/api/` to `.gitignore`
- ✅ TypeScript compilation passes (no errors)

## Key Features of Generated Client

### Full Type Safety
```tsx
// All params and responses are strongly typed
const { data: items } = useGetApiItems({ householdId: 'uuid' });
// items has type Item[] | undefined, fully autocompleted

// TypeScript errors on invalid usage:
useGetApiItems({ householdId: 123 }); // ❌ Error: must be string
```

### TanStack Query Integration
```tsx
// Automatic query management:
// - Caching, deduplication, refetching
// - Loading/error states
// - Stale-while-revalidate
const { data, isLoading, error, refetch } = useGetApiItems();

// Mutations with loading state:
const { mutateAsync, isPending } = usePostApiItemsMutation();
```

### Request/Response Validation
```tsx
// Request body validated by TypeScript:
await createMutation.mutateAsync({
  data: {
    householdId: 'uuid',
    roomId: 'uuid',
    name: 'Blender',
    quantity: 1,  // ✅ must be >= 0
  }
});
```

## Regenerating After Backend Changes

When backend API changes (new endpoints, field additions):

```bash
cd web-ui
npm run orval
```

This will:
1. Fetch latest spec from `http://localhost:3000/api-docs-json`
2. Regenerate all hooks and types
3. Auto-format with Prettier
4. ✅ Zero manual updates needed

## Current OpenAPI Spec Quality

### ✅ What's Covered
- All 11 REST endpoints documented
- Request/response schemas with types
- HTTP method (GET, POST, PATCH, DELETE)
- Parameter types (path, query)
- Required vs optional fields
- Error response definitions (400, 404, 500)
- Enum values (InventoryTransactionReason)
- Nullable/optional annotations
- Validation constraints (quantity >= 0)

### ⚠️ Could Be Enhanced (Optional)
- Pagination/filtering (limit, offset, sort)
- Authentication headers (Bearer token)
- More complex examples (Item with nested tags/media)
- Rate limiting headers
- Server response time headers

These are **not blocking** - the current spec is excellent for code generation.

## Testing the Integration

### Option 1: Use the example component
```tsx
import { HouseholdInventoryExample } from '@/components/api-examples';

export default function App() {
  return <HouseholdInventoryExample />;
}
```

### Option 2: Create custom components using hooks
See `web-ui/ORVAL_USAGE.md` for full examples.

## Architecture

```
┌─────────────────────────────────────────────┐
│ React Components (web-ui)                   │
│  - HouseholdInventoryExample                │
│  - Custom components using hooks            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│ Generated API Hooks (src/generated/api)     │
│  - useGetApiItems()                         │
│  - usePostApiItemsMutation()                │
│  - usePatchApiItemsIdMutation()             │
│  - Types: Item, Household, Room, etc.       │
└──────────────────┬──────────────────────────┘
                   │
                   ├─ @tanstack/react-query
                   │  (manages cache, loading, errors)
                   │
                   └─ axios (HTTP client)
                        │
┌───────────────────────▼──────────────────────┐
│ Backend API (web-api)                        │
│  - Node.js + Express + TypeScript            │
│  - Prisma ORM + PostgreSQL                   │
│  - OpenAPI spec at /api-docs-json           │
└──────────────────────────────────────────────┘
```

## Next Steps

1. **Start using generated hooks** in your React components
   - Import from `@/generated/api/*/`
   - Follow examples in `ORVAL_USAGE.md`

2. **Set up API base URL correctly**
   - Dev: `http://localhost:3000`
   - Production: `https://api.example.com`
   - Modify in `orval.config.ts` as needed

3. **Add API error handling**
   - Wrap calls in try-catch
   - Show error messages to users
   - Implement retry logic if needed

4. **Test backend data**
   - Make sure database is running
   - Create test households/items via Swagger UI
   - Verify data appears in React components

## Troubleshooting

### Generated client won't import?
```bash
cd web-ui
npm install
npm run orval  # regenerate
```

### TypeScript errors after regeneration?
```bash
cd web-ui
npm run tsc --noEmit  # check errors
npm install  # update dependencies if needed
```

### API calls fail at runtime?
- Check backend is running: `curl http://localhost:3000/api-docs`
- Verify database is accessible
- Check browser dev console for network errors
- Use React Query DevTools to inspect queries

---

**Status:** ✅ Fully integrated and type-safe API client ready for development!
