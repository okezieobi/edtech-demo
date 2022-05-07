import request from 'supertest';

import app from '../src/app';
import { testUserEntity, testUserInput, testAdminEntity } from '../seeders/User';
import Jwt from '../src/utils/Jwt';

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

  const updateUser = {
    name: 'test-username-new',
    email: 'test-new-update@email.com',
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
    describe('Testing user editing', () => {
      it('Edits a user using its unique id as an authorized admin', async () => {
        const { generate } = new Jwt();
        const token = await generate(testAdminEntity.id);
        const { status, body } = await request(app).put(`/api/v1/users/${testAdminEntity.id}`)
          .send(updateUser)
          .set('token', token);
        expect(status).toBeNumber();
        expect(status).toEqual(200);
        expect(body).toBeObject();
        expect(body.message).toBeString();
        expect(body.message).toEqual('User successfully updated');
        expect(body.status).toBeString();
        expect(body.status).toEqual('success');
        expect(body.data).toBeObject();
        expect(body.data).toContainKeys(['name', 'email', 'id', 'role', 'createdAt', 'updatedAt']);
        expect(body.data.id).toBeString();
        expect(body.data.name).toBeString();
        expect(body.data.name).toEqual(updateUser.name);
        expect(body.data.email).toBeString();
        expect(body.data.email).toEqual(updateUser.email);
        expect(body.data.role).toBeString();
        expect(body.data.role).toEqual('admin');
        expect(body.data.createdAt).toBeString();
        expect(body.data.updatedAt).toBeString();
      });
    });

    describe('Testing users listing', () => {
      it('Lists all users as an authorized admin', async () => {
        const { generate } = new Jwt();
        const token = await generate(testAdminEntity.id);
        const { status, body } = await request(app).get('/api/v1/users').set('token', token);
        expect(status).toBeNumber();
        expect(status).toEqual(200);
        expect(body.message).toBeString();
        expect(body.message).toEqual('Users successfully retrieved');
        expect(body.status).toBeString();
        expect(body.status).toEqual('success');
        expect(body.data).toBeArray();
      });
    });

    it('Should signup new user', async () => {
      const { status, body } = await request(app).post('/api/v1/auth/signup').send(newUser);
      expect(status).toBeNumber();
      expect(status).toEqual(201);
      expect(body).toBeObject();
      expect(body).toContainKeys(['message', 'status', 'data']);
      expect(body.message).toBeString();
      expect(body.message).toEqual('New user successfully signed up');
      expect(body.status).toBeString();
      expect(body.status).toEqual('success');
      expect(body.data).toBeObject();
      expect(body.data).toContainKeys(['name', 'email', 'id', 'token', 'role', 'createdAt', 'updatedAt']);
      expect(body.data.id).toBeString();
      expect(body.data.token).toBeString();
      expect(body.data.name).toBeString();
      expect(body.data.name).toEqual(newUser.name);
      expect(body.data.email).toBeString();
      expect(body.data.email).toEqual(newUser.email);
      expect(body.data.role).toBeString();
      expect(body.data.role).toEqual('student');
      expect(body.data.createdAt).toBeString();
      expect(body.data.updatedAt).toBeString();
    });

    it('Should signup new mentor', async () => {
      const { status, body } = await request(app).post('/api/v1/auth/signup').send(newMentor);
      expect(status).toBeNumber();
      expect(status).toEqual(201);
      expect(body).toBeObject();
      expect(body.message).toBeString();
      expect(body.message).toEqual('New user successfully signed up');
      expect(body.status).toBeString();
      expect(body.status).toEqual('success');
      expect(body.data).toBeObject();
      expect(body.data).toContainKeys(['name', 'email', 'id', 'token', 'role', 'createdAt', 'updatedAt']);
      expect(body.data.id).toBeString();
      expect(body.data.token).toBeString();
      expect(body.data.name).toBeString();
      expect(body.data.name).toEqual(newMentor.name);
      expect(body.data.email).toBeString();
      expect(body.data.email).toEqual(newMentor.email);
      expect(body.data.role).toBeString();
      expect(body.data.role).toEqual('mentor');
      expect(body.data.createdAt).toBeString();
      expect(body.data.updatedAt).toBeString();
    });

    it('Should signup new admin', async () => {
      const { status, body } = await request(app).post('/api/v1/auth/signup').send(newAdmin);
      expect(status).toBeNumber();
      expect(status).toEqual(201);
      expect(body).toBeObject();
      expect(body.message).toBeString();
      expect(body.message).toEqual('New user successfully signed up');
      expect(body.status).toBeString();
      expect(body.status).toEqual('success');
      expect(body.data).toBeObject();
      expect(body.data).toContainKeys(['name', 'email', 'id', 'token', 'role', 'createdAt', 'updatedAt']);
      expect(body.data.id).toBeString();
      expect(body.data.token).toBeString();
      expect(body.data.name).toBeString();
      expect(body.data.name).toEqual(newAdmin.name);
      expect(body.data.email).toBeString();
      expect(body.data.email).toEqual(newAdmin.email);
      expect(body.data.role).toBeString();
      expect(body.data.role).toEqual('admin');
      expect(body.data.createdAt).toBeString();
      expect(body.data.updatedAt).toBeString();
    });
  });

  describe('Testing registered user signing in', () => {
    it('Signs in registered user', async () => {
      const { status, body } = await request(app).post('/api/v1/auth/login').send({
        email: testUserInput.email,
        password: testUserInput.password,
      });
      expect(status).toBeNumber();
      expect(status).toEqual(200);
      expect(body).toBeObject();
      expect(body.message).toBeString();
      expect(body.message).toEqual('Registered user successfully signed in');
      expect(body.status).toBeString();
      expect(body.status).toEqual('success');
      expect(body.data).toBeObject();
      expect(body.data).toContainKeys(['name', 'email', 'id', 'token', 'role', 'createdAt', 'updatedAt']);
      expect(body.data.id).toBeString();
      expect(body.data.token).toBeString();
      expect(body.data.name).toBeString();
      expect(body.data.name).toEqual(testUserInput.name);
      expect(body.data.email).toBeString();
      expect(body.data.email).toEqual(testUserInput.email);
      expect(body.data.role).toBeString();
      expect(body.data.role).toEqual('student');
      expect(body.data.createdAt).toBeString();
      expect(body.data.updatedAt).toBeString();
    });
  });

  describe('Testing user retrieval', () => {
    it('Retrieves a user by its unique id as an authorized admin', async () => {
      const { generate } = new Jwt();
      const token = await generate(testAdminEntity.id);
      const { status, body } = await request(app).get(`/api/v1/users/${testUserEntity.id}`)
        .set('token', token);
      expect(status).toBeNumber();
      expect(status).toEqual(200);
      expect(body).toBeObject();
      expect(body.message).toBeString();
      expect(body.message).toEqual('User successfully retrieved');
      expect(body.status).toBeString();
      expect(body.status).toEqual('success');
      expect(body.data).toBeObject();
      expect(body.data).toContainKeys(['name', 'email', 'id', 'role', 'createdAt', 'updatedAt']);
      expect(body.data.id).toBeString();
      expect(body.data.name).toBeString();
      expect(body.data.email).toBeString();
      expect(body.data.role).toBeString();
      expect(body.data.role).toEqual('student');
      expect(body.data.createdAt).toBeString();
      expect(body.data.updatedAt).toBeString();
    });
  });
});
