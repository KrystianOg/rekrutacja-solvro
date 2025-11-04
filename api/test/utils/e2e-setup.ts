import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { AppModule } from '../../src/app.module';
import { App } from 'supertest/types';
import config from '../../mikro-orm.config';

export interface TestSetup {
  app: INestApplication<App>;
  orm: MikroORM<SqliteDriver>;
}

/**
 * Handles the common setup logic for E2E tests:
 * 1. Initializes the NestJS Testing Module.
 * 2. Overrides the ORM config for an isolated in-memory SQLite database.
 * 3. Initializes the application and global pipes.
 * 4. Resets the database schema.
 * @param dbNameSuffix A unique string to differentiate the in-memory DB (e.g., 'cocktails' or 'ingredients').
 * @returns An object containing the initialized NestJS app and MikroORM instance.
 */
export async function setupE2ETest(): Promise<TestSetup> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MikroORM)
    .useFactory({
      factory: () => {
        const testConfig = {
          ...config,
          dbName: ':memory:',
          allowGlobalContext: true,
        };
        const orm = MikroORM.init<SqliteDriver>(testConfig);
        return orm;
      },
    })

    .compile();

  const app = moduleFixture.createNestApplication<INestApplication<App>>();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  const orm = moduleFixture.get<MikroORM<SqliteDriver>>(MikroORM);

  // Ensure a clean state by dropping and recreating the schema
  await orm.getSchemaGenerator().refreshDatabase();

  await app.init();

  return { app, orm };
}

/**
 * Handles the common teardown logic for E2E tests.
 * @param app The NestJS INestApplication instance.
 * @param orm The MikroORM instance.
 */
export async function teardownE2ETest(
  app: INestApplication,
  orm: MikroORM<SqliteDriver>,
): Promise<void> {
  await orm.close(true);
  await app.close();
}
