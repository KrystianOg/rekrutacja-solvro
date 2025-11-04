import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from './pagination.dto';
import { validate } from 'class-validator';

describe('PaginationDto', () => {
  describe('limit', () => {
    it('should use default limit value when not provided', async () => {
      const plain = {};

      const dto = plainToInstance(PaginationDto, plain);

      expect(dto.limit).toBe(25);

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should accept valid limit values', async () => {
      const validLimits = [
        PaginationDto.MIN_LIMIT,
        10,
        PaginationDto.DEFAULT_LIMIT,
        50,
        PaginationDto.MAX_LIMIT,
      ];

      for (const limit of validLimits) {
        const plain = { limit };

        const dto = plainToInstance(PaginationDto, plain);

        expect(dto.limit).toBe(limit);

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });

    it('should reject invalid limit values', async () => {
      const invalidLimits = [0, 1, 4, 101, 'abc', 150, -10];

      for (const limit of invalidLimits) {
        const plain = { limit };

        const dto = plainToInstance(PaginationDto, plain);

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('limit');
      }
    });
  });
});
