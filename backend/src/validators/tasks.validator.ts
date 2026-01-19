/**
 * Task validation schemas using Zod
 */

import { z } from 'zod';

/**
 * Task status enum
 */
export const TaskStatus = z.enum(['Todo', 'Doing', 'Done']);

export type TaskStatusType = z.infer<typeof TaskStatus>;

/**
 * UUID validation schema
 */
export const taskIdSchema = z.string().uuid('无效的任务ID格式');

/**
 * Task status validation schema
 */
export const taskStatusSchema = TaskStatus;

/**
 * Create task payload schema
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, '任务标题不能为空')
    .max(200, '任务标题不能超过200个字符')
    .trim(),
  description: z.string().optional(),
});

export type CreateTaskPayload = z.infer<typeof createTaskSchema>;

/**
 * Update task payload schema
 */
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, '任务标题不能为空')
    .max(200, '任务标题不能超过200个字符')
    .trim()
    .optional(),
  description: z.string().optional(),
  status: TaskStatus.optional(),
});

export type UpdateTaskPayload = z.infer<typeof updateTaskSchema>;

/**
 * Query parameters schema for GET /api/tasks
 */
export const getTasksQuerySchema = z.object({
  status: TaskStatus.optional(),
});

export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;

/**
 * Task ID params schema
 */
export const taskIdParamsSchema = z.object({
  id: taskIdSchema,
});

export type TaskIdParams = z.infer<typeof taskIdParamsSchema>;
