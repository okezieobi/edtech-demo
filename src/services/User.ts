/* eslint-disable class-methods-use-this */
import Services from '.';
import User, { UserFields } from '../models/User';
import IsUser, { IsUserFields } from '../validators/User';

export default class UserServices extends Services {
  protected User: typeof User;

  constructor(model = User) {
    super();
    this.User = model;
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.listUsers = this.listUsers.bind(this);
    this.readUserModel = this.readUserModel.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
    this.isRestricted = this.isRestricted.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.signup = this.signup.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUserById = this.updateUserById.bind(this);
    this.deleteUserById = this.deleteUserById.bind(this);
  }

  readUserModel() {
    return this.User;
  }

  async isAdmin(user: UserFields) {
    const isUser = new IsUser();
    isUser.admin = user.role;
    return isUser.validate({ groups: ['admin'], validationError: { target: false } });
  }

  async isRestricted(user: UserFields) {
    const isUser = new IsUser();
    isUser.restricted = user.role;
    return isUser.validate({ groups: ['restricted'], validationError: { target: false } });
  }

  async signup(arg: UserFields) {
    const data = await this.User.create(arg);
    delete data.password;
    return { message: 'User successfully signed up', data };
  }

  async createUser(arg: UserFields, user: UserFields) {
    await this.isAdmin(user);
    const data = new this.User(arg);
    await data.save();
    delete data.password;
    return { message: 'User successfully created', data };
  }

  async login({ email, password }: IsUserFields): Promise<{ message: string, data: User | null }> {
    const userParams = new IsUser();
    userParams.email = email;
    userParams.password = password;
    await userParams.validate({ validationError: { target: true }, groups: ['login'] });
    const data = await this.User.findOne({
      where: { email },
    });
    await this.validateFound(data);
    await data!.validatePassword(password);
    delete data!.password;
    return { message: 'Registered user successfully signed in', data };
  }

  async auth(id: string): Promise<User | null> {
    await this.validateId(id, false);
    const user = await this.User.findByPk(id, { attributes: { exclude: ['password'] } });
    const isUser = new IsUser();
    isUser.$exists = user;
    await isUser.validate({ validationError: { target: false }, groups: ['userNotFound'] });
    return user;
  }

  async listUsers(user: UserFields): Promise<{ message: string, data: Array<unknown> }> {
    await this.isAdmin(user);
    const data = await this.User.findAll({ attributes: { exclude: ['password', 'name', 'createdAt', 'updatedAt'] } });
    return { message: 'Users successfully retrieved', data };
  }

  async getUserById(id: string, user: UserFields) {
    await this.isAdmin(user);
    await this.validateId(id);
    const existingUser = await this.User.findByPk(id, { attributes: { exclude: ['password'] } });
    await this.validateFound(existingUser);
    return { message: 'User successfully retrieved', data: existingUser };
  }

  async updateUserById(id: string, user: UserFields, arg: UserFields) {
    await this.validateId(id);
    await this.isAdmin(user);
    const userFound = await this.User.findByPk(id);
    await this.validateFound(userFound);
    const data = await this.User.update(arg, { where: { id } });
    return { message: 'User successfully updated', data };
  }

  async deleteUserById(id: string, user: UserFields) {
    await this.validateId(id);
    await this.isAdmin(user);
    const userFound = await this.User.findByPk(id);
    await this.validateFound(userFound);
    await this.User.destroy({ where: { id } });
    return { message: 'User successfully deleted' };
  }
}
