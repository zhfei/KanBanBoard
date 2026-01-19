-- Initialize database schema for Kanban Board
-- This script is idempotent and can be run multiple times safely

-- Create tasks table if not exists
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(16) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status if not exists
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Add CHECK constraint for status if not exists (optional, for database-level validation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tasks_status_check'
  ) THEN
    ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
    CHECK (status IN ('Todo', 'Doing', 'Done'));
  END IF;
END $$;
