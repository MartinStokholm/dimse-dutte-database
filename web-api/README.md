# Household Inventory System – Technical Specification

## Technology Stack

| Component    | Technology                                                |
| ------------ | --------------------------------------------------------- |
| Frontend     | React + TypeScript                                        |
| Backend API  | Node.js + Express + TypeScript                            |
| Database     | PostgreSQL                                                |
| ORM          | PostgreSQL ORM (e.g. Prisma or Drizzle ORM)               |
| File Storage | Object storage (e.g. S3, Supabase Storage, Cloudflare R2) |

---

## System Overview

The system is designed around a normalized relational data model, providing a flexible and extensible foundation for managing household inventory. Core entities represent the physical organization of a household, while supporting entities provide classification, media management, auditing, and future extensibility.

---

## Core Entities

### Household

Represents a single household and acts as the root entity for all inventory data.

**Fields**

- id (UUID)
- name
- description
- created_at
- updated_at

---

### User

Represents an application user.

**Fields**

- id (UUID)
- name
- email
- created_at

Relationship:

- Household ⇄ User (many-to-many via `HouseholdUser`)

---

### HouseholdUser

Associates users with households and defines permissions.

**Fields**

- household_id
- user_id
- role (Owner, Member, Guest)

---

### Room

Represents a physical location within a household.

**Fields**

- id (UUID)
- household_id
- name
- description
- created_at
- updated_at

Relationship:

- Household → Rooms (1:N)

---

### Category

Provides structured classification of inventory items.

Categories support hierarchical organization through an optional parent category.

**Fields**

- id (UUID)
- name
- description
- parent_category_id (nullable)

Examples

- Kitchen
  - Appliances
  - Utensils

- Electronics
  - Computers
  - Networking

Relationship:

- Category → Items (1:N)

---

### Tag

Provides flexible, non-hierarchical classification.

Tags complement categories rather than replace them.

Examples

- Apple
- USB-C
- Camping
- Christmas
- Office

Relationship:

- Item ⇄ Tag (M:N)

---

### Item

Represents an inventory item stored within a room.

**Fields**

- id (UUID)
- household_id
- room_id
- category_id
- name
- description
- quantity
- notes
- attributes (JSONB)
- created_at
- updated_at
- archived_at (nullable)

The `attributes` JSONB column stores item-specific metadata without requiring schema changes.

Examples

```json
{
  "serialNumber": "ABC123",
  "purchasePrice": 499,
  "warrantyExpires": "2028-05-14",
  "colour": "Black"
}
```

Relationship:

- Room → Items (1:N)
- Category → Items (1:N)

---

## Media Management

Media is modelled as a reusable entity rather than image-specific tables to support future file types such as:

- Images
- PDFs
- Receipts
- Warranty documents
- Videos

### Media

Stores metadata for uploaded files.

**Fields**

- id (UUID)
- storage_key
- filename
- mime_type
- file_size
- width (nullable)
- height (nullable)
- created_at

Actual files are stored in object storage. The database stores only references and metadata.

---

### ItemMedia

Associates media with inventory items.

**Fields**

- item_id
- media_id
- purpose (Primary, Gallery, Receipt, Manual)
- sort_order

Relationship:

- Item ⇄ Media (M:N)

---

### RoomMedia

Associates media with rooms.

**Fields**

- room_id
- media_id
- purpose
- sort_order

Relationship:

- Room ⇄ Media (M:N)

---

## Auditing & History

### ItemLocationHistory

Tracks item movement between rooms.

**Fields**

- id
- item_id
- room_id
- moved_at
- moved_by
- notes

---

### InventoryTransaction

Provides an audit trail for quantity changes.

**Fields**

- id
- item_id
- change
- reason
- created_at
- created_by

Examples

- +5 Purchased
- -2 Consumed
- +1 Returned

The current quantity remains on the Item entity for efficient reads, while transactions provide historical tracking.

---

## Relationships

```
Household
├── Users (via HouseholdUser)
├── Rooms
│   ├── Items
│   │   ├── Category
│   │   ├── Tags
│   │   ├── Media
│   │   ├── Inventory Transactions
│   │   └── Location History
│   └── Media
```

---

## Database Design Principles

- PostgreSQL relational schema using UUID primary keys.
- Enforce referential integrity through foreign key constraints.
- Use `TIMESTAMPTZ` for all timestamps.
- Support soft deletion using `archived_at`.
- Store extensible metadata using PostgreSQL `JSONB`.
- Store media externally in object storage and persist only metadata and storage references.
- Create indexes on frequently queried fields such as name, room, category, household, and JSONB attributes where required.
- Use migration-based schema evolution through the ORM to support incremental development while maintaining data integrity.

This architecture provides a scalable, maintainable foundation capable of supporting future features such as barcode scanning, advanced search, shopping lists, maintenance schedules, warranty tracking, lending items, and automation without requiring significant database redesign.
