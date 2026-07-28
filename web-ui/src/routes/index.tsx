import { createFileRoute } from '@tanstack/react-router'

import { HouseholdInventoryExample } from '../components/api-examples'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Household Inventory Example</h2>
        <div className="border rounded p-4 bg-white shadow-sm">
          <HouseholdInventoryExample />
        </div>
      </section>
    </div>
  )
}
