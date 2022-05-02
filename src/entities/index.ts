import { createConnection, getConnection, ConnectionOptions } from 'typeorm';

import Env from '../utils/Env';
import UserEntity from './User';
// sudo -u postgres createdb edtech-api-demo

const connection = async () => {
  let initializedConnection;
  const options: ConnectionOptions = {
    type: 'postgres',
    url: new Env().databaseURL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    synchronize: true,
    dropSchema: process.env.NODE_ENV !== 'production',
    entities: [UserEntity],
  };
  try {
    initializedConnection = getConnection();
  } catch (e) {
    initializedConnection = await createConnection(options);
  }
  return initializedConnection;
};

export default connection;

export { UserEntity };
