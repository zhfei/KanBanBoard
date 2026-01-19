/**
 * Error handler middleware
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../utils/errors';
import { Logger } from '../utils/logger';
import { ZodError } from 'zod';

const logger = new Logger('ErrorHandler');

/**
 * API Error Response wrapper
 */
interface ErrorResponse {
  code: number;
  message: string;
  data: null;
}

/**
 * Error handler middleware
 * Catches all errors and returns unified error response format
 */
export function errorHandler(
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = req.requestId || 'unknown';

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    
    logger.error('Validation error', {
      requestId,
      errors: err.errors,
    });

    const response: ErrorResponse = {
      code: ErrorCode.VALIDATION_ERROR,
      message: `参数校验失败: ${message}`,
      data: null,
    };

    res.status(400).json(response);
    return;
  }

  // Handle AppError
  if (err instanceof AppError) {
    logger.error('Application error', {
      requestId,
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
    });

    const response: ErrorResponse = {
      code: err.code,
      message: err.message,
      data: null,
    };

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle unknown errors
  logger.error('Unknown error', {
    requestId,
    error: err.message,
    stack: err.stack,
  });

  const response: ErrorResponse = {
    code: ErrorCode.UNKNOWN_ERROR,
    message: err.message || '发生未知错误',
    data: null,
  };

  res.status(500).json(response);
}
