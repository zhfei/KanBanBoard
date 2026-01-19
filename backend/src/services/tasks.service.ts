/**
 * Task service - Business logic layer
 */

import { Task } from '@prisma/client';
import { taskRepository, CreateTaskData, UpdateTaskData } from '../repositories/tasks.repository';
import { TaskNotFoundError } from '../utils/errors';
import { Logger } from '../utils/logger';
import { CreateTaskPayload, UpdateTaskPayload } from '../validators/tasks.validator';

const logger = new Logger('TaskService');

/**
 * Task service class
 */
export class TaskService {
  /**
   * Get all tasks, optionally filtered by status
   */
  async getTasks(status?: string): Promise<Task[]> {
    logger.info('Getting tasks', { status });
    return taskRepository.findAll(status);
  }

  /**
   * Get a task by ID
   */
  async getTaskById(id: string): Promise<Task> {
    logger.info('Getting task by ID', { id });
    
    const task = await taskRepository.findById(id);
    
    if (!task) {
      throw new TaskNotFoundError();
    }

    return task;
  }

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskPayload): Promise<Task> {
    logger.info('Creating task', { title: data.title });

    const createData: CreateTaskData = {
      title: data.title,
      description: data.description,
      status: 'Todo', // Default status
    };

    const task = await taskRepository.create(createData);
    logger.info('Task created successfully', { id: task.id });
    
    return task;
  }

  /**
   * Update a task
   */
  async updateTask(id: string, data: UpdateTaskPayload): Promise<Task> {
    logger.info('Updating task', { id, updates: data });

    // Check if task exists
    const existingTask = await taskRepository.findById(id);
    if (!existingTask) {
      throw new TaskNotFoundError();
    }

    // Validate status if provided
    if (data.status) {
      const validStatuses = ['Todo', 'Doing', 'Done'];
      if (!validStatuses.includes(data.status)) {
        throw new Error('无效的任务状态');
      }
    }

    const updateData: UpdateTaskData = {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status }),
    };

    const task = await taskRepository.update(id, updateData);
    logger.info('Task updated successfully', { id: task.id });
    
    return task;
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    logger.info('Deleting task', { id });

    // Check if task exists
    const existingTask = await taskRepository.findById(id);
    if (!existingTask) {
      throw new TaskNotFoundError();
    }

    await taskRepository.delete(id);
    logger.info('Task deleted successfully', { id });
  }
}

// Export singleton instance
export const taskService = new TaskService();
