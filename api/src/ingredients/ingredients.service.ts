import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/sqlite';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: EntityRepository<Ingredient>,
    private readonly em: EntityManager,
  ) {}

  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    const ingredient = this.ingredientRepository.create(createIngredientDto);

    await this.em.persistAndFlush(ingredient);

    return ingredient;
  }

  async findAll(): Promise<Ingredient[]> {
    return this.ingredientRepository.findAll();
  }

  private async getIngredient(id: number): Promise<Ingredient> {
    return this.ingredientRepository.findOneOrFail({
      id,
    });
  }

  async findOne(id: number): Promise<Ingredient> {
    return this.getIngredient(id);
  }

  async update(
    id: number,
    updateIngredientDto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    const ingredient = await this.getIngredient(id);

    this.ingredientRepository.assign(ingredient, updateIngredientDto);

    await this.em.flush();

    return ingredient;
  }

  async remove(id: number): Promise<void> {
    const ingredient = await this.getIngredient(id);

    await this.em.removeAndFlush(ingredient);
  }
}
