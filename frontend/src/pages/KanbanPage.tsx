import { TasksProvider } from '../state/tasksStore';
import { KanbanBoard } from '../components/KanbanBoard/KanbanBoard';
import { Trello, Plus, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTasks } from '../state/tasksStore';
import { Toaster } from '../components/ui/sonner';

function KanbanPageContent() {
  const { state, actions } = useTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Trello className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">看板任务管理</h1>
                <p className="text-sm text-muted-foreground">Kanban Board</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={actions.fetchTasks}
                disabled={state.loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${state.loading ? 'animate-spin' : ''}`} />
                刷新
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="h-[calc(100vh-140px)]">
          <KanbanBoard />
        </div>
      </main>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}

export function KanbanPage() {
  return (
    <TasksProvider>
      <KanbanPageContent />
    </TasksProvider>
  );
}
