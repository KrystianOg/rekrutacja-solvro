import { Test, TestingModule } from '@nestjs/testing';
import { CocktailsController } from './cocktails.controller';
import { CocktailsService } from './cocktails.service';
import {
  mockCreateCocktailDtoWithIngredients,
  mockCreateCocktailDtoWithoutIngredients,
} from 'test/mocks/utils/cocktail.fixtures';
import { generateCocktailData } from 'test/utils/test-factories';
import { createMockService } from 'test/mocks/mikro-orm';

describe('CocktailsController', () => {
  let controller: CocktailsController;
  let service: jest.Mocked<CocktailsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CocktailsController],
      providers: [
        {
          provide: CocktailsService,
          useValue: createMockService(CocktailsService),
        },
      ],
    }).compile();

    controller = module.get<CocktailsController>(CocktailsController);
    service = module.get(CocktailsService);
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /cocktails - create', () => {
    it('should create a cocktail with ingredients', async () => {
      const mockCocktail = generateCocktailData();
      service.create.mockResolvedValue(mockCocktail);

      const result = await controller.create(
        mockCreateCocktailDtoWithIngredients,
      );

      expect(service.create).toHaveBeenCalledWith(
        mockCreateCocktailDtoWithIngredients,
      );
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCocktail);
    });

    it('should create a cocktail without ingredients', async () => {
      const mockCocktail = generateCocktailData();
      service.create.mockResolvedValue(mockCocktail);

      const result = await controller.create(
        mockCreateCocktailDtoWithoutIngredients,
      );

      expect(service.create).toHaveBeenCalledWith(
        mockCreateCocktailDtoWithoutIngredients,
      );
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCocktail);
    });
  });

  describe('GET /cocktails - findAll', () => {
    it('should return all cocktails with empty query', async () => {
      const mockCocktails = generateCocktailData.cursor(3);
      service.findAll.mockResolvedValue(mockCocktails);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith({});
      expect(service.findAll).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockCocktails);
    });

    it('should filter by isAlcoholic=true', async () => {
      const mockCocktails = generateCocktailData.cursor(2);
      service.findAll.mockResolvedValue(mockCocktails);

      const result = await controller.findAll({ isAlcoholic: true });

      expect(service.findAll).toHaveBeenCalledWith({ isAlcoholic: true });
      expect(result).toEqual(mockCocktails);
    });

    it('should filter by isAlcoholic=false', async () => {
      const mockCocktails = generateCocktailData.cursor(2);
      service.findAll.mockResolvedValue(mockCocktails);

      const result = await controller.findAll({ isAlcoholic: false });

      expect(service.findAll).toHaveBeenCalledWith({ isAlcoholic: false });
      expect(result).toEqual(mockCocktails);
    });

    it('should apply pagination with limit', async () => {
      const mockCocktails = generateCocktailData.cursor(5);
      service.findAll.mockResolvedValue(mockCocktails);

      const result = await controller.findAll({ limit: 10 });

      expect(service.findAll).toHaveBeenCalledWith({ limit: 10 });
      expect(result).toEqual(mockCocktails);
    });

    it('should apply pagination with limit and cursor', async () => {
      const mockCocktails = generateCocktailData.cursor(4);
      service.findAll.mockResolvedValue(mockCocktails);

      const result = await controller.findAll({ limit: 10, cursor: 'abc' });

      expect(service.findAll).toHaveBeenCalledWith({
        limit: 10,
        cursor: 'abc',
      });
      expect(result).toEqual(mockCocktails);
    });
  });

  describe('GET /cocktails/:id - findOne', () => {
    it('should return a single cocktail by id', async () => {
      const mockCocktail = generateCocktailData();
      service.findOne.mockResolvedValue(mockCocktail);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCocktail);
    });

    it('should handle different cocktail ids', async () => {
      const mockCocktail = generateCocktailData();
      service.findOne.mockResolvedValue(mockCocktail);

      const result = await controller.findOne(99);

      expect(service.findOne).toHaveBeenCalledWith(99);
      expect(result).toEqual(mockCocktail);
    });
  });

  describe('PATCH /cocktails/:id - update', () => {
    it('should update a cocktail', async () => {
      const updateDto = { name: 'Updated Martini' };
      const mockCocktail = generateCocktailData();
      service.update.mockResolvedValue(mockCocktail);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCocktail);
    });

    it('should update multiple fields', async () => {
      const updateDto = {
        name: 'New Name',
        instructions: 'New instructions',
        isAlcoholic: false,
      };
      const mockCocktail = generateCocktailData();
      service.update.mockResolvedValue(mockCocktail);

      const result = await controller.update(2, updateDto);

      expect(service.update).toHaveBeenCalledWith(2, updateDto);
      expect(result).toEqual(mockCocktail);
    });
  });

  describe('DELETE /cocktails/:id - remove', () => {
    it('should delete a cocktail', async () => {
      service.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should delete different cocktail ids', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(42);

      expect(service.remove).toHaveBeenCalledWith(42);
    });
  });
});
