import { httpClient } from './httpClient';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task';
import { Logger } from '../utils/logger';
import { mockTasksApi, ENABLE_MOCK } from './mockApi';

const logger = new Logger('TasksAPI');

/**
 * Tasks API client
 */
export const tasksApi = {
  /**
   * Get all tasks, optionally filtered by status
   */
  async getTasks(status?: string): Promise<Task[]> {
    logger.info('Fetching tasks', { status });
    
    // Use mock API if enabled
    if (ENABLE_MOCK) {
      return mockTasksApi.getTasks(status);
    }
    
    const endpoint = status ? `/api/tasks?status=${status}` : '/api/tasks';
    return httpClient.get<Task[]>(endpoint);
  },

  /**
   * Get a single task by ID
   */
  async getTask(id: string): Promise<Task> {
    logger.info('Fetching task', { id });
    
    // Use mock API if enabled
    if (ENABLE_MOCK) {
      return mockTasksApi.getTask(id);
    }
    
    return httpClient.get<Task>(`/api/tasks/${id}`);
  },

  /**
   * Create a new task
   */
  async createTask(payload: CreateTaskPayload): Promise<Task> {
    logger.info('Creating task', { title: payload.title });
    
    // Validate title
    if (!payload.title || payload.title.trim().length === 0) {
      throw new Error('任务标题不能为空');
    }
    if (payload.title.length > 200) {
      throw new Error('任务标题不能超过200个字符');
    }

    // Use mock API if enabled
    if (ENABLE_MOCK) {
      return mockTasksApi.createTask(payload);
    }

    return httpClient.post<Task>('/api/tasks', payload);
  },

  /**
   * Update a task
   */
  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    logger.info('Updating task', { id, payload });
    
    // Validate title if provided
    if (payload.title !== undefined) {
      if (payload.title.trim().length === 0) {
        throw new Error('任务标题不能为空');
      }
      if (payload.title.length > 200) {
        throw new Error('任务标题不能超过200个字符');
      }
    }

    // Validate status if provided
    if (payload.status !== undefined) {
      const validStatuses = ['Todo', 'Doing', 'Done'];
      if (!validStatuses.includes(payload.status)) {
        throw new Error('无效的任务状态');
      }
    }

    // Use mock API if enabled
    if (ENABLE_MOCK) {
      return mockTasksApi.updateTask(id, payload);
    }

    return httpClient.put<Task>(`/api/tasks/${id}`, payload);
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    logger.info('Deleting task', { id });
    
    // Use mock API if enabled
    if (ENABLE_MOCK) {
      return mockTasksApi.deleteTask(id);
    }
    
    return httpClient.delete<void>(`/api/tasks/${id}`);
  },
};