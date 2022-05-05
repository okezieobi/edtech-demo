/* eslint-disable class-methods-use-this */
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import UserEntity from '../src/entities/User';
import AssessmentEntity from '../src/entities/Assessment';

const testUserAssessmentArg: any = {};
const testAssessmentArg: any = {};

export default class AssessmentSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(UserEntity);
    const testUser = userRepository.create({
      name: 'test-username-assessment',
      email: 'test-assessment@email.com',
      password: 'test-password',
      role: 'mentor',
    });
    await userRepository.save(testUser);
    Object.assign(testUserAssessmentArg, testUser);

    const repository = dataSource.getRepository(AssessmentEntity);
    const testAssessment = repository.create({
      title: 'title',
      description: 'description',
      deadline: '2022-09-22',
      mentor: testUser,
    });
    await repository.save(testAssessment);
    Object.assign(testAssessmentArg, testAssessment);
  }
}

export { testUserAssessmentArg, testAssessmentArg };
