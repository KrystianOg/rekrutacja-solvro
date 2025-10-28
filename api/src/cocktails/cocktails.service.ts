import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { Cocktail } from './entities/cocktail.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  FindOneOptions,
  QueryBuilder,
  Transactional,
} from '@mikro-orm/sqlite';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { CocktailIngredient } from './entities/cocktail-ingredient.entity';
import { CocktailsQueryDto } from './dto/cocktails-query.dto';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';

@Injectable()
export class CocktailsService {
  constructor(
    @InjectRepository(Cocktail)
    private readonly cocktailRepository: EntityRepository<Cocktail>,
    private readonly em: EntityManager,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  @Transactional()
  async create(createCocktailDto: CreateCocktailDto): Promise<Cocktail> {
    const cocktail = this.cocktailRepository.create(createCocktailDto);

    const ingredientIds = createCocktailDto.ingredients.map(
      (ingredient) => ingredient.ingredientId,
    );

    const existingIngredients = await this.em.find(Ingredient, {
      id: { $in: ingredientIds },
    });

    if (existingIngredients?.length !== ingredientIds.length) {
      throw new BadRequestException('One or more ingredients do not exist');
    }

    const cocktailIngredients = createCocktailDto.ingredients.map(
      (cocktailIngredientDto) => {
        const ingredientRef = this.em.getReference(
          Ingredient,
          cocktailIngredientDto.ingredientId,
        );

        const cocktailIngredient = new CocktailIngredient(
          cocktail,
          ingredientRef,
          cocktailIngredientDto.amount,
        );

        cocktailIngredient.unit = cocktailIngredientDto.unit;
        cocktailIngredient.orderIndex = cocktailIngredientDto.orderIndex;

        return cocktailIngredient;
      },
    );

    cocktailIngredients.forEach((ci) => cocktail.cocktailIngredients.add(ci));
    await this.em.persistAndFlush(cocktail);

    return cocktail;
  }

  private paginate<Entity extends object>(
    qb: QueryBuilder<Entity>,
    limit?: number,
    cursor?: number,
  ) {
    const { DefaultLimit, MaxLimit } = this.configService.get('pagination', {
      infer: true,
    })!;

    // +1 to check if there's a next page
    const effectiveLimit = Math.min(limit || DefaultLimit, MaxLimit) + 1;
    qb.limit(effectiveLimit);

    if (cursor) {
      qb.andWhere({
        id: {
          $gt: cursor,
        },
      });
    }

    qb.orderBy({ id: 'ASC' });

    return qb;
  }

  async findAll(
    query: CocktailsQueryDto | undefined = {},
  ): Promise<Cocktail[]> {
    const qb = this.cocktailRepository.createQueryBuilder('cocktail');

    if (query.isAlcoholic !== undefined) {
      qb.where({
        isAlcoholic: query.isAlcoholic,
      });
    }

    this.paginate(qb, query.limit, query.cursor);

    const results = await qb.getResult();

    if (
      results.length >
      (query.limit ||
        this.configService.get('pagination', { infer: true })!.DefaultLimit)
    ) {
      // TODO: return info about next page
      results.pop();
    }

    return results;
  }

  private async getCocktail<Hint extends string = never>(
    id: number,
    options?: FindOneOptions<Cocktail, Hint>,
  ): Promise<Cocktail> {
    return this.cocktailRepository.findOneOrFail(
      {
        id,
      },
      options,
    );
  }

  async findOne(id: number): Promise<Cocktail> {
    return this.getCocktail(id);
  }

  async update(
    id: number,
    updateCocktailDto: UpdateCocktailDto,
  ): Promise<Cocktail> {
    const cocktail = await this.getCocktail(id);

    this.cocktailRepository.assign(cocktail, updateCocktailDto);

    await this.em.flush();

    return cocktail;
  }

  async remove(id: number): Promise<void> {
    const cocktail = await this.getCocktail(id, {
      populate: ['cocktailIngredients'],
    });
    await this.em.removeAndFlush(cocktail);
  }
}
