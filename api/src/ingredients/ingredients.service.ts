import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';

// TODO: Replace with real database integration
const ingredients: Map<number, Ingredient> = new Map();

@Injectable()
export class IngredientsService {
  create(createIngredientDto: CreateIngredientDto): Ingredient {
    const ingredient: Ingredient = {
      id: ingredients.size + 1,
      ...createIngredientDto,
    };
    ingredients.set(ingredient.id, ingredient);
    return ingredient;
  }

  findAll(): Ingredient[] {
    return Array.from(ingredients.values());
  }

  findOne(id: number): Ingredient | undefined {
    return ingredients.get(id);
  }

  update(
    id: number,
    updateIngredientDto: UpdateIngredientDto,
  ): Ingredient | undefined {
    const ingredient = ingredients.get(id);
    if (ingredient) {
      const updatedIngredient = { ...ingredient, ...updateIngredientDto };
      ingredients.set(id, updatedIngredient);
      return updatedIngredient;
    }
    return undefined;
  }

  remove(id: number): boolean {
    return ingredients.delete(id);
  }
}
