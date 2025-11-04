import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { generateIngredientData } from 'test/utils/test-factories';
import { createMockService } from 'test/mocks/mikro-orm';

describe('IngredientsController', () => {
  let controller: IngredientsController;
  let service: jest.Mocked<IngredientsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientsController],
      providers: [
        {
          provide: IngredientsService,
          useValue: createMockService(IngredientsService),
        },
      ],
    }).compile();

    controller = module.get<IngredientsController>(IngredientsController);
    service = module.get(IngredientsService);
  });

  describe('POST /ingredients - create', () => {
    it('should create ingredient', async () => {
      const mockIngredient = generateIngredientData();
      service.create.mockResolvedValue(mockIngredient);

      const result = await controller.create(mockIngredient);

      expect(service.create).toHaveBeenCalledWith(mockIngredient);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockIngredient);
    });
  });

  describe('GET /ingredients - findAll', () => {
    it('should return all ingredients', async () => {
      const mockIngredients = generateIngredientData.cursor(3);
      service.findAll.mockResolvedValue(mockIngredients);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith({});
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockIngredients);
    });
  });
});
