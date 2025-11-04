import { IsOptional, IsInt, Max, Min, IsString } from 'class-validator';

export class PaginationDto {
  static readonly MIN_LIMIT = 5;
  static readonly DEFAULT_LIMIT = 25;
  static readonly MAX_LIMIT = 100;

  @IsOptional()
  @IsInt()
  @Min(PaginationDto.MIN_LIMIT)
  @Max(PaginationDto.MAX_LIMIT)
  limit?: number = PaginationDto.DEFAULT_LIMIT;

  @IsOptional()
  @IsString()
  cursor?: string;
}
