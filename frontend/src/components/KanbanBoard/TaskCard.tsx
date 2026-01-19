import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

export const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, onDelete, isDragging }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-lg shadow-sm border border-border p-4 mb-3
          hover:shadow-md transition-shadow cursor-move group
          ${isDragging ? 'opacity-50 rotate-2' : 'opacity-100'}
        `}
      >
        {/* Title */}
        <h3 className="mb-2 pr-2 break-words">{task.title}</h3>

        {/* Description (if exists) */}
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3 break-words">
            {task.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {new Date(task.updated_at).toLocaleDateString('zh-CN')}
          </span>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1.5 hover:bg-muted rounded transition-colors"
              title="编辑任务"
            >
              <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('确定要删除这个任务吗？')) {
                  onDelete(task.id);
                }
              }}
              className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
              title="删除任务"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

TaskCard.displayName = 'TaskCard';
