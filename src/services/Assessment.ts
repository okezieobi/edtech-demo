/* eslint-disable class-methods-use-this */
import AssessmentRepository from '../repositories/Assessment';

interface AssessmentServicesParams {
Repository: typeof AssessmentRepository
}

interface AssessmentParams {
    title: string;
    description: string;
    mentor: any;
    deadline: string;
}

export default class AssessmentServices implements AssessmentServicesParams {
  Repository: typeof AssessmentRepository;

  constructor(Repository = AssessmentRepository) {
    this.Repository = Repository;
    this.createOne = this.createOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  async createOne(arg: AssessmentParams) {
    const input = this.Repository.create(arg);
    const newAssessment = await this.Repository.save(input);
    return { message: 'New assessment successfully created', data: { ...newAssessment, mentor: undefined } };
  }

  async listAll() {
    const data = await this.Repository.createQueryBuilder('assessmentEntity')
      .leftJoinAndSelect('assessmentEntity.mentor', 'mentor')
      .select(['assessmentEntity.id', 'mentor.id', 'mentor.name', 'mentor.role',
        'assessmentEntity.title', 'assessmentEntity.deadline', 'assessmentEntity.createdAt'])
      .orderBy('assessmentEntity.createdAt', 'DESC')
      .getMany();
    return { message: 'Assessments successfully retrieved', data };
  }

  async verifyOne(id: string) {
    return this.Repository.findOneOrFail({ where: { id }, relations: { mentor: true } });
  }

  async getOne(assessment: any) {
    return {
      message: 'Assessment successfully retrieved',
      data: { ...assessment },
    };
  }

  async updateOne(arg: object, assessment: any) {
    this.Repository.merge(assessment, arg);
    const data = await this.Repository.save(assessment);
    return { message: 'Assessment successfully updated', data };
  }

  async deleteOne(assessment: any) {
    await this.Repository.delete(assessment);
    return { message: 'Assessment successfully deleted' };
  }
}

export { AssessmentParams };
