/* eslint-disable class-methods-use-this */
import Services from '.';
import UserEntity from '../entities/User';
import LoginValidator, { LoginParams } from '../validators/User.login';
import AppError from '../errors';

export default class User extends Services {
  constructor(entityClass = UserEntity) {
    super(entityClass);
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.listAll = this.listAll.bind(this);
  }

  async login({ email, password }: LoginParams): Promise<{ message: string, data: UserEntity }> {
    const userParams = new LoginValidator();
    userParams.email = email;
    userParams.password = password;
    await userParams.validate({ validationError: { target: false }, forbidUnknownValues: true });
    const repo = this.dataSrc.getRepository(this.entityClass);
    const userExists: any = await repo.findOne({
      where: { email },
      select: {
        id: true,
        password: true,
        name: true,
        role: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (userExists == null) throw new AppError('User not found', 'NotFound', { param: 'email', value: email });
    await userExists.validatePassword(password);
    delete userExists.password;
    return { message: 'Registered user successfully signed in', data: userExists };
  }

  async auth(id: string): Promise<UserEntity> {
    await this.validateId(id, false);
    const user = await this.dataSrc.manager.findOneBy(UserEntity, { id });
    if (user == null) throw new AppError('User not found', 'NotFound');
    return user;
  }

  async listAll(): Promise<{ message: string, data: Array<unknown> }> {
    const data = await this.dataSrc.manager.find(
      this.entityClass,
      { select: { id: true, name: true, email: true } },
    );
    return { message: 'Users successfully retrieved', data };
  }
}
