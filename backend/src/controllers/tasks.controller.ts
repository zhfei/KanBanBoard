/**
 * Task controller - HTTP layer
 */

import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/tasks.service';
import { CreateTaskPayload, UpdateTaskPayload, GetTasksQuery } from '../validators/tasks.validator';

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}

/**
 * Success response helper
 */
function successResponse<T>(data: T, message: string = 'ok'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
  };
}

/**
 * Task controller class
 */
export class TaskController {
  /**
   * GET /api/tasks
   * Get all tasks, optionally filtered by status
   */
  async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as GetTasksQuery;
      const tasks = await taskService.getTasks(query.status);
      
      res.json(successResponse(tasks));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/:id
   * Get a single task by ID
   */
  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);
      
      res.json(successResponse(task));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/tasks
   * Create a new task
   */
  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = req.body as CreateTaskPayload;
      const task = await taskService.createTask(payload);
      
      res.status(201).json(successResponse(task, '任务创建成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/tasks/:id
   * Update a task
   */
  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const payload = req.body as UpdateTaskPayload;
      const task = await taskService.updateTask(id, payload);
      
      res.json(successResponse(task, '任务更新成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Delete a task
   */
  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await taskService.deleteTask(id);
      
      res.json(successResponse(null, '任务删除成功'));
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const taskController = new TaskController();
