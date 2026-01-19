import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Task, TaskStatus } from '../types/task';
import { tasksApi } from '../api/tasksApi';
import { getUserErrorMessage } from '../utils/errors';
import { Logger } from '../utils/logger';
import { toast } from 'sonner@2.0.3';

const logger = new Logger('TasksStore');

/**
 * State interface
 */
interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

/**
 * Action types
 */
type TasksAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'OPTIMISTIC_UPDATE'; payload: { id: string; status: TaskStatus } }
  | { type: 'ROLLBACK_UPDATE'; payload: Task };

/**
 * Reducer
 */
function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, tasks: action.payload, error: null };
    
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    
    case 'OPTIMISTIC_UPDATE':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status }
            : task
        ),
      };
    
    case 'ROLLBACK_UPDATE':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    
    default:
      return state;
  }
}

/**
 * Context value interface
 */
interface TasksContextValue {
  state: TasksState;
  actions: {
    fetchTasks: () => Promise<void>;
    createTask: (title: string, description?: string) => Promise<void>;
    updateTask: (id: string, title: string, description?: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    moveTask: (id: string, newStatus: TaskStatus) => Promise<void>;
  };
}

/**
 * Context
 */
const TasksContext = createContext<TasksContextValue | undefined>(undefined);

/**
 * Provider component
 */
export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, {
    tasks: [],
    loading: false,
    error: null,
  });

  /**
   * Fetch all tasks
   */
  const fetchTasks = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      logger.info('Fetching all tasks');
      const tasks = await tasksApi.getTasks();
      dispatch({ type: 'FETCH_SUCCESS', payload: tasks });
      logger.info('Tasks fetched successfully', { count: tasks.length });
    } catch (error) {
      const message = getUserErrorMessage(error);
      logger.error('Failed to fetch tasks', { error: message });
      dispatch({ type: 'FETCH_ERROR', payload: message });
      toast.error('加载任务失败', { description: message });
    }
  };

  /**
   * Create a new task
   */
  const createTask = async (title: string, description?: string) => {
    try {
      logger.info('Creating new task', { title });
      const task = await tasksApi.createTask({ title, description });
      dispatch({ type: 'ADD_TASK', payload: task });
      logger.info('Task created successfully', { id: task.id });
      toast.success('任务创建成功');
    } catch (error) {
      const message = getUserErrorMessage(error);
      logger.error('Failed to create task', { error: message });
      toast.error('创建任务失败', { description: message });
      throw error;
    }
  };

  /**
   * Update a task
   */
  const updateTask = async (id: string, title: string, description?: string) => {
    try {
      logger.info('Updating task', { id });
      const task = await tasksApi.updateTask(id, { title, description });
      dispatch({ type: 'UPDATE_TASK', payload: task });
      logger.info('Task updated successfully', { id });
      toast.success('任务更新成功');
    } catch (error) {
      const message = getUserErrorMessage(error);
      logger.error('Failed to update task', { error: message });
      toast.error('更新任务失败', { description: message });
      throw error;
    }
  };

  /**
   * Delete a task
   */
  const deleteTask = async (id: string) => {
    try {
      logger.info('Deleting task', { id });
      await tasksApi.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      logger.info('Task deleted successfully', { id });
      toast.success('任务已删除');
    } catch (error) {
      const message = getUserErrorMessage(error);
      logger.error('Failed to delete task', { error: message });
      toast.error('删除任务失败', { description: message });
      throw error;
    }
  };

  /**
   * Move task to different column (drag and drop)
   */
  const moveTask = async (id: string, newStatus: TaskStatus) => {
    const originalTask = state.tasks.find((t) => t.id === id);
    if (!originalTask) {
      logger.error('Task not found for move', { id });
      return;
    }

    // Optimistic update
    logger.info('Moving task (optimistic)', { id, from: originalTask.status, to: newStatus });
    dispatch({ type: 'OPTIMISTIC_UPDATE', payload: { id, status: newStatus } });

    try {
      const updatedTask = await tasksApi.updateTask(id, { status: newStatus });
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      logger.info('Task moved successfully', { id, status: newStatus });
    } catch (error) {
      const message = getUserErrorMessage(error);
      logger.error('Failed to move task, rolling back', { id, error: message });
      
      // Rollback to original state
      dispatch({ type: 'ROLLBACK_UPDATE', payload: originalTask });
      
      toast.error('移动任务失败', { description: message });
      
      // Optionally, refetch all tasks to ensure consistency
      await fetchTasks();
    }
  };

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const value: TasksContextValue = {
    state,
    actions: {
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      moveTask,
    },
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

/**
 * Custom hook to use tasks context
 */
export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within TasksProvider');
  }
  return context;
}
