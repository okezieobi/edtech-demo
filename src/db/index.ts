/* eslint-disable no-console */
import { DataSource } from 'typeorm';

import Env from '../utils/Env';
import UserEntity from '../entities/User';
import AssessmentEntity from '../entities/Assessment';
// sudo -u postgres createdb edtech-api-demo

const AppDataSrc = new DataSource({
  type: 'postgres',
  url: new Env().databaseURL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  synchronize: true,
  dropSchema: process.env.NODE_ENV !== 'production',
  entities: [UserEntity, AssessmentEntity],
});

AppDataSrc.initialize().catch(console.error);

export default AppDataSrc;

export { UserEntity, AssessmentEntity };
