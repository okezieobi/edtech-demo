// /* eslint-disable no-console */
// import { DataSource, DataSourceOptions } from 'typeorm';
// import { runSeeders, SeederOptions } from 'typeorm-extension';

// import Env from '../utils/Env';
// // sudo -u postgres createdb edtech-api-demo

// const dataSrcOpts : DataSourceOptions & SeederOptions = {
//   type: 'postgres',
//   url: new Env().databaseURL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
//   synchronize: true,
//   dropSchema: process.env.NODE_ENV !== 'production',
//   entities: ['src/entities/*.ts'],
//   seeds: process.env.NODE_ENV !== 'production' ? ['./seeders/*.ts'] : undefined,
// };

// const AppDataSrc = new DataSource(dataSrcOpts);

// if (process.env.NODE_ENV === 'development') {
//   (async () => {
//     await AppDataSrc.initialize().catch(console.error);
//     await runSeeders(AppDataSrc).catch(console.error);
//   })();
// }

// if (process.env.NODE_ENV === 'production') {
//   (async () => {
//     await AppDataSrc.initialize().catch(console.error);
//   })();
// }

// export default AppDataSrc;

// export { runSeeders };
