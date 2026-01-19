/**
 * Task routes
 */

import { Router } from 'express';
import { taskController } from '../controllers/tasks.controller';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamsSchema,
  getTasksQuerySchema,
} from '../validators/tasks.validator';
import { validate } from '../middlewares/validator';

const router = Router();

/**
 * GET /api/tasks
 * Get all tasks, optionally filtered by status
 */
router.get(
  '/',
  validate(getTasksQuerySchema, 'query'),
  taskController.getTasks.bind(taskController)
);

/**
 * GET /api/tasks/:id
 * Get a single task by ID
 */
router.get(
  '/:id',
  validate(taskIdParamsSchema, 'params'),
  taskController.getTaskById.bind(taskController)
);

/**
 * POST /api/tasks
 * Create a new task
 */
router.post(
  '/',
  validate(createTaskSchema, 'body'),
  taskController.createTask.bind(taskController)
);

/**
 * PUT /api/tasks/:id
 * Update a task
 */
router.put(
  '/:id',
  validate(taskIdParamsSchema, 'params'),
  validate(updateTaskSchema, 'body'),
  taskController.updateTask.bind(taskController)
);

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete(
  '/:id',
  validate(taskIdParamsSchema, 'params'),
  taskController.deleteTask.bind(taskController)
);

export default router;
