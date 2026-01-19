/**
 * Error codes and error classes
 */

export enum ErrorCode {
  VALIDATION_ERROR = 1001,
  TASK_NOT_FOUND = 2001,
  UNKNOWN_ERROR = 9000,
}

/**
 * Application error class
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;

  constructor(message: string, code: ErrorCode = ErrorCode.UNKNOWN_ERROR, statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string = '参数校验失败') {
    super(message, ErrorCode.VALIDATION_ERROR, 400);
    this.name = 'ValidationError';
  }
}

/**
 * Task not found error
 */
export class TaskNotFoundError extends AppError {
  constructor(message: string = '任务不存在') {
    super(message, ErrorCode.TASK_NOT_FOUND, 404);
    this.name = 'TaskNotFoundError';
  }
}
