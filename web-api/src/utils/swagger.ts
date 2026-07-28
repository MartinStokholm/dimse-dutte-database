import swaggerJsdoc from 'swagger-jsdoc';

const options: any = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Household Inventory API',
      version: '1.0.0',
      description: 'RESTful API for managing household inventory items, rooms, and categories',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Household: {
          type: 'object',
          required: ['id', 'name', 'createdAt', 'updatedAt'],
          properties: {
            id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            name: { type: 'string', example: 'My Home' },
            description: { type: 'string', nullable: true, example: 'Main residence' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
          },
        },
        Room: {
          type: 'object',
          required: ['id', 'householdId', 'name', 'createdAt', 'updatedAt'],
          properties: {
            id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' },
            householdId: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Kitchen' },
            description: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Item: {
          type: 'object',
          required: ['id', 'householdId', 'roomId', 'name', 'quantity', 'createdAt', 'updatedAt'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            householdId: { type: 'string', format: 'uuid' },
            roomId: { type: 'string', format: 'uuid' },
            categoryId: { type: 'string', format: 'uuid', nullable: true },
            name: { type: 'string', example: 'Blender' },
            description: { type: 'string', nullable: true },
            quantity: { type: 'integer', example: 1, minimum: 0 },
            notes: { type: 'string', nullable: true },
            attributes: { type: 'object', nullable: true, example: { color: 'silver', brand: 'Vitamix' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            archivedAt: { type: 'string', format: 'date-time', nullable: true },
            tags: { type: 'array', items: { $ref: '#/components/schemas/Tag' }, nullable: true },
          },
        },
        Category: {
          type: 'object',
          required: ['id', 'name', 'createdAt', 'updatedAt'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Electronics' },
            description: { type: 'string', nullable: true },
            parentCategoryId: { type: 'string', format: 'uuid', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Tag: {
          type: 'object',
          required: ['id', 'name', 'createdAt'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'fragile' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        InventoryTransaction: {
          type: 'object',
          required: ['id', 'itemId', 'change', 'reason', 'createdAt', 'createdBy'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            itemId: { type: 'string', format: 'uuid' },
            change: { type: 'integer', example: 5, description: 'Positive for addition, negative for removal' },
            reason: { type: 'string', example: 'Purchased', enum: ['Purchased', 'Used', 'Damaged', 'Lost', 'Found', 'Other'] },
            createdAt: { type: 'string', format: 'date-time' },
            createdBy: { type: 'string', example: 'john@example.com' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Not Found' },
            statusCode: { type: 'integer', example: 404 },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Validation failed' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
