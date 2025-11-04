import { faker } from '@faker-js/faker';
import { MikroORM } from '@mikro-orm/core';
import { AbstractSqlDriver, SqliteDriver } from '@mikro-orm/sqlite';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { CreateIngredientDto } from 'src/ingredients/dto/create-ingredient.dto';
import { Cocktail } from 'src/cocktails/entities/cocktail.entity';
import { CreateCocktailDto } from 'src/cocktails/dto/create-cocktail.dto';
import { applyBaseFactoryFields, createFactory } from './factory-builder';

const INGREDIENT_NAMES = [
  'Vodka',
  'Gin',
  'Rum',
  'Tequila',
  'Triple Sec',
  'Lime Juice',
  'Lemon Juice',
  'Simple Syrup',
  'Cola',
  'Tonic Water',
  'Orange Juice',
  'Cranberry Juice',
  'Pineapple Juice',
  'Mint Leaves',
  'Sugar',
  'Salt',
  'Bitters',
];

const COCKTAIL_NAMES = [
  'Mojito',
  'Martini',
  'Margarita',
  'Old Fashioned',
  'Cosmopolitan',
  'Daiquiri',
  'Manhattan',
  'Whiskey Sour',
  'Pina Colada',
  'Bloody Mary',
  'Awesom',
];

const COCKTAIL_CATEGORIES = [
  'Classic',
  'Tropical',
  'Sour',
  'Sweet',
  'Bitter',
  'Fruity',
  'Herbal',
];

export const generateIngredientData = createFactory<Ingredient>(
  (overrides = {}) => {
    const ingredient = new Ingredient();
    applyBaseFactoryFields(ingredient);
    ingredient.name = faker.helpers.arrayElement(INGREDIENT_NAMES);
    ingredient.description = faker.lorem.sentence();
    ingredient.imageUrl = faker.image.url({ width: 64, height: 64 });
    ingredient.isAlcoholic = faker.datatype.boolean();
    return Object.assign(ingredient, overrides);
  },
);

export const generateCocktailData = createFactory<Cocktail>(
  (overrides = {}) => {
    const cocktail = new Cocktail();
    applyBaseFactoryFields(cocktail);
    cocktail.name = faker.helpers.arrayElement(COCKTAIL_NAMES);
    cocktail.category = faker.helpers.arrayElement(COCKTAIL_CATEGORIES);
    cocktail.instructions = faker.lorem.sentences(2);
    return Object.assign(cocktail, overrides);
  },
);

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
