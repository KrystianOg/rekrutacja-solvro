export const mockConfigService = {
  get: jest.fn().mockReturnValue({
    DefaultLimit: 10,
    MaxLimit: 50,
  }),
};
