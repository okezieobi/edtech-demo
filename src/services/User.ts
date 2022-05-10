/* eslint-disable class-methods-use-this */
import Services from '.';
import UserEntity from '../entities/User';
import LoginValidator, { LoginParams } from '../validators/User.login';
import AppError from '../errors';

export default class User extends Services {
  constructor(entityClass = UserEntity) {
    super(entityClass);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.listAll = this.listAll.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  async signup(arg: UserEntity): Promise<{ message: string, data: UserEntity }> {
    const input = this.dataSrc.manager.create(this.entityClass, arg);
    const newUser = await this.dataSrc.manager.save(input);
    delete newUser.password;
    return { message: 'New user successfully signed up', data: newUser };
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
    if (userExists == null) throw new AppError(`${this.constructor.name} not found`, 'NotFound', { param: 'email', value: email });
    await userExists.validatePassword(password);
    delete userExists.password;
    return { message: 'Registered user successfully signed in', data: userExists };
  }

  async auth(id: string): Promise<UserEntity> {
    return this.fetchOne({ where: { id } }, true);
  }

  async listAll(): Promise<{ message: string, data: Array<unknown> }> {
    const data = await this.dataSrc.manager.find(this.entityClass);
    return { message: 'Users successfully retrieved', data };
  }

  async updateUser(arg: object, entity: UserEntity)
    : Promise<{ message: string, data: UserEntity }> {
    const result = await super.updateOne(arg, entity);
    delete result.data.password;
    return result;
  }
}
