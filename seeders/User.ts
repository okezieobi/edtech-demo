/* eslint-disable class-methods-use-this */
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import UserEntity from '../src/entities/User';

const testUserEntity: any = {};

const testUserInput: any = {
  name: 'test-username',
  email: 'test@email.com',
  password: 'test-password',
};

const testAdminInput: any = {
  name: 'Frank',
  email: 'frank@okezie.com',
  password: 'test',
  role: 'admin',
};

const testAdminEntity: any = {};

const testUserDelete: any = {};

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);

    const testAdmin = repository.create(testAdminInput);
    await repository.save(testAdmin);
    Object.assign(testAdminEntity, testAdmin);

    const testUser = repository.create(testUserInput);
    await repository.save(testUser);
    Object.assign(testUserEntity, testUser);

    const testDeleteUser = repository.create({
      name: 'Frank',
      email: 'user-deletion@okezie.com',
      password: 'test',
      role: 'admin',
    });
    await repository.save(testDeleteUser);
    Object.assign(testUserDelete, testDeleteUser);
  }
}

export {
  testUserEntity, testUserInput, testAdminEntity, testUserDelete,
};
