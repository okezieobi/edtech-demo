import AppDataSrc from '../src/db';

afterAll(async () => {
  if (AppDataSrc.isInitialized) await AppDataSrc.destroy();
});
