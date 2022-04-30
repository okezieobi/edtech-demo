import userRepository from '../repositories/User';
import LoginValidator, { LoginParams } from '../validators/User.login';
import IdValidator from '../validators/Id';

interface UserServicesParams {
  repository: { user: typeof userRepository };
  validator: { user: { Login: typeof LoginValidator }}
}

interface SignupParams extends LoginParams {
    name: string;
    role: string;
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

  validator: { user: { Login: typeof LoginValidator }};

  constructor(
    repository = { user: userRepository },
    validator = { user: { Login: LoginValidator } },
  ) {
    this.repository = repository;
    this.validator = validator;
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
    await new this.validator.user.Login(email, password)
      .validate({ validationError: { target: false }, forbidUnknownValues: true });
    const repo = await this.repository.user();
    const userExists = await repo.findOneOrFail({ where: { email } });
    await userExists.validatePassword(password);
    return { message: 'Registered user successfully signed in', data: { ...userExists, password: undefined } };
  }

  async authUser(id: string) {
    await new IdValidator(id)
      .validate({ validationError: { target: false }, forbidUnknownValues: true });
    const repo = await this.repository.user();
    return repo.findOneOrFail({ where: { id } });
  }
}
