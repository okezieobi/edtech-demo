/* eslint-disable class-methods-use-this */
import AppDataSrc, { UserEntity } from '../db';
import LoginValidator, { LoginParams } from '../validators/User.login';
import IdValidator from '../validators/Id';

const UserRepository = AppDataSrc.getRepository(UserEntity).extend({
  // methods not using entity fields come here
  async validateLogin({ email, password }: LoginParams) {
    const newLogin = new LoginValidator();
    newLogin.email = email;
    newLogin.password = password;
    return newLogin
      .validate({ validationError: { target: false }, forbidUnknownValues: true });
  },
  async validateUserId(id: string) {
    const newUserId = new IdValidator();
    newUserId.id = id;
    return newUserId
      .validate({ validationError: { target: false }, forbidUnknownValues: true });
  },
});

export default UserRepository;

export { LoginParams };
