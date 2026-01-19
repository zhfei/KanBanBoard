import React from 'react';
import { useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';
import type { Task, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: () => void;
}

const statusColors: Record<TaskStatus, string> = {
  Todo: 'bg-blue-500',
  Doing: 'bg-yellow-500',
  Done: 'bg-green-500',
};

export function KanbanColumn({
  status,
  title,
  tasks,
  onEdit,
  onDelete,
  onDrop,
  onAddTask,
}: KanbanColumnProps) {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string; status: TaskStatus }) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div className="flex flex-col h-full min-w-[320px] bg-muted/30 rounded-lg">
      {/* Column Header */}
      <div className="p-4 border-b border-border bg-card rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
            <h2 className="font-medium">{title}</h2>
            <span className="text-sm text-muted-foreground">
              ({tasks.length})
            </span>
          </div>
          {status === 'Todo' && (
            <button
              onClick={onAddTask}
              className="p-1 hover:bg-muted rounded transition-colors"
              title="新建任务"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tasks Container */}
      <div
        ref={dropRef}
        className={`
          flex-1 p-4 overflow-y-auto
          ${isActive ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}
          ${canDrop && !isOver ? 'bg-blue-50/50' : ''}
        `}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            暂无任务
          </div>
        ) : (
          <div>
            {tasks.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Draggable Task Card Wrapper
interface DraggableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function DraggableTaskCard({ task, onEdit, onDelete }: DraggableTaskCardProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <TaskCard
      ref={dragRef}
      task={task}
      onEdit={onEdit}
      onDelete={onDelete}
      isDragging={isDragging}
    />
  );
}

// Import useDrag for the draggable wrapper
import { useDrag } from 'react-dnd';
