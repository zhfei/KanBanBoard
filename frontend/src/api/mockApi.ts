import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task';
import { Logger } from '../utils/logger';

const logger = new Logger('MockAPI');

/**
 * Mock tasks data
 */
let mockTasks: Task[] = [
  {
    id: '1',
    title: '设计产品原型',
    description: '使用 Figma 完成产品原型设计，包括主要页面和交互流程',
    status: 'Todo',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '2',
    title: '实现用户认证功能',
    description: '完成用户注册、登录、密码重置等功能',
    status: 'Doing',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: '3',
    title: '编写项目文档',
    description: 'README 和 API 文档编写',
    status: 'Done',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '4',
    title: '配置 CI/CD 流程',
    description: '使用 GitHub Actions 配置自动化测试和部署',
    status: 'Todo',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '5',
    title: '优化页面性能',
    description: '减少首屏加载时间，优化图片资源',
    status: 'Doing',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
  },
];

/**
 * Simulate network delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Mock Tasks API
 */
export const mockTasksApi = {
  /**
   * Get all tasks
   */
  async getTasks(status?: string): Promise<Task[]> {
    await delay(300);
    logger.info('Mock: Fetching tasks', { status });
    
    if (status) {
      return mockTasks.filter((task) => task.status === status);
    }
    return [...mockTasks];
  },

  /**
   * Get a single task
   */
  async getTask(id: string): Promise<Task> {
    await delay(200);
    logger.info('Mock: Fetching task', { id });
    
    const task = mockTasks.find((t) => t.id === id);
    if (!task) {
      throw new Error('任务不存在');
    }
    return { ...task };
  },

  /**
   * Create a new task
   */
  async createTask(payload: CreateTaskPayload): Promise<Task> {
    await delay(400);
    logger.info('Mock: Creating task', { title: payload.title });
    
    const newTask: Task = {
      id: generateId(),
      title: payload.title,
      description: payload.description,
      status: 'Todo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockTasks.push(newTask);
    return { ...newTask };
  },

  /**
   * Update a task
   */
  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    await delay(400);
    logger.info('Mock: Updating task', { id, payload });
    
    const taskIndex = mockTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new Error('任务不存在');
    }
    
    const updatedTask: Task = {
      ...mockTasks[taskIndex],
      ...payload,
      updated_at: new Date().toISOString(),
    };
    
    mockTasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    await delay(300);
    logger.info('Mock: Deleting task', { id });
    
    const taskIndex = mockTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new Error('任务不存在');
    }
    
    mockTasks.splice(taskIndex, 1);
  },
};

/**
 * Enable mock mode flag
 * Set to true to use mock data instead of real API
 */
export const ENABLE_MOCK = true;