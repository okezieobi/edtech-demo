import AssessmentServices from '../src/services/Assessment';
import { testAssessmentArg, testUserAssessmentArg, testAssessmentForDeletion } from '../seeders/Assessment';

describe('Assessment tests', () => {
  describe('Testing assessment deletion', () => {
    it('Deletes an existing assessment', async () => {
      const { deleteOne } = new AssessmentServices();
      const { message } = await deleteOne(testAssessmentForDeletion.id);
      expect(message).toBeString();
      expect(message).toEqual('Assessment successfully deleted');
    });
  });

  describe('Testing assessment editing', () => {
    it('Edits an existing assessment', async () => {
      const { updateOne } = new AssessmentServices();
      const { message, data } = await updateOne({
        title: 'update title',
      }, testAssessmentArg);
      expect(message).toBeString();
      expect(message).toEqual('Assessment successfully updated');
      expect(data).toBeObject();
      expect(data).toContainKeys(['id', 'title', 'description', 'mentor', 'deadline', 'createdAt', 'updatedAt']);
      expect(data.id).toBeString();
      expect(data.title).toBeString();
      expect(data.title).toEqual('update title');
      expect(data.description).toBeString();
      expect(data.description).toEqual(testAssessmentArg.description);
      expect(data.mentor).toBeObject();
      expect(data.deadline).toBeString();
      expect(data.createdAt).toBeDate();
      expect(data.updatedAt).toBeDate();
    });
  });

  describe('Testing assessment creation', () => {
    it('Creates an assessment as a mentor or admin', async () => {
      const { createOne } = new AssessmentServices();
      const { message, data } = await createOne({
        title: testAssessmentArg.title,
        deadline: testAssessmentArg.deadline,
        description: testAssessmentArg.description,
        mentor: testUserAssessmentArg,
      });
      expect(message).toBeString();
      expect(message).toEqual('New assessment successfully created');
      expect(data).toBeObject();
      expect(data).toContainKeys(['id', 'title', 'description', 'deadline', 'createdAt', 'updatedAt']);
      expect(data.id).toBeString();
      expect(data.title).toBeString();
      expect(data.title).toEqual(testAssessmentArg.title);
      expect(data.description).toBeString();
      expect(data.description).toEqual(testAssessmentArg.description);
      expect(data.deadline).toBeString();
      expect(data.createdAt).toBeDate();
      expect(data.updatedAt).toBeDate();
    });
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
      const data = await verifyOne(testAssessmentArg.id);
      expect(data).toBeObject();
      expect(data).toContainKeys(['id', 'title', 'description', 'mentor', 'deadline', 'createdAt', 'updatedAt']);
      expect(data.id).toBeString();
      expect(data.title).toBeString();
      expect(data.description).toBeString();
      expect(data.mentor).toBeObject();
      expect(data.deadline).toBeDate();
      expect(data.createdAt).toBeDate();
      expect(data.updatedAt).toBeDate();
    });
  });
});
