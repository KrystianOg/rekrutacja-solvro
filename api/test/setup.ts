// Mock the Transactional decorator
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@mikro-orm/core', () => ({
  ...jest.requireActual('@mikro-orm/core'),
  Transactional:
    () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));
