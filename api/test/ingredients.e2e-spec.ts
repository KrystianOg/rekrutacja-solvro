import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { MikroORM } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { setupE2ETest, teardownE2ETest } from './utils/e2e-setup';

describe('Ingredients E2E', () => {
  let app: INestApplication<App>;
  let orm: MikroORM<SqliteDriver>;

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

  describe('POST /ingredients', () => {
    it('should create a new ingredient', async () => {
      const createDto = {
        name: 'New Ingredient',
        description: 'Description of new ingredient',
        imageUrl: 'http://cdn.example.com/images/lemon-juice.png',
        isAlcoholic: false,
      };

      const response = await request(app.getHttpServer())
        .post('/ingredients')
        .send(createDto)
        .expect(201);

      expect(response.body).toMatchObject({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.any(Number),
        ...createDto,
      });
    });

    it('should return 400 for ingredient data', async () => {
      const invalidDto = {
        name: '', // Empty name should fail validation
        description: 'Description of new ingredient',
        imageUrl: 'http://cdn.example.com/images/lemon-juice.png',
        isAlcoholic: false,
      };

      await request(app.getHttpServer())
        .post('/ingredients')
        .send(invalidDto)
        .expect(400);
    });
  });
});
