import AssessmentServices, { AssessmentParams } from '../src/services/Assessment';
import AssessmentRepository from '../src/repositories/Assessment';
import UserRepository from '../src/repositories/User';

describe('Assessment tests', () => {
  const user = {
    name: 'test-username',
    email: 'test-assement@email.com',
    password: 'test-password',
  };

  const assessment: AssessmentParams = {
    title: 'title',
    description: 'description',
    deadline: '2022-09-22',
    mentor: {},
  };

  let assessmentForTesting: any;

  beforeAll(async () => {
    const registeredUser = await UserRepository.save(UserRepository.create(user));

    assessment.mentor = registeredUser;
    const savedAssessment = await AssessmentRepository
      .save(AssessmentRepository.create(assessment));
    assessmentForTesting = savedAssessment;
  });

  describe('Testing assessment listing', () => {
    it('Lists all assessments', async () => {
      const { listAll } = new AssessmentServices();
      const { message, data } = await listAll();
      expect(message).toBeString();
      expect(message).toEqual('Assessments successfully retrieved');
      expect(data).toBeArray();
    });
  });

  describe('Testing assessment retrieval', () => {
    it('Retrieves an assessment by its unique id', async () => {
      const { verifyOne } = new AssessmentServices();
      const data = await verifyOne(assessmentForTesting.id);
      expect(data).toBeObject();
      expect(data).toContainKeys(['id', 'title', 'description', 'mentor', 'deadline', 'createdAt', 'updatedAt']);
      expect(data.id).toBeString();
      expect(data.title).toBeString();
      expect(data.description).toBeString();
      expect(data.deadline).toBeDate();
      expect(data.createdAt).toBeDate();
      expect(data.updatedAt).toBeDate();
    });
  });
});
