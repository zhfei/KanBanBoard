/**
 * Request logger middleware
 */

import { Request, Response, NextFunction } from 'express';
import { Logger, generateRequestId } from '../utils/logger';

const logger = new Logger('RequestLogger');

/**
 * Extend Express Request to include requestId
 */
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
    }
  }
}

/**
 * Request logger middleware
 * Logs request method, path, requestId, and latency
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  // Get or generate request ID
  const requestId = req.headers['x-request-id'] as string || generateRequestId();
  req.requestId = requestId;
  req.startTime = Date.now();

  // Log request start
  logger.info('Request started', {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
  });

  // Log response when finished
  res.on('finish', () => {
    const latency = Date.now() - (req.startTime || 0);
    
    logger.info('Request completed', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      latency: `${latency}ms`,
    });
  });

  next();
}
