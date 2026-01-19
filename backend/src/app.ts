/**
 * Express application setup
 */

import express, { Express } from 'express';
import cors from 'cors';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import tasksRoutes from './routes/tasks.routes';
import { Logger } from './utils/logger';
import { validateEnv } from './config/env';

const logger = new Logger('App');

/**
 * Create and configure Express application
 */
export function createApp(): Express {
  // Validate environment variables
  validateEnv();

  const app = express();

  // CORS configuration
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.use(
    cors({
      origin: corsOrigin === '*' ? true : corsOrigin.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    })
  );

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger middleware (must be before routes)
  app.use(requestLogger);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/tasks', tasksRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      code: 404,
      message: '接口不存在',
      data: null,
    });
  });

  // Error handler middleware (must be last)
  app.use(errorHandler);

  logger.info('Express application configured');
  
  return app;
}
