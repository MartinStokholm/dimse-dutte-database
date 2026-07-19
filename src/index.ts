import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import householdRoutes from './routes/households';
import roomRoutes from './routes/rooms';
import itemRoutes from './routes/items';
import categoryRoutes from './routes/categories';
import tagRoutes from './routes/tags';

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
