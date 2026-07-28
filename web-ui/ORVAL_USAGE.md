# Generated API Client

The API client is auto-generated from the backend's OpenAPI spec using **Orval**. It includes:
- **Fully typed request/response bodies** (from OpenAPI schemas)
- **TanStack Query hooks** for seamless React Query integration
- **Axios-based HTTP client** with TypeScript support

## Generated Structure

```
src/generated/api/
├── items/items.ts                    # Item operations (CRUD + transactions)
├── households/households.ts          # Household CRUD
├── rooms/rooms.ts                    # Room CRUD
├── categories/categories.ts          # Category CRUD
├── tags/tags.ts                      # Tag CRUD
└── householdInventoryAPI.schemas.ts  # All request/response types
```

## Usage Examples

### 1. Fetch Items with TanStack Query

```tsx
import { useGetApiItems } from '@/generated/api/items/items';

export function ItemsList() {
  const { data: items, isLoading, error } = useGetApiItems({
    householdId: 'some-uuid',
    roomId: 'some-uuid',
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {items?.data.map((item) => (
        <li key={item.id}>{item.name} (qty: {item.quantity})</li>
      ))}
    </ul>
  );
}
```

### 2. Create Item

```tsx
import { usePostApiItemsMutation } from '@/generated/api/items/items';

export function CreateItemForm() {
  const mutation = usePostApiItemsMutation();

  const handleSubmit = async (formData) => {
    await mutation.mutateAsync({
      data: {
        householdId: 'some-uuid',
        roomId: 'some-uuid',
        name: 'Blender',
        quantity: 1,
        description: 'High-speed blender',
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### 3. Update Item

```tsx
import { usePatchApiItemsIdMutation } from '@/generated/api/items/items';

export function UpdateItemForm({ itemId }: { itemId: string }) {
  const mutation = usePatchApiItemsIdMutation();

  const handleUpdate = async (updates) => {
    await mutation.mutateAsync({
      id: itemId,
      data: updates,
    });
  };

  return <button onClick={() => handleUpdate({ quantity: 5 })}>Update Qty</button>;
}
```

### 4. Add Inventory Transaction

```tsx
import { usePostApiItemsIdTransactionsMutation } from '@/generated/api/items/items';

export function AddTransaction({ itemId }: { itemId: string }) {
  const mutation = usePostApiItemsIdTransactionsMutation();

  const handleTransaction = async () => {
    await mutation.mutateAsync({
      id: itemId,
      data: {
        change: -2,
        reason: 'Used',
        createdBy: 'john@example.com',
      },
    });
  };

  return <button onClick={handleTransaction}>Mark as Used (qty -2)</button>;
}
```

## Regenerating the Client

When the backend OpenAPI spec changes (new endpoints, fields, error responses):

```bash
npm run orval
```

This will:
1. Fetch the latest spec from `http://localhost:3000/api-docs-json`
2. Regenerate all hooks and types
3. Auto-format with Prettier

## Configuration

See `orval.config.ts` for configuration options:
- **input**: URL to OpenAPI spec
- **output**: Where to generate files
- **baseURL**: API base URL
- **client**: React Query (TanStack Query)
- **mode**: `tags-split` (one file per tag/resource)

## Type Safety

All generated hooks are fully typed:

```tsx
// ✅ Type-safe params
const { data } = useGetApiItems({ householdId: 'uuid' });

// ✅ Type-safe response
data?.forEach((item) => {
  console.log(item.name); // string
  console.log(item.quantity); // number
});

// ❌ TypeScript error - wrong param type
const { data } = useGetApiItems({ householdId: 123 }); // Error!

// ❌ TypeScript error - wrong property
console.log(data?.invalidField); // Error!
```

## Tips

1. **Query Options**: Pass React Query options to customize behavior
   ```tsx
   useGetApiItems(params, {
     query: { 
       staleTime: 5 * 60 * 1000,  // 5 min
       refetchOnWindowFocus: false 
     }
   })
   ```

2. **Mutation Callbacks**: Handle success/error
   ```tsx
   mutation.mutateAsync(data, {
     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
     onError: (error) => console.error(error),
   })
   ```

3. **Request Interceptors**: Configure axios if needed
   ```tsx
   // In orval.config.ts - can add axios config
   axios?: { timeout: 10000 }
   ```

## OpenAPI Spec Quality

The generated client quality depends on the OpenAPI spec. Current coverage:
- ✅ All 11 endpoints documented
- ✅ Request/response schemas with validation
- ✅ Error responses (400, 404, 500)
- ✅ Required vs optional fields
- ✅ Enum support (InventoryTransactionReason)
- ⚠️ Could add: More detailed examples, pagination, auth headers

To improve the spec, edit `/web-api/src/utils/swagger.ts` and regenerate.
