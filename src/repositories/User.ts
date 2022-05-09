/* eslint-disable class-methods-use-this */
import AppDataSrc from '../db';
import UserEntity from '../entities/User';
import LoginValidator, { LoginParams } from '../validators/User.login';
import IdValidator from '../validators/Id';

const UserRepository = AppDataSrc.getRepository(UserEntity).extend({
  // methods not using entity fields come here
  async validateLogin({ email, password }: LoginParams): Promise<void> {
    const newLogin = new LoginValidator();
    newLogin.email = email;
    newLogin.password = password;
    return newLogin
      .validate({ validationError: { target: false }, forbidUnknownValues: true });
  },
  async validateUserId(id: string): Promise<void> {
    const user = new IdValidator();
    user.id = id;
    return user
      .validate({ validationError: { target: false }, forbidUnknownValues: true });
  },
});

export default UserRepository;

export { LoginParams, UserEntity };
