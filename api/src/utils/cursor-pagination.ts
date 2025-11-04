import { Cursor } from '@mikro-orm/core';

export interface CursorResponse<T> {
  items: T[];
  totalCount: number | undefined;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export function serializeCursor<T extends object>(
  cursor: Cursor<T>,
): CursorResponse<T> {
  return {
    items: cursor.items,
    totalCount: cursor.totalCount,
    hasPrevPage: cursor.hasPrevPage,
    hasNextPage: cursor.hasNextPage,
    startCursor: cursor.startCursor,
    endCursor: cursor.endCursor,
  };
}
