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

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);
    const testAdmin = repository.create({
      name: 'Frank',
      email: 'frank@okezie.com',
      password: 'test',
      role: 'admin',
    });
    await repository.save(testAdmin);

    const testUser = repository.create(testUserInput);
    await repository.save(testUser);
    Object.assign(testUserEntity, testUser);
  }
}

export { testUserEntity, testUserInput };
