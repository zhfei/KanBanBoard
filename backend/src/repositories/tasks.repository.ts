/**
 * Task repository - Data access layer
 */

import { Prisma, Task } from '@prisma/client';
import { db } from '../config/db';
import { Logger } from '../utils/logger';

const logger = new Logger('TaskRepository');

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
}

/**
 * Task repository class
 */
export class TaskRepository {
  /**
   * Find all tasks, optionally filtered by status
   */
  async findAll(status?: string): Promise<Task[]> {
    try {
      const where: Prisma.TaskWhereInput = {};
      
      if (status) {
        where.status = status;
      }

      const tasks = await db.task.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
      });

      logger.debug(`Found ${tasks.length} tasks`, { status });
      return tasks;
    } catch (error) {
      logger.error('Failed to find tasks', { error, status });
      throw error;
    }
  }

  /**
   * Find a task by ID
   */
  async findById(id: string): Promise<Task | null> {
    try {
      const task = await db.task.findUnique({
        where: { id },
      });

      logger.debug('Found task by ID', { id, found: !!task });
      return task;
    } catch (error) {
      logger.error('Failed to find task by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create a new task
   */
  async create(data: CreateTaskData): Promise<Task> {
    try {
      const task = await db.task.create({
        data: {
          title: data.title,
          description: data.description,
          status: data.status || 'Todo',
        },
      });

      logger.info('Task created', { id: task.id, title: task.title });
      return task;
    } catch (error) {
      logger.error('Failed to create task', { error, data });
      throw error;
    }
  }

  /**
   * Update a task
   */
  async update(id: string, data: UpdateTaskData): Promise<Task> {
    try {
      const task = await db.task.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.status !== undefined && { status: data.status }),
        },
      });

      logger.info('Task updated', { id: task.id, updates: data });
      return task;
    } catch (error) {
      logger.error('Failed to update task', { error, id, data });
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async delete(id: string): Promise<void> {
    try {
      await db.task.delete({
        where: { id },
      });

      logger.info('Task deleted', { id });
    } catch (error) {
      logger.error('Failed to delete task', { error, id });
      throw error;
    }
  }
}

// Export singleton instance
export const taskRepository = new TaskRepository();
