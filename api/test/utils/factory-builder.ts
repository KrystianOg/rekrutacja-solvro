import { faker } from '@faker-js/faker';
import { CursorResponse } from 'src/utils/cursor-pagination';

type EntityGenerator<T> = (overrides?: Partial<T>) => T;

export interface FactoryFunction<T> extends EntityGenerator<T> {
  bulk: (count: number) => T[];
  cursor: (count: number) => CursorResponse<T>;
}

export function createFactory<T>(
  generator: EntityGenerator<T>,
): FactoryFunction<T> {
  const factory = generator as FactoryFunction<T>;

  factory.bulk = function (count: number): T[] {
    const items: T[] = [];
    for (let i = 0; i < count; i++) {
      items.push(generator());
    }
    return items;
  };

  factory.cursor = function (count: number): CursorResponse<T> {
    const items = factory.bulk(count);
    return createCursorResponse(items);
  };

  return factory;
}

export function applyBaseFactoryFields<
  T extends { id?: number; createdAt?: Date; updatedAt?: Date },
>(entity: T): T {
  entity.id = faker.number.int({ min: 1, max: 10000 });
  entity.createdAt = faker.date.past();
  entity.updatedAt = faker.date.recent();
  return entity;
}

/**
 * Creates a CursorResponse object with the provided items and overrides.
 * @param items The array of items for the cursor response.
 * @param overrides Partial properties to override in the CursorResponse.
 * @returns A CursorResponse object.
 */
function createCursorResponse<T>(
  items: T[],
  overrides?: Partial<CursorResponse<T>>,
): CursorResponse<T> {
  const response: CursorResponse<T> = {
    items,
    totalCount: items.length,
    hasPrevPage: false,
    hasNextPage: false,
    startCursor: items.length > 0 ? 'start-cursor' : null,
    endCursor: items.length > 0 ? 'end-cursor' : null,
  };

  Object.assign(response, overrides);
  return response;
}
