export const appConfig = () => ({
  pagination: {
    DefaultLimit: parseInt(process.env.DEFAULT_LIMIT || '20', 10),
    MaxLimit: parseInt(process.env.MAX_LIMIT || '100', 10),
  },
});

export type AppConfig = ReturnType<typeof appConfig>;
