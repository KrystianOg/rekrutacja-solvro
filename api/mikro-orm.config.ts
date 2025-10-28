import { defineConfig } from '@mikro-orm/sqlite';
import { SqliteDriver } from '@mikro-orm/sqlite';

export default defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true,
  dbName: 'database.sqlite3',
  driver: SqliteDriver,
  migrations: {
    path: './db/migrations',
    transactional: true,
  },
});
