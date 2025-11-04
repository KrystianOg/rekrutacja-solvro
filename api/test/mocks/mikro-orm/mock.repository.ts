import { mockQueryBuilder } from './mock.query-builder';

export const mockRepository = {
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  assign: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  findByCursor: jest.fn(),
};
