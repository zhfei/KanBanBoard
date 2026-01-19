/**
 * Database configuration and Prisma Client singleton
 */

import { PrismaClient } from '@prisma/client';
import { getEnvConfig } from './env';
import { Logger } from '../utils/logger';

const logger = new Logger('Database');

// Prisma Client singleton
let prisma: PrismaClient;

/**
 * Get Prisma Client instance (singleton pattern)
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    const config = getEnvConfig();
    
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.db.url,
        },
      },
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });

    // Handle connection events
    prisma.$on('error' as never, (e: any) => {
      logger.error('Prisma Client error', { error: e });
    });

    logger.info('Prisma Client initialized', {
      database: config.db.name,
      host: config.db.host,
    });
  }

  return prisma;
}

/**
 * Connect to database
 */
export async function connectDatabase(): Promise<void> {
  try {
    const client = getPrismaClient();
    await client.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', { error });
    throw error;
  }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    const client = getPrismaClient();
    await client.$disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Failed to disconnect from database', { error });
    throw error;
  }
}

// Export Prisma Client instance
export const db = getPrismaClient();
