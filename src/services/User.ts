/* eslint-disable class-methods-use-this */
import User, { UserFields } from '../models/User';
import IsUser, { IsUserFields } from '../validators/User';

export default class UserServices extends IsUser {
  protected User: typeof User;

  constructor(model = User, property = 'user') {
    super(property);
    this.User = model;
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.listUsers = this.listUsers.bind(this);
    this.readUserModel = this.readUserModel.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.signup = this.signup.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUserById = this.updateUserById.bind(this);
    this.deleteUserById = this.deleteUserById.bind(this);
  }

  readUserModel() {
    return this.User;
  }

  async signup(arg: UserFields) {
    const data = await (await this.User.create(arg, { returning: ['id'] })).toJSON();
    delete data.password;
    return { message: 'User successfully signed up', data };
  }

  async createUser(arg: UserFields, user: UserFields) {
    await this.isAdmin(user);
    const data = await (await this.User.create(arg)).toJSON();
    delete data.password;
    return { message: 'User successfully created', data };
  }

  async login({ email, password }: any & IsUserFields):
    Promise<{ message: string, data: UserFields | undefined }> {
    await this.isLogin({ email, password });
    const user = await this.User.findOne({
      where: { email },
    });
    await this.isFound(user);
    await user?.validatePassword(password);
    const data = await user?.toJSON();
    delete data?.password;
    return { message: 'Registered user successfully signed in', data };
  }

  async auth(id: string): Promise<UserFields | undefined> {
    await this.isUUID(id, false);
    const user = await this.User.findByPk(id, { attributes: { exclude: ['password'] } });
    await this.isFound(user);
    return user?.toJSON();
  }

  async listUsers(user: UserFields): Promise<{ message: string, data: Array<unknown> }> {
    await this.isAdmin(user);
    const data = await this.User.findAll({ attributes: { exclude: ['password', 'name', 'createdAt', 'updatedAt'] } });
    return { message: 'Users successfully retrieved', data };
  }

  async getUserById(id: string, user: UserFields) {
    await this.isAdmin(user);
    await this.isUUID(id);
    const existingUser = await this.User.findByPk(id, { attributes: { exclude: ['password'] } });
    await this.isFound(existingUser);
    const data = await existingUser?.toJSON();
    return { message: 'User successfully retrieved', data };
  }

  async updateUserById(id: string, user: UserFields, arg: UserFields) {
    await this.isUUID(id);
    await this.isAdmin(user);
    const userFound = await this.User.findByPk(id);
    await this.isFound(userFound);
    await userFound?.update(arg);
    const data = await userFound?.toJSON();
    return { message: 'User successfully updated', data };
  }

  async deleteUserById(id: string, user: UserFields) {
    await this.isUUID(id);
    await this.isAdmin(user);
    const userFound = await this.User.findByPk(id);
    await this.isFound(userFound);
    await userFound?.destroy();
    return { message: 'User successfully deleted' };
  }
}
