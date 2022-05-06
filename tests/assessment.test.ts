import request from 'supertest';

import app from '../src/app';
import Jwt from '../src/utils/Jwt';
import { testAssessmentArg, testUserAssessmentArg, testAssessmentForDeletion } from '../seeders/Assessment';

describe('Assessment tests', () => {
  describe('Testing assessment deletion', () => {
    it('Deletes an existing assessment', async () => {
      const { generate } = new Jwt();
      const token = await generate(testUserAssessmentArg.id);
      const { status, body } = await request(app).delete(`/api/v1/assessments/${testAssessmentForDeletion.id}`)
        .set('token', token);
      expect(status).toBeNumber();
      expect(status).toEqual(200);
      expect(body).toBeObject();
      expect(body.message).toBeString();
      expect(body.message).toEqual('Assessment successfully deleted');
    });
  });

  describe('Testing assessment editing', () => {
    it('Edits an existing assessment', async () => {
      const { generate } = new Jwt();
      const token = await generate(testUserAssessmentArg.id);
      const { status, body } = await request(app).put(`/api/v1/assessments/${testAssessmentArg.id}`).send({
        title: 'update title',
        description: 'update description',
        deadline: '2023-08-18',
      }).set('token', token);
      expect(status).toBeNumber();
      expect(status).toEqual(200);
      expect(body).toBeObject();
      expect(body.message).toBeString();
      expect(body.message).toEqual('Assessment successfully updated');
      expect(body.status).toBeString();
      expect(body.status).toEqual('success');
      expect(body.data).toBeObject();
      expect(body.data).toContainKeys(['id', 'title', 'description', 'mentor', 'deadline', 'createdAt', 'updatedAt']);
      expect(body.data.id).toBeString();
      expect(body.data.title).toBeString();
      expect(body.data.title).toEqual('update title');
      expect(body.data.description).toBeString();
      expect(body.data.description).toEqual('update description');
      expect(body.data.mentor).toBeObject();
      expect(body.data.deadline).toBeString();
      expect(body.data.createdAt).toBeString();
      expect(body.data.updatedAt).toBeString();
    });
  });

  describe('Testing assessment creation', () => {
    it('Creates an assessment as a mentor or admin', async () => {
      const { generate } = new Jwt();
      const token = await generate(testUserAssessmentArg.id);
      const { status, body } = await request(app).post('/api/v1/assessments').send({
        title: testAssessmentArg.title,
        deadline: testAssessmentArg.deadline,
        description: testAssessmentArg.description,
        mentor: testUserAssessmentArg,
      }).set('token', token);
      expect(status).toBeNumber();
      expect(status).toEqual(201);
      expect(body).toBeObject();
      expect(body.message).toBeString();
      expect(body.message).toEqual('New assessment successfully created');
      expect(body.status).toBeString();
      expect(body.status).toEqual('success');
      expect(body.data).toBeObject();
      expect(body.data).toContainKeys(['id', 'title', 'description', 'deadline', 'createdAt', 'updatedAt']);
      expect(body.data.id).toBeString();
      expect(body.data.title).toBeString();
      expect(body.data.title).toEqual(testAssessmentArg.title);
      expect(body.data.description).toBeString();
      expect(body.data.description).toEqual(testAssessmentArg.description);
      expect(body.data.deadline).toBeString();
      expect(body.data.createdAt).toBeString();
      expect(body.data.updatedAt).toBeString();
    });
  });

  describe('Testing assessment listing', () => {
    it('Lists all assessments', async () => {
      const { generate } = new Jwt();
      const token = await generate(testUserAssessmentArg.id);
      const { status, body } = await request(app).get('/api/v1/assessments').set('token', token);
      expect(status).toBeNumber();
      expect(status).toEqual(200);
      expect(body.message).toBeString();
      expect(body.message).toEqual('Assessments successfully retrieved');
      expect(body.status).toBeString();
      expect(body.status).toEqual('success');
      expect(body.data).toBeArray();
    });
  });

  describe('Testing assessment retrieval', () => {
    it('Retrieves an assessment by its unique id', async () => {
      const { generate } = new Jwt();
      const token = await generate(testUserAssessmentArg.id);
      const { status, body } = await request(app).get(`/api/v1/assessments/${testAssessmentArg.id}`).set('token', token);
      expect(status).toBeNumber();
      expect(status).toEqual(200);
      expect(body.message).toBeString();
      expect(body.message).toEqual('Assessment successfully retrieved');
      expect(body.status).toBeString();
      expect(body.status).toEqual('success');
      expect(body.data).toBeObject();
      expect(body.data).toContainKeys(['id', 'title', 'description', 'mentor', 'deadline', 'createdAt', 'updatedAt']);
      expect(body.data.id).toBeString();
      expect(body.data.title).toBeString();
      expect(body.data.description).toBeString();
      expect(body.data.mentor).toBeObject();
      expect(body.data.deadline).toBeString();
      expect(body.data.createdAt).toBeString();
      expect(body.data.updatedAt).toBeString();
    });
  });
});
