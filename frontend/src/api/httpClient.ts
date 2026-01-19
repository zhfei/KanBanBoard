import { getApiBaseUrl } from '../utils/env';
import { ApiError } from '../utils/errors';
import { Logger, generateRequestId } from '../utils/logger';
import type { ApiResponse } from '../types/task';

const logger = new Logger('HttpClient');

/**
 * HTTP Client configuration
 */
interface RequestConfig extends RequestInit {
  timeout?: number;
}

/**
 * Default timeout (30 seconds)
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * HTTP Client for API communication
 */
class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a request with timeout support
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { timeout = DEFAULT_TIMEOUT, ...fetchConfig } = config;
    const requestId = generateRequestId();
    const url = `${this.baseUrl}${endpoint}`;
    
    logger.info(`Request started: ${config.method || 'GET'} ${endpoint}`, {
      requestId,
      url,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
          ...fetchConfig.headers,
        },
      });

      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;

      logger.info(`Request completed: ${config.method || 'GET'} ${endpoint}`, {
        requestId,
        statusCode: response.status,
        latency: `${latency}ms`,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.code || 9000,
          response.status
        );
      }

      const data: ApiResponse<T> = await response.json();

      if (data.code !== 0) {
        throw new ApiError(data.message, data.code);
      }

      return data.data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        logger.error(`API Error: ${config.method || 'GET'} ${endpoint}`, {
          requestId,
          code: error.code,
          message: error.message,
        });
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          logger.error(`Request timeout: ${config.method || 'GET'} ${endpoint}`, {
            requestId,
            timeout,
          });
          throw new ApiError('请求超时，请稍后重试', 9000);
        }
        
        logger.error(`Request failed: ${config.method || 'GET'} ${endpoint}`, {
          requestId,
          error: error.message,
        });
        throw new ApiError(error.message, 9000);
      }

      throw new ApiError('发生未知错误', 9000);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

/**
 * Singleton instance
 */
export const httpClient = new HttpClient(getApiBaseUrl());
