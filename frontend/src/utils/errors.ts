/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Error codes mapping
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 1001,
  TASK_NOT_FOUND: 2001,
  UNKNOWN_ERROR: 9000,
} as const;

/**
 * Get user-friendly error message
 */
export function getUserErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return '发生未知错误，请稍后重试';
}
