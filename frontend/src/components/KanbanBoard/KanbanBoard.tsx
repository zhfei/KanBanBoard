import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTasks } from '../../state/tasksStore';
import type { Task, TaskStatus } from '../../types/task';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from '../TaskModal/TaskModal';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

export function KanbanBoard() {
  const { state, actions } = useTasks();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    task?: Task;
  }>({
    isOpen: false,
    mode: 'create',
  });

  // Group tasks by status
  const tasksByStatus = React.useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      Todo: [],
      Doing: [],
      Done: [],
    };

    state.tasks.forEach((task) => {
      if (groups[task.status]) {
        groups[task.status].push(task);
      }
    });

    // Sort by updated_at descending (newest first)
    Object.keys(groups).forEach((status) => {
      groups[status as TaskStatus].sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

    return groups;
  }, [state.tasks]);

  const handleAddTask = () => {
    setModalState({ isOpen: true, mode: 'create' });
  };

  const handleEditTask = (task: Task) => {
    setModalState({ isOpen: true, mode: 'edit', task });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'create', task: undefined });
  };

  const handleSaveTask = async (title: string, description?: string) => {
    if (modalState.mode === 'create') {
      await actions.createTask(title, description);
    } else if (modalState.task) {
      await actions.updateTask(modalState.task.id, title, description);
    }
  };

  const handleDeleteTask = async (id: string) => {
    await actions.deleteTask(id);
  };

  const handleMoveTask = async (taskId: string, newStatus: TaskStatus) => {
    await actions.moveTask(taskId, newStatus);
  };

  if (state.loading && state.tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">加载任务中...</p>
        </div>
      </div>
    );
  }

  if (state.error && state.tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{state.error}</p>
          <Button onClick={actions.fetchTasks} variant="outline">
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full">
        {/* Board Container */}
        <div className="flex gap-6 h-full overflow-x-auto pb-6">
          <KanbanColumn
            status="Todo"
            title="待办"
            tasks={tasksByStatus.Todo}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onDrop={handleMoveTask}
            onAddTask={handleAddTask}
          />
          <KanbanColumn
            status="Doing"
            title="进行中"
            tasks={tasksByStatus.Doing}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onDrop={handleMoveTask}
            onAddTask={handleAddTask}
          />
          <KanbanColumn
            status="Done"
            title="已完成"
            tasks={tasksByStatus.Done}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onDrop={handleMoveTask}
            onAddTask={handleAddTask}
          />
        </div>

        {/* Task Modal */}
        <TaskModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          task={modalState.task}
          mode={modalState.mode}
        />
      </div>
    </DndProvider>
  );
}
