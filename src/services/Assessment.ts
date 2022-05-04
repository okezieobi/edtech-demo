/* eslint-disable class-methods-use-this */
import assessmentRepository from '../repositories/Assessment';

interface AssessmentServicesParams {
repository: typeof assessmentRepository
}

interface AssessmentParams {
    title: string;
    description: string;
    mentor: object;
    deadline: string;
}

export default class AssessmentServices implements AssessmentServicesParams {
  repository: typeof assessmentRepository;

  constructor(repository = assessmentRepository) {
    this.repository = repository;
    this.createOne = this.createOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  async createOne(arg: AssessmentParams) {
    const repo = await this.repository();
    const input = repo.create(arg);
    const newAssessment = await repo.save(input);
    return { message: 'New assessment successfully created', data: { ...newAssessment, mentor: undefined } };
  }

  async listAll(mentor?: string) {
    const repo = await this.repository();
    const query = mentor == null ? {} : { where: { mentor } };
    const data = await repo.find(query);
    return { message: 'Assessments successfully retrieved', data };
  }

  async verifyOne(id: string) {
    const repo = await this.repository();
    const data = await repo.findOneOrFail({ where: { id } });
    return data;
  }

  async getOne(assessment: any) {
    const mentor = await assessment.mentor;
    const deadline = assessment.deadline.toLocalDateString();
    return {
      message: 'Assessment successfully retrieved',
      data: { ...assessment.data, deadline, mentor: { ...mentor, password: undefined } },
    };
  }

  async updateOne(arg: object, assessment: object) {
    const repo = await this.repository();
    const input = { ...assessment, ...arg };
    const data = await repo.save(input);
    return { message: 'Assessment successfully updated', data };
  }

  async deleteOne(assessment: any) {
    const repo = await this.repository();
    await repo.remove(assessment);
    return { message: 'Assessment successfully updated' };
  }
}

export { AssessmentParams };
