import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsService } from './ingredients.service';
import { ConfigService } from '@nestjs/config';

import { mockConfigService } from 'test/mocks/nestjs';
import { mockEntityManager, mockRepository } from 'test/mocks/mikro-orm';
import { getRepositoryToken } from '@mikro-orm/nestjs/mikro-orm.common';
import { EntityManager } from '@mikro-orm/sqlite';
import { Ingredient } from './entities/ingredient.entity';
import { generateIngredientData } from 'test/utils/test-factories';

describe('IngredientsService', () => {
  let service: IngredientsService;
  let repository: typeof mockRepository;
  let em: typeof mockEntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientsService,

        {
          provide: getRepositoryToken(Ingredient),
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

    service = module.get<IngredientsService>(IngredientsService);
    repository = module.get(getRepositoryToken(Ingredient));
    em = module.get(EntityManager);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).orm = { em: mockEntityManager };
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create ingredient', async () => {});

    it('should throw validation error', async () => {
      const mockIngredient = generateIngredientData();
      repository.create.mockReturnValue({
        id: 1,
        ...mockIngredient,
      });
    });
  });
});
