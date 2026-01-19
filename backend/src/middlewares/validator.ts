/**
 * Zod validation middleware
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Validation middleware factory
 * Creates a middleware that validates request data using Zod schema
 */
export function validate(schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = req[target];
      const validated = schema.parse(data);
      
      // Replace request data with validated data
      req[target] = validated as any;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error); // Pass to error handler
      } else {
        next(new ValidationError('参数校验失败'));
      }
    }
  };
}
