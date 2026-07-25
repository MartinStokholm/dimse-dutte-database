import cors from 'cors';
import dotenv from 'dotenv';
import tagRoutes from './routes/tags';
import swaggerUi from 'swagger-ui-express';
import roomRoutes from './routes/rooms';
import itemRoutes from './routes/items';
import { prisma } from './services/database';
import categoryRoutes from './routes/categories';
import { swaggerSpec } from './utils/swagger';
import householdRoutes from './routes/households';
import express, { Express, Request, Response, NextFunction } from 'express';

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, { customCss: '.topbar { display: none }' }));

// Global error handler middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
  });
});

// Routes
app.use('/api/households', householdRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  console.log(`Node environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    prisma.$disconnect().then(() => {
      console.log('Prisma disconnected');
      process.exit(0);
    });
  });
});

export default app;
