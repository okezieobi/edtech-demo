import userRepository, { LoginParams } from '../repositories/User';

interface UserServicesParams {
  repository: typeof userRepository;
}

interface SignupParams extends LoginParams {
    name: string;
    role?: string;
}

if (process.env.NODE_ENV === 'development') {
  (async () => {
    const repo = await userRepository();
    const testAdmin = repo.create({
      name: 'Frank',
      email: 'frank@okezie.com',
      password: 'test',
      role: 'admin',
    });
    await repo.save(testAdmin);
  })();
}

export default class UserServices implements UserServicesParams {
  repository: typeof userRepository;

  constructor(repository = userRepository) {
    this.repository = repository;
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async signup(arg: SignupParams) {
    const repo = await this.repository();
    const newUser = repo.create(arg);
    await repo.save(newUser);
    return { message: 'New user successfully signed up', data: { ...newUser, password: undefined } };
  }

  async login({ email, password }: LoginParams) {
    const repo = await this.repository();
    await repo.validateLogin({ email, password });
    const userExists = await repo.findOneOrFail({ where: { email } });
    await userExists.validatePassword(password);
    return { message: 'Registered user successfully signed in', data: { ...userExists, password: undefined } };
  }

  async auth(id: string) {
    const repo = await this.repository();
    await repo.validateUserId(id);
    return repo.findOneOrFail({ where: { id } });
  }

  async update(arg: object, user: object) {
    const repo = await this.repository();
    const data = { ...user, ...arg };
    const updatedUser = await repo.save(data);
    return { message: 'User successfully updated', data: { ...updatedUser, password: undefined } };
  }

  async delete(user: any) {
    const repo = await this.repository();
    await repo.remove(user);
    return { message: 'User successfully deleted' };
  }
}
