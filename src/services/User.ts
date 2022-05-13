/* eslint-disable class-methods-use-this */
import Services from '.';
import UserEntity, { UserFields } from '../entities/User';
import LoginValidator, { LoginFields } from '../validators/User.login';
import AppError from '../errors';

export default class User extends Services {
  private UserEntity: typeof UserEntity;

  constructor(entityClass = UserEntity) {
    super();
    this.UserEntity = entityClass;
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.listUsers = this.listUsers.bind(this);
    this.readUserEntity = this.readUserEntity.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.isRestricted = this.isRestricted.bind(this);
    this.getUserById = this.getUserById.bind(this);
  }

  readUserEntity() {
    return this.UserEntity;
  }

  async isAdmin(user: UserFields) {
    if (user.role !== 'admin') throw new AppError('Only admins can read or write this data', 'forbidden');
  }

  async isRestricted(user: UserFields) {
    if (user.role === 'student') throw new AppError('Only mentors or admins can read or write this data', 'forbidden');
  }

  async signup(arg: UserFields) {
    const signedUpUser = await this.createOne(this.UserEntity, arg);
    delete signedUpUser.password;
    return { message: 'User successfully signedup', data: signedUpUser };
  }

  async createUser(arg: UserFields, user: UserFields) {
    await this.isAdmin(user);
    const createdUser = await this.createOne(this.UserEntity, arg);
    delete createdUser.password;
    return { message: 'User successfully created', data: createdUser };
  }

  async login({ email, password }: LoginFields): Promise<{ message: string, data: UserEntity }> {
    const userParams = new LoginValidator();
    userParams.email = email;
    userParams.password = password;
    await userParams.validate({ validationError: { target: false }, forbidUnknownValues: true });
    const repo = this.dataSrc.getRepository(this.UserEntity);
    const userExists = await repo.findOne({
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
    const user = await this.dataSrc.manager.findOneBy(this.UserEntity, { id });
    if (user == null) throw new AppError('User not found', 'NotFound');
    return user;
  }

  async listUsers(user: UserFields): Promise<{ message: string, data: Array<unknown> }> {
    await this.isAdmin(user);
    const data = await this.dataSrc.manager.find(
      this.UserEntity,
      { select: { id: true, name: true, email: true } },
    );
    return { message: 'Users successfully retrieved', data };
  }

  async getUserById(id: string, user: UserFields) {
    await this.isAdmin(user);
    await this.validateId(id);
    const existingUser = await this.fetchOne(this.UserEntity, { where: { id } });
    return { message: 'User successfully retrieved', data: existingUser };
  }
}
