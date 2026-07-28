import { useGetApiItems } from '@/generated/api/items/items';
import { useGetApiHouseholds } from '@/generated/api/households/households';

/**
 * Example: Using the auto-generated API client in a React component
 *
 * This demonstrates how to integrate the Orval-generated hooks with
 * TanStack Query and Router in your React components.
 */

export function HouseholdInventoryExample() {
  // Fetch households
  const { data: householdsResponse, isLoading: householdsLoading } =
    useGetApiHouseholds();

  // Extract households array
  const households = householdsResponse?.data || [];

  // Fetch items (if a household is selected)
  const selectedHouseholdId = households[0]?.id;
  const { data: itemsResponse, isLoading: itemsLoading } = useGetApiItems(
    selectedHouseholdId ? { householdId: selectedHouseholdId } : undefined,
    {
      query: {
        enabled: !!selectedHouseholdId, // Only fetch when we have a household ID
      },
    }
  );

  const items = itemsResponse?.data || [];

  if (householdsLoading) return <div>Loading households...</div>;
  if (!households.length) return <div>No households found</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {households[0]?.name} Inventory
      </h2>

      {itemsLoading ? (
        <div>Loading items...</div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2">Items</h3>
          {items.length === 0 ? (
            <p>No items in this household</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item: typeof items[0]) => (
                <li
                  key={item.id}
                  className="flex justify-between p-2 border rounded hover:bg-gray-100"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600">Qty: {item.quantity}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
