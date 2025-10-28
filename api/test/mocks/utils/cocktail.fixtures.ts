export const mockIngredientDto = {
  ingredientId: 101,
  amount: '60',
  unit: 'ml',
  orderIndex: 0,
};

export const mockCreateCocktailDtoWithIngredients = {
  name: 'Mojito Test',
  category: 'Classic',
  instructions: 'Muddle and shake',
  isAlcoholic: true,
  ingredients: [mockIngredientDto],
};

export const mockCreateCocktailDtoWithoutIngredients = {
  name: 'Virgin Mojito',
  category: 'Non-Alcoholic',
  instructions: 'Just water',
  isAlcoholic: false,
  ingredients: [],
};

export const mockIngredientRef = { id: mockIngredientDto.ingredientId };
