import { EntityRepository, Repository } from 'typeorm';

import connection, { UserEntity } from '../entities';

@EntityRepository(UserEntity)
class UserRepository extends Repository<UserEntity> {
  // methods not using entity fields come here
}

export default async () => {
  const resolvedConnection = await await connection();
  return resolvedConnection.getCustomRepository(UserRepository);
};
