import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { Cocktail } from './entities/cocktail.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  FindOneOptions,
  Transactional,
} from '@mikro-orm/sqlite';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { CocktailIngredient } from './entities/cocktail-ingredient.entity';
import { CocktailsQueryDto } from './dto/cocktails-query.dto';
import { CursorResponse, serializeCursor } from 'src/utils/cursor-pagination';

@Injectable()
export class CocktailsService {
  constructor(
    @InjectRepository(Cocktail)
    private readonly cocktailRepository: EntityRepository<Cocktail>,
    private readonly em: EntityManager,
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

  async findAll(
    query: CocktailsQueryDto | undefined = {},
  ): Promise<CursorResponse<Cocktail>> {
    const results = await this.cocktailRepository.findByCursor(
      {
        cocktailIngredients: {
          ingredient: {
            isAlcoholic: query.isAlcoholic,
          },
        },
        category: query.category,
      },
      {
        first: query.limit,
        after: query.cursor,
        orderBy: { id: 'desc' },
      },
    );

    return serializeCursor(results);
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
