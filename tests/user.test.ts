import UserServices from '../src/services/User';
import { testUserEntity, testUserInput } from '../seeders/User';

describe('User tests', () => {
  //   const userReq = {
  //     email: 'test@email.com',
  //     password: 'test-password',
  //   };

  //   const user404 = {
  //     name: 'test-username-fake',
  //     email: 'test-fake@email.com',
  //     password: 'test-password',
  //     phone: '0812345675',
  //   };

  //   const user404Req = {
  //     email: 'test-fake@email.com',
  //     password: 'test-password',
  //   };

  const newUser = {
    name: 'test-username-new',
    email: 'test-new@email.com',
    password: 'test-password',
  };

  const newMentor = {
    name: 'test-username-new-mentor',
    email: 'test-new-mentor@email.com',
    password: 'test-password',
    role: 'mentor',
  };

  const newAdmin = {
    name: 'test-username-new-admin',
    email: 'test-new-admin@email.com',
    password: 'test-password',
    role: 'admin',
  };

  describe('Testing new user signup', () => {
    it('Should signup new user', async () => {
      const { signup } = new UserServices();
      const { message, data } = await signup(newUser);
      expect(message).toBeString();
      expect(message).toEqual('New user successfully signed up');
      expect(data).toBeObject();
      expect(data).toContainKeys(['name', 'email', 'id', 'role', 'createdAt', 'updatedAt']);
      expect(data.id).toBeString();
      expect(data.name).toBeString();
      expect(data.name).toEqual(newUser.name);
      expect(data.email).toBeString();
      expect(data.email).toEqual(newUser.email);
      expect(data.role).toBeString();
      expect(data.role).toEqual('student');
      expect(data.createdAt).toBeDate();
      expect(data.updatedAt).toBeDate();
    });

    it('Should signup new mentor', async () => {
      const { signup } = new UserServices();
      const { message, data } = await signup(newMentor);
      expect(message).toBeString();
      expect(message).toEqual('New user successfully signed up');
      expect(data).toBeObject();
      expect(data).toContainKeys(['name', 'email', 'id', 'role', 'createdAt', 'updatedAt']);
      expect(data.id).toBeString();
      expect(data.name).toBeString();
      expect(data.name).toEqual(newMentor.name);
      expect(data.email).toBeString();
      expect(data.email).toEqual(newMentor.email);
      expect(data.role).toBeString();
      expect(data.role).toEqual('mentor');
      expect(data.createdAt).toBeDate();
      expect(data.updatedAt).toBeDate();
    });

    it('Should signup new admin', async () => {
      const { signup } = new UserServices();
      const { message, data } = await signup(newAdmin);
      expect(message).toBeString();
      expect(message).toEqual('New user successfully signed up');
      expect(data).toBeObject();
      expect(data).toContainKeys(['name', 'email', 'id', 'role', 'createdAt', 'updatedAt']);
      expect(data.id).toBeString();
      expect(data.name).toBeString();
      expect(data.name).toEqual(newAdmin.name);
      expect(data.email).toBeString();
      expect(data.email).toEqual(newAdmin.email);
      expect(data.role).toBeString();
      expect(data.role).toEqual('admin');
      expect(data.createdAt).toBeDate();
      expect(data.updatedAt).toBeDate();
    });
  });

  describe('Testing registered user signing in', () => {
    it('Signs in registered user', async () => {
      const { login } = new UserServices();
      const { message, data } = await login({
        email: testUserInput.email,
        password: testUserInput.password,
      });
      expect(message).toBeString();
      expect(message).toEqual('Registered user successfully signed in');
      expect(data).toBeObject();
      expect(data).toContainKeys(['name', 'email', 'id', 'role', 'createdAt', 'updatedAt']);
      expect(data.id).toBeString();
      expect(data.name).toBeString();
      expect(data.name).toEqual(testUserInput.name);
      expect(data.email).toBeString();
      expect(data.email).toEqual(testUserInput.email);
      expect(data.role).toBeString();
      expect(data.role).toEqual('student');
      expect(data.createdAt).toBeDate();
      expect(data.updatedAt).toBeDate();
    });
  });

  describe('Testing authentication user', () => {
    it('Authenticates user by id', async () => {
      const { auth } = new UserServices();
      const data = await auth(testUserEntity.id);
      expect(data).toBeObject();
      expect(data).toContainKeys(['name', 'email', 'id', 'role', 'createdAt', 'updatedAt']);
      expect(data.id).toBeString();
      expect(data.name).toBeString();
      expect(data.email).toBeString();
      expect(data.role).toBeString();
      expect(data.role).toEqual('student');
      expect(data.createdAt).toBeDate();
      expect(data.updatedAt).toBeDate();
    });
  });
});
