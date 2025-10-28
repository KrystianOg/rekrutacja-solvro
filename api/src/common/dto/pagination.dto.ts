import { IsOptional, IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

const MAX_LIMIT = 100;

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cursor?: number;
}
