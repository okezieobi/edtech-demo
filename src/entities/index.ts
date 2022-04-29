import { createConnection, getConnection, ConnectionOptions } from 'typeorm';

import Env from '../utils/Env';
import UserEntity from './User';
// sudo -u postgres createdb edtech-api-demo

const connection = async () => {
  let initializedConnection;
  const options: ConnectionOptions = {
    type: 'postgres',
    url: new Env().databaseURL,
    ssl: process.env.NODE_ENV === 'testing-in-ci' ? false : { rejectUnauthorized: false },
    synchronize: true,
    dropSchema: process.env.NODE_ENV === 'development',
    entities: [UserEntity],
  };
  try {
    initializedConnection = getConnection();
  } catch (e) {
    initializedConnection = await createConnection(options);
  }
  return initializedConnection;
};

const userRepository = async () => {
  const resolvedConnection = await connection();
  return resolvedConnection.getRepository(UserEntity);
};

export default connection;

export { userRepository };
