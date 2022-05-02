/* eslint-disable class-methods-use-this */
import { EntityRepository, Repository } from 'typeorm';

import connection, { UserEntity } from '../entities';
import LoginValidator, { LoginParams } from '../validators/User.login';
import IdValidator from '../validators/Id';

@EntityRepository(UserEntity)
class UserRepository extends Repository<UserEntity> {
  // methods not using entity fields come here
  async validateLogin({ email, password }: LoginParams) {
    return new LoginValidator(email, password)
      .validate({ validationError: { target: false }, forbidUnknownValues: true });
  }

  async validateUserId(id: string) {
    return new IdValidator(id)
      .validate({ validationError: { target: false }, forbidUnknownValues: true });
  }
}

export default async () => {
  const resolvedConnection = await await connection();
  return resolvedConnection.getCustomRepository(UserRepository);
};

export { LoginParams };
