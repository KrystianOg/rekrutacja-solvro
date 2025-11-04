import { defineConfig } from '@mikro-orm/sqlite';
import { SqliteDriver } from '@mikro-orm/sqlite';

const isTest = process.env.NODE_ENV === 'test';

export default defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: !isTest,
  logger: isTest ? () => {} : console.log,
  dbName: 'database.sqlite3',
  driver: SqliteDriver,
  migrations: {
    path: './db/migrations',
    transactional: true,
  },
  ignoreUndefinedInQuery: true,
});
