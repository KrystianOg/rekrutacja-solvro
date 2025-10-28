import { IsBoolean, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isAlcoholic: boolean;

  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;
}
