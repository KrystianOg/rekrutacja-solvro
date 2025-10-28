import { Test, TestingModule } from '@nestjs/testing';
import { CocktailsController } from './cocktails.controller';
import { CocktailsService } from './cocktails.service';
import {
  mockCreateCocktailDtoWithIngredients,
  mockCreateCocktailDtoWithoutIngredients,
} from 'test/mocks/utils/cocktail.fixtures';
import { generateCocktailData } from 'test/utils/test-factories';

const mockCocktailsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CocktailsController', () => {
  let controller: CocktailsController;
  let service: typeof mockCocktailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CocktailsController],
      providers: [
        {
          provide: CocktailsService,
          useValue: mockCocktailsService,
        },
      ],
    }).compile();

    controller = module.get<CocktailsController>(CocktailsController);
    service = module.get(CocktailsService);
    jest.clearAllMocks();
  });

  describe('POST /cocktails - create', () => {
    it('should create a cocktail with ingredients', async () => {
      const mockCocktail = { id: 1, ...generateCocktailData() };
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
      const mockCocktail = { id: 2, ...generateCocktailData() };
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
      const mockCocktails = [
        { id: 1, name: 'Martini', isAlcoholic: true },
        { id: 2, name: 'Virgin Mojito', isAlcoholic: false },
      ];
      service.findAll.mockResolvedValue(mockCocktails);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith({});
      expect(service.findAll).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockCocktails);
    });

    it('should filter by isAlcoholic=true', async () => {
      const mockCocktails = [{ id: 1, name: 'Martini', isAlcoholic: true }];
      service.findAll.mockResolvedValue(mockCocktails);

      const result = await controller.findAll({ isAlcoholic: true });

      expect(service.findAll).toHaveBeenCalledWith({ isAlcoholic: true });
      expect(result).toEqual(mockCocktails);
    });

    it('should filter by isAlcoholic=false', async () => {
      const mockCocktails = [
        { id: 2, name: 'Virgin Mojito', isAlcoholic: false },
      ];
      service.findAll.mockResolvedValue(mockCocktails);

      const result = await controller.findAll({ isAlcoholic: false });

      expect(service.findAll).toHaveBeenCalledWith({ isAlcoholic: false });
      expect(result).toEqual(mockCocktails);
    });

    it('should apply pagination with limit', async () => {
      const mockCocktails = [{ id: 1, name: 'Martini' }];
      service.findAll.mockResolvedValue(mockCocktails);

      const result = await controller.findAll({ limit: 10 });

      expect(service.findAll).toHaveBeenCalledWith({ limit: 10 });
      expect(result).toEqual(mockCocktails);
    });

    it('should apply pagination with limit and cursor', async () => {
      const mockCocktails = [{ id: 5, name: 'Daiquiri' }];
      service.findAll.mockResolvedValue(mockCocktails);

      const result = await controller.findAll({ limit: 10, cursor: 4 });

      expect(service.findAll).toHaveBeenCalledWith({ limit: 10, cursor: 4 });
      expect(result).toEqual(mockCocktails);
    });
  });

  describe('GET /cocktails/:id - findOne', () => {
    it('should return a single cocktail by id', async () => {
      const mockCocktail = { id: 1, name: 'Martini', isAlcoholic: true };
      service.findOne.mockResolvedValue(mockCocktail);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCocktail);
    });

    it('should handle different cocktail ids', async () => {
      const mockCocktail = { id: 99, name: 'Old Fashioned', isAlcoholic: true };
      service.findOne.mockResolvedValue(mockCocktail);

      const result = await controller.findOne(99);

      expect(service.findOne).toHaveBeenCalledWith(99);
      expect(result).toEqual(mockCocktail);
    });
  });

  describe('PATCH /cocktails/:id - update', () => {
    it('should update a cocktail', async () => {
      const updateDto = { name: 'Updated Martini' };
      const mockCocktail = {
        id: 1,
        name: 'Updated Martini',
        isAlcoholic: true,
      };
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
      const mockCocktail = { id: 2, ...updateDto };
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
