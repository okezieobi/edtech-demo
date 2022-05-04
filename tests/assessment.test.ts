import AssessmentServices, { AssessmentParams } from '../src/services/Assessment';
import assessmentRepository from '../src/repositories/Assessment';
import userRepository from '../src/repositories/User';

describe('Assessment tests', () => {
  const user = {
    name: 'test-username',
    email: 'test@email.com',
    password: 'test-password',
  };

  const assessment: AssessmentParams = {
    title: 'title',
    description: 'description',
    deadline: new Date(),
    mentor: {},
  };

  let assessmentForTesting: any;

  beforeAll(async () => {
    const userRepo = await userRepository();
    const assessmentRepo = await assessmentRepository();

    await assessmentRepo.delete({});
    await userRepo.delete({});

    const registeredUser = await userRepo.save(userRepo.create(user));

    assessment.mentor = registeredUser;
    const savedAssessment = await assessmentRepo.save(assessmentRepo.create(assessment));
    assessmentForTesting = savedAssessment;
  });
});
