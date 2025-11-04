import request from 'supertest';
import { app } from './setup-e2e';

describe('Ingredients E2E', () => {
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
