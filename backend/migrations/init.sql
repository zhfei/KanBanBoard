-- Initialize database schema for Kanban Board
-- This script is idempotent and can be run multiple times safely

\echo '[Migration] Starting database initialization...'

-- Create tasks table if not exists
\echo '[Migration] Creating tasks table...'
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(16) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status if not exists
\echo '[Migration] Creating index on status...'
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Add CHECK constraint for status if not exists (optional, for database-level validation)
\echo '[Migration] Adding status constraint...'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tasks_status_check'
  ) THEN
    ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
    CHECK (status IN ('Todo', 'Doing', 'Done'));
    RAISE NOTICE '[Migration] Status constraint added';
  ELSE
    RAISE NOTICE '[Migration] Status constraint already exists, skipping';
  END IF;
END $$;

\echo '[Migration] Database initialization completed successfully!'
