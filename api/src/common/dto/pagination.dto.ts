import { IsOptional, IsInt, Max, Min, IsString } from 'class-validator';

const MAX_LIMIT = 100;

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number;

  @IsOptional()
  @IsString()
  cursor?: string;
}
