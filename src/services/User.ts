/* eslint-disable class-methods-use-this */
import UserRepository, { LoginParams, UserEntity } from '../repositories/User';

interface UserServicesParams {
  Repository: typeof UserRepository;
}

interface SignupParams extends LoginParams {
    name: string;
    role?: string;
}

export default class UserServices implements UserServicesParams {
  Repository: typeof UserRepository;

  constructor(Repository = UserRepository) {
    this.Repository = Repository;
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.getOne = this.getOne.bind(this);
  }

  async signup(arg: SignupParams): Promise<{ message: string, data: UserEntity }> {
    const input = this.Repository.create(arg);
    const newUser = await this.Repository.save(input);
    delete newUser.password;
    return { message: 'New user successfully signed up', data: newUser };
  }

  async login({ email, password }: LoginParams): Promise<{ message: string, data: UserEntity }> {
    await this.Repository.validateLogin({ email, password });
    const userExists = await this.Repository.findOneOrFail({
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
    await userExists.validatePassword(password);
    delete userExists.password;
    return { message: 'Registered user successfully signed in', data: userExists };
  }

  async auth(id: string): Promise<UserEntity> {
    await this.Repository.validateUserId(id);
    return this.Repository.findOneByOrFail({ id });
  }

  async listAll(): Promise<{ message: string, data: UserEntity[] }> {
    const data = await this.Repository.find();
    return { message: 'Users successfully retrieved', data };
  }

  async getOne(user: UserEntity): Promise<{ message: string, data: UserEntity }> {
    return { message: 'User successfully retrieved', data: user };
  }

  async updateOne(arg: object, user: UserEntity): Promise<{ message: string, data: UserEntity }> {
    this.Repository.merge(user, arg);
    const updatedUser = await this.Repository.save(user);
    delete updatedUser.password;
    return { message: 'User successfully updated', data: updatedUser };
  }

  async deleteOne(user: UserEntity): Promise<{ message: string }> {
    await this.Repository.remove(user);
    return { message: 'User successfully deleted' };
  }
}
