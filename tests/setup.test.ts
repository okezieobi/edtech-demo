/* eslint-disable no-console */
import AppDataSrc, { runSeeders } from '../src/db';

beforeAll(async () => {
  await AppDataSrc.initialize().catch(console.error);
  await runSeeders(AppDataSrc).catch(console.error);
});

afterAll(async () => {
  if (AppDataSrc.isInitialized) await AppDataSrc.destroy();
});
