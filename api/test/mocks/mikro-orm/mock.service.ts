export function createMockService<T>(
  service: new (...args: any[]) => T,
): jest.Mocked<T> {
  const mock = {} as jest.Mocked<T>;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const prototype = service.prototype;

  Object.getOwnPropertyNames(prototype)
    .filter((name) => name !== 'constructor')
    .forEach((name) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      mock[name as keyof T] = jest.fn() as any;
    });

  return mock;
}
