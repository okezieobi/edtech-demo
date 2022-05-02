import userRepository, { LoginParams } from '../repositories/User';

interface UserServicesParams {
  repository: { user: typeof userRepository };
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
  repository: { user: typeof userRepository };

  constructor(
    repository = { user: userRepository },
  ) {
    this.repository = repository;
    this.signupUser = this.signupUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.authUser = this.authUser.bind(this);
  }

  async signupUser(arg: SignupParams) {
    const repo = await this.repository.user();
    const newUser = repo.create(arg);
    await repo.save(newUser);
    return { message: 'New user successfully signed up', data: { ...newUser, password: undefined } };
  }

  async loginUser({ email, password }: LoginParams) {
    const repo = await this.repository.user();
    await repo.validateLogin({ email, password });
    const userExists = await repo.findOneOrFail({ where: { email } });
    await userExists.validatePassword(password);
    return { message: 'Registered user successfully signed in', data: { ...userExists, password: undefined } };
  }

  async authUser(id: string) {
    const repo = await this.repository.user();
    await repo.validateUserId(id);
    return repo.findOneOrFail({ where: { id } });
  }
}
