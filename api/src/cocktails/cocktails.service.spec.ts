import { Test, TestingModule } from '@nestjs/testing';
import { CocktailsService } from './cocktails.service';
import { EntityManager } from '@mikro-orm/sqlite';
import { Cocktail } from './entities/cocktail.entity';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@mikro-orm/nestjs';

import { mockConfigService } from 'test/mocks/nestjs';
import { mockEntityManager, mockRepository } from 'test/mocks/mikro-orm';
import {
  mockCreateCocktailDtoWithIngredients,
  mockCreateCocktailDtoWithoutIngredients,
  mockIngredientRef,
} from 'test/mocks/utils/cocktail.fixtures';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';

describe('CocktailsService', () => {
  let service: CocktailsService;
  let repository: typeof mockRepository;
  let em: typeof mockEntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CocktailsService,
        {
          provide: getRepositoryToken(Cocktail),
          useValue: mockRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<CocktailsService>(CocktailsService);
    repository = module.get(getRepositoryToken(Cocktail));
    em = module.get(EntityManager);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).orm = { em: mockEntityManager };
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a cocktail with ingredients', async () => {
      const mockCocktail = {
        id: 1,
        ...mockCreateCocktailDtoWithIngredients,
        cocktailIngredients: {
          add: jest.fn(),
        },
      };
      em.find.mockResolvedValue([{ id: 101 } as unknown as Ingredient]);
      repository.create.mockReturnValue(mockCocktail);
      em.getReference.mockReturnValue(mockIngredientRef);

      const result = await service.create(mockCreateCocktailDtoWithIngredients);

      expect(repository.create).toHaveBeenCalledWith(
        mockCreateCocktailDtoWithIngredients,
      );
      // expect(mockCocktail.cocktailIngredients.add).toHaveBeenCalledWith(
      //   expect.anything(),
      //   { id: { $in: [101] } },
      // );
      expect(em.getReference).toHaveBeenCalledWith(expect.anything(), 101);
      expect(em.persistAndFlush).toHaveBeenCalledWith(mockCocktail);
      expect(result).toEqual(mockCocktail);
    });

    it('should throw an error without ingredients', async () => {
      const mockCocktail = {
        id: 2,
        ...mockCreateCocktailDtoWithoutIngredients,
      };
      repository.create.mockReturnValue(mockCocktail);

      await expect(
        service.create(mockCreateCocktailDtoWithoutIngredients),
      ).rejects.toThrow('One or more ingredients do not exist');

      // expect(create).toThrow('One or more ingredients do not exist');
    });
  });

  describe('findAll', () => {
    it('should return all cocktails without filters', async () => {
      const mockCocktails = [
        { id: 1, name: 'Mojito' },
        { id: 2, name: 'Daiquiri' },
      ];
      repository.findByCursor.mockResolvedValue({
        items: mockCocktails,
      });

      const result = await service.findAll();

      expect(repository.findByCursor).toHaveBeenCalledWith(
        {
          cocktailIngredients: {
            ingredient: {
              isAlcoholic: undefined,
            },
          },
          category: undefined,
        },
        {
          first: undefined,
          after: undefined,
          orderBy: { id: 'desc' },
        },
      );
      expect(result.items).toEqual(mockCocktails);
    });

    it('should filter by isAlcoholic', async () => {
      const mockCocktails = [{ id: 1, name: 'Mojito', isAlcoholic: true }];
      repository.findByCursor.mockResolvedValue({
        items: mockCocktails,
      });

      const result = await service.findAll({ isAlcoholic: true });

      expect(result.items).toEqual(mockCocktails);
    });

    it('should apply pagination with limit and cursor', async () => {
      const mockCocktails = [{ id: 5, name: 'Martini' }];
      repository.findByCursor.mockResolvedValue({
        items: mockCocktails,
      });

      const result = await service.findAll({ limit: 10, cursor: 'abc123' });

      expect(repository.findByCursor).toHaveBeenCalledWith(
        {
          cocktailIngredients: {
            ingredient: {
              isAlcoholic: undefined,
            },
          },
          category: undefined,
        },
        {
          first: 10,
          after: 'abc123',
          orderBy: { id: 'desc' },
        },
      );
      expect(result.items).toEqual(mockCocktails);
    });
  });

  describe('findOne', () => {
    it('should return a cocktail by id', async () => {
      const mockCocktail = { id: 1, name: 'Mojito' };
      repository.findOneOrFail.mockResolvedValue(mockCocktail);

      const result = await service.findOne(1);

      expect(repository.findOneOrFail).toHaveBeenCalledWith(
        { id: 1 },
        undefined,
      );
      expect(result).toEqual(mockCocktail);
    });
  });

  describe('update', () => {
    it('should update a cocktail', async () => {
      const mockCocktail = { id: 1, name: 'Mojito' };
      const updateDto = { name: 'Updated Mojito' };
      repository.findOneOrFail.mockResolvedValue(mockCocktail);

      const result = await service.update(1, updateDto);

      expect(repository.findOneOrFail).toHaveBeenCalledWith(
        { id: 1 },
        undefined,
      );
      expect(repository.assign).toHaveBeenCalledWith(mockCocktail, updateDto);
      expect(em.flush).toHaveBeenCalled();
      expect(result).toEqual(mockCocktail);
    });
  });

  describe('remove', () => {
    it('should remove a cocktail', async () => {
      const mockCocktail = { id: 1, name: 'Mojito' };
      repository.findOneOrFail.mockResolvedValue(mockCocktail);

      await service.remove(1);

      expect(repository.findOneOrFail).toHaveBeenCalledWith(
        { id: 1 },
        { populate: ['cocktailIngredients'] },
      );
      expect(em.removeAndFlush).toHaveBeenCalledWith(mockCocktail);
    });
  });
});
