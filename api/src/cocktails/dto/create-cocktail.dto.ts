import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CocktailIngredientDto {
  @IsNotEmpty()
  @IsNumber()
  ingredientId!: number;

  @IsNotEmpty()
  @IsString()
  amount!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;
}

export class CreateCocktailDto {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  category!: string;

  @IsOptional()
  @IsNotEmpty()
  instructions!: string;

  @ValidateNested({ each: true })
  @Type(() => CocktailIngredientDto)
  ingredients!: CocktailIngredientDto[];
}
