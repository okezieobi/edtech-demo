import AssessmentServices from '../src/services/Assessment';
import { testAssessmentArg } from '../seeders/Assessment';

describe('Assessment tests', () => {
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
      const data = await verifyOne(testAssessmentArg.id);
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
