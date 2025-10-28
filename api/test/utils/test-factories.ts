import { faker } from '@faker-js/faker';
import { MikroORM } from '@mikro-orm/core';
import { AbstractSqlDriver, SqliteDriver } from '@mikro-orm/sqlite';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { CreateIngredientDto } from 'src/ingredients/dto/create-ingredient.dto';
import { Cocktail } from 'src/cocktails/entities/cocktail.entity';
import { CreateCocktailDto } from 'src/cocktails/dto/create-cocktail.dto';

export function generateIngredientData(
  overrides: Partial<CreateIngredientDto> = {},
): CreateIngredientDto {
  return {
    name: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    imageUrl: faker.image.url({ width: 64, height: 64 }),
    isAlcoholic: faker.datatype.boolean(),
    ...overrides,
  };
}

export function generateCocktailData(
  overrides: Partial<CreateCocktailDto> = {},
): CreateCocktailDto {
  return {
    name: faker.lorem.words(2),
    category: faker.lorem.word(),
    instructions: faker.lorem.sentences(2),
    ingredients: [],
    ...overrides,
  };
}

/**
 * Creates and persists a single Ingredient entity in the database.
 * @param orm The MikroORM instance.
 * @param data Optional partial data to override defaults.
 * @returns The created and persisted Ingredient entity.
 */
export async function createAndPersistIngredient<
  Driver extends AbstractSqlDriver = SqliteDriver,
>(
  orm: MikroORM<Driver>,
  data: Partial<CreateIngredientDto> = {},
): Promise<Ingredient> {
  const em = orm.em.fork();
  const ingredientData = generateIngredientData(data);
  const ingredient = em.create(Ingredient, ingredientData);

  await em.persistAndFlush(ingredient);
  return ingredient;
}

/**
 * Creates and persists a single Cocktail entity in the database.
 * @param orm The MikroORM instance.
 * @param data Optional partial data to override defaults.
 * @returns The created and persisted Cocktail entity.
 */
export async function createAndPersistCocktail<
  Driver extends AbstractSqlDriver = SqliteDriver,
>(
  orm: MikroORM<Driver>,
  data: Partial<CreateCocktailDto> = {},
): Promise<Cocktail> {
  const em = orm.em.fork();
  const cocktailData = generateCocktailData(data);
  const cocktail = em.create(Cocktail, cocktailData);

  await em.persistAndFlush(cocktail);
  return cocktail;
}

createAndPersistCocktail.bulk = function () {
  const cocktails: Cocktail[] = [];
  return cocktails;
};
