/* eslint-disable class-methods-use-this */
import UserRepository, { LoginParams } from '../repositories/User';

interface UserServicesParams {
  Repository: typeof UserRepository;
}

interface SignupParams extends LoginParams {
    name: string;
    role?: string;
}

// if (process.env.NODE_ENV === 'development') {
//   const testAdmin = {
//     name: 'Frank',
//     email: 'frank@okezie.com',
//     password: 'test',
//     role: 'admin',
//   };
//   UserRepository.insert(testAdmin);
// }

export default class UserServices implements UserServicesParams {
  Repository: typeof UserRepository;

  constructor(Repository = UserRepository) {
    this.Repository = Repository;
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  async signup(arg: SignupParams) {
    const input = this.Repository.create(arg);
    const newUser = await this.Repository.save(input);
    return { message: 'New user successfully signed up', data: { ...newUser, password: undefined } };
  }

  async login({ email, password }: LoginParams) {
    await this.Repository.validateLogin({ email, password });
    const userExists = await this.Repository.findOneOrFail({ where: { email } });
    await userExists.validatePassword(password);
    return { message: 'Registered user successfully signed in', data: { ...userExists, password: undefined } };
  }

  async auth(id: string) {
    await this.Repository.validateUserId(id);
    return this.Repository.findOneByOrFail({ id });
  }

  async listAll() {
    const data = await this.Repository.find();
    return { message: 'Users successfully retrieved', data };
  }

  async getOne(user: any) {
    return { message: 'User successfully retrieved', data: { ...user.data, password: undefined } };
  }

  async updateOne(arg: object, user: any) {
    this.Repository.merge(user, arg);
    const updatedUser = await this.Repository.save(user);
    return { message: 'User successfully updated', data: { ...updatedUser, password: undefined } };
  }

  async deleteOne(user: any) {
    await this.Repository.delete(user);
    return { message: 'User successfully deleted' };
  }
}
