/**
 * Task status types
 */
export type TaskStatus = 'Todo' | 'Doing' | 'Done';

/**
 * Task interface
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Task creation payload
 */
export interface CreateTaskPayload {
  title: string;
  description?: string;
}

/**
 * Task update payload
 */
export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}
