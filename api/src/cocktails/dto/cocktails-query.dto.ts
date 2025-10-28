import { IsOptional, IsString, IsBoolean, IsIn, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class CocktailsQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isAlcoholic?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  ingredients?: number;

  @IsOptional()
  @IsString()
  @IsIn(['name', 'category', 'createdAt', '-name', '-category', '-createdAt'])
  sort?: string;
}
