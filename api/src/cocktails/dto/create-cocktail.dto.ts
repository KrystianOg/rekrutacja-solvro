class CocktailIngredientDto {
  ingredientId!: number;
  amount!: string;
  unit?: string;
  orderIndex?: number;
}

export class CreateCocktailDto {
  name!: string;
  category!: string;
  instructions!: string;
  ingredients!: CocktailIngredientDto[];
}
