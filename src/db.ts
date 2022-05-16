import { Sequelize } from 'sequelize-typescript';

import Env from './utils/Env';

const sequelize = new Sequelize({
  dialect: 'postgres',
  models: [`${__dirname}./models`],
  storage: new Env().databaseURL,
  sync: { force: true },
});

(async () => {
  // eslint-disable-next-line no-console
  await sequelize.authenticate().catch(console.error);
})();
