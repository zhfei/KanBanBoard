/**
 * Environment configuration
 */

/**
 * Get API base URL from environment or use default
 */
export function getApiBaseUrl(): string {
  // In a real app, this would come from environment variables
  // For now, we'll use a default value that can be configured via docker
  // Safety check for import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return 'http://localhost:3001';
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  // Safety check for import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.DEV === true;
  }
  return true; // Default to development mode if env is not available
}