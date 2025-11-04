import request from 'supertest';
import {
  createAndPersistCocktail,
  createAndPersistIngredient,
} from './utils/test-factories';
import { Cocktail } from 'src/cocktails/entities/cocktail.entity';
import { CreateCocktailDto } from 'src/cocktails/dto/create-cocktail.dto';
import { CursorResponse } from 'src/utils/cursor-pagination';
import { app, orm } from './setup-e2e';

describe('Cocktails E2E', () => {
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
      const createDto: CreateCocktailDto = {
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
      await Promise.all(
        Array.from({ length: 3 }).map(() => createAndPersistCocktail(orm)),
      );
    });

    it('should return cursor paginated cocktails', async () => {
      const response = await request(app.getHttpServer()).get('/cocktails');

      const body = response.body as CursorResponse<Cocktail>;
      const item0 = body.items[0];

      expect(body.items).toHaveLength(3);
      expect(body.totalCount).toBe(3);
      expect(item0).toHaveProperty('id');
      expect(item0).toHaveProperty('name');
    });

    it('should apply limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/cocktails?limit=11')
        .expect(200);

      const body = response.body as CursorResponse<Cocktail>;

      expect(body.items.length).toBeLessThanOrEqual(11);
    });

    it('should apply cursor-based pagination', async () => {
      await Promise.all(
        Array.from({ length: 8 }).map(() => createAndPersistCocktail(orm)),
      );
      const firstPage = await request(app.getHttpServer())
        .get('/cocktails?limit=10')
        .expect(200);

      const firstPageBody = firstPage.body as CursorResponse<Cocktail>;

      const firstId = firstPageBody.items[0].id;

      const secondPage = await request(app.getHttpServer())
        .get(`/cocktails?limit=10&cursor=${firstPageBody.endCursor}`)
        .expect(200);
      const secondPageBody = secondPage.body as CursorResponse<Cocktail>;

      expect(secondPageBody.items).toHaveLength(1);
      expect(secondPageBody.items[0].id).toBeLessThan(firstId);
    });

    it('should filter by category', async () => {
      await createAndPersistCocktail(orm, { category: 'Classic' });
      const response = await request(app.getHttpServer())
        .get('/cocktails?category=Classic')
        .expect(200);

      const body = response.body as CursorResponse<Cocktail>;

      body.items.forEach((cocktail) => {
        expect(cocktail.category).toBe('Classic');
      });
    });
  });

  // TODO: Add more tests for PUT, DELETE, and edge cases
});
