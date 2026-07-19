# Deployment Guide

## Local Development

### 1. First-Time Setup

```bash
# Install dependencies
npm install

# Start PostgreSQL with Docker
docker-compose up -d postgres

# Wait for PostgreSQL to be ready (check healthcheck)
docker-compose ps

# Create and seed the database
npm run db:migrate
npm run db:seed

# Start the dev server
npm run dev
```

Server runs on `http://localhost:3000`

### 2. Database Management

```bash
# View database in UI
npm run db:studio

# Create new migration after schema changes
npm run db:migrate

# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset
```

## Docker Deployment

### Start Full Stack

```bash
docker-compose up
```

This starts:
- **PostgreSQL** on `localhost:5432`
- **API** on `localhost:3000`

### Environment Variables

The `.env` file in the root controls the API:
- `NODE_ENV=development` — Env mode
- `PORT=3000` — API port
- `DATABASE_URL` — PostgreSQL connection string

For production, update `.env` or pass via environment:

```bash
docker-compose up -e NODE_ENV=production -e PORT=3000
```

### Health Check

```bash
curl http://localhost:3000/api/health
# Response: {"status":"ok"}
```

## Production Deployment

### Build Docker Image

```bash
docker build -t household-inventory-api:latest .
```

### Run Container

```bash
docker run \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/inventory \
  -e NODE_ENV=production \
  household-inventory-api:latest
```

### Environment Configuration

Set these env vars on the deployment platform:

- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=postgresql://user:password@host:5432/household_inventory`

## Database Migrations

Prisma migrations are version-controlled in `prisma/migrations/`:

### Applying Migrations

Development:
```bash
npm run db:migrate
```

Production:
```bash
npm run db:migrate:deploy
```

### Creating New Migrations

After updating `prisma/schema.prisma`:

```bash
npm run db:migrate
# Follow prompts to name the migration
```

A new file is created in `prisma/migrations/`.

## Troubleshooting

### PostgreSQL connection fails

Check the container is running:
```bash
docker-compose ps
```

Verify connection string in `.env`:
```bash
DATABASE_URL=postgresql://user:password@postgres:5432/household_inventory
```

### Migrations fail

Reset database (development only):
```bash
npx prisma migrate reset
```

### API won't start

Check logs:
```bash
docker-compose logs api
```

Ensure PostgreSQL is healthy:
```bash
docker-compose logs postgres
```

## Monitoring

### API Logs

```bash
docker-compose logs -f api
```

### Database Logs

```bash
docker-compose logs -f postgres
```

### Prisma Studio

Open the database GUI:
```bash
npm run db:studio
```

Visits `http://localhost:5555`

## Backup & Recovery

### Backup PostgreSQL

```bash
docker-compose exec postgres pg_dump -U user household_inventory > backup.sql
```

### Restore PostgreSQL

```bash
docker-compose exec -T postgres psql -U user household_inventory < backup.sql
```

## Cleanup

### Stop Services

```bash
docker-compose down
```

### Remove Everything (Including Data)

```bash
docker-compose down -v
```

This removes volumes — **all data is lost**.

## Performance Optimization

The schema includes indexes on frequently queried fields:
- `householdId` — Filter items, rooms
- `roomId` — Filter items
- `categoryId` — Filter items
- `itemId` — Find transactions and history

No additional indexes needed initially.
