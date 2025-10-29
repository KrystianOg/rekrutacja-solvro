import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MikroORM } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import {
  createAndPersistCocktail,
  createAndPersistIngredient,
} from './utils/test-factories';
import { Cocktail } from 'src/cocktails/entities/cocktail.entity';
import { setupE2ETest, teardownE2ETest } from './utils/e2e-setup';
import { App } from 'supertest/types';

describe('Cocktails E2E', () => {
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

  describe('POST /cocktails', () => {
    it('should create a cocktail with ingredients', async () => {
      const ingredient = await createAndPersistIngredient(orm);

      const createDto = {
        name: 'Mojito',
        category: 'Classic',
        instructions: 'Muddle mint, add rum, lime, sugar, and soda',
        ingredients: [
          {
            ingredientId: ingredient.id,
            amount: '60',
            unit: 'ml',
            orderIndex: 0,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/cocktails')
        .send(createDto)
        .expect(201);

      expect(response.body).toMatchObject({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.any(Number),
        name: 'Mojito',
        category: 'Classic',
        instructions: 'Muddle mint, add rum, lime, sugar, and soda',
        cocktailIngredients: [
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            amount: '60',
            unit: 'ml',
            orderIndex: 0,
          },
        ],
      });
    });

    it('should return 400 when name is empty', async () => {
      const invalidDto = {
        name: '',
        category: 'Classic',
      };

      await request(app.getHttpServer())
        .post('/cocktails')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 when ingredient does not exist', async () => {
      const createDto = {
        name: 'Mojito',
        category: 'Classic',
        instructions: 'Mix it up',
        ingredients: [
          {
            ingredientId: 99999, // Non-existent ingredient
            amount: '60',
            unit: 'ml',
            orderIndex: 0,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/cocktails')
        .send(createDto)
        .expect(400);
    });
  });

  describe('GET /cocktails', () => {
    beforeEach(async () => {
      await createAndPersistCocktail(orm);
      await createAndPersistCocktail(orm);
      await createAndPersistCocktail(orm);
    });

    it('should return all cocktails', async () => {
      const response = await request(app.getHttpServer()).get('/cocktails');

      const body = response.body as Cocktail[];

      expect(body).toHaveLength(3);
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('name');
    });

    it('should apply limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/cocktails?limit=2')
        .expect(200);

      const body = response.body as Cocktail[];

      expect(body.length).toBeLessThanOrEqual(2);
    });

    it('should apply cursor-based pagination', async () => {
      const firstPage = await request(app.getHttpServer())
        .get('/cocktails?limit=1')
        .expect(200);

      const firstPageBody = firstPage.body as Cocktail[];
      const firstId = firstPageBody[0].id;

      const secondPage = await request(app.getHttpServer())
        .get(`/cocktails?limit=1&cursor=${firstId}`)
        .expect(200);
      const secondPageBody = secondPage.body as Cocktail[];

      expect(secondPageBody).toHaveLength(1);
      expect(secondPageBody[0].id).toBeGreaterThan(firstId);
    });
  });

  // TODO: Add more tests for PUT, DELETE, and edge cases
});
