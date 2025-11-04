import { INestApplication } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { setupE2ETest, teardownE2ETest } from './utils/e2e-setup';
import { App } from 'supertest/types';

export let app: INestApplication<App>;
export let orm: MikroORM<SqliteDriver>;

beforeAll(async () => {
  const setup = await setupE2ETest();
  app = setup.app;
  orm = setup.orm;
});

afterAll(async () => {
  await teardownE2ETest(app, orm);
});

afterEach(async () => {
  await orm.getSchemaGenerator().refreshDatabase();
});
