/**
 * Environment configuration
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface EnvConfig {
  port: number;
  nodeEnv: string;
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    url: string;
  };
}

/**
 * Get environment configuration
 */
export function getEnvConfig(): EnvConfig {
  const port = parseInt(process.env.PORT || '8080', 10);
  const nodeEnv = process.env.NODE_ENV || 'development';

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
  const dbUser = process.env.DB_USER || 'kanban';
  const dbPassword = process.env.DB_PASSWORD || 'kanban';
  const dbName = process.env.DB_NAME || 'kanban';

  // Construct DATABASE_URL if not provided
  const databaseUrl =
    process.env.DATABASE_URL ||
    `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;

  return {
    port,
    nodeEnv,
    db: {
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      name: dbName,
      url: databaseUrl,
    },
  };
}

/**
 * Validate required environment variables
 */
export function validateEnv(): void {
  const required = ['DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
