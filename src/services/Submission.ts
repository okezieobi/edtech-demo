import SubmissionRepository, { SubmissionEntity } from '../repositories/Submission';

interface SubmissionServicesParams {
    Repository: typeof SubmissionRepository;
}

interface SubmissionParams {
    links: Array<string>;
    assessment: any;
}

export default class SubmissionServices implements SubmissionServicesParams {
  Repository: typeof SubmissionRepository;

  constructor(Repository = SubmissionRepository) {
    this.Repository = Repository;
    this.createOne = this.createOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  async createOne(arg: SubmissionParams): Promise<{ message: string, data: SubmissionEntity}> {
    const input = this.Repository.create(arg);
    const data = await this.Repository.save(input);
    return { message: 'New submission successfully created', data };
  }

  async listAll(): Promise<{ message: string, data: SubmissionEntity[] }> {
    const data = await this.Repository.createQueryBuilder('submissionEntity')
      .leftJoinAndSelect('submissionEntity.assessment', 'assessment')
      .select(['submissionEntity.id', 'submissionEntity.links', 'submissionEntity.submittedAt',
        'submissionEntity.assessment.id', 'submissionEntity.assessment.title'])
      .orderBy('submissionEntity.createdAt', 'DESC')
      .getMany();
    return { message: 'Submissions successfully retrieved', data };
  }

  async verifyOne(id: string): Promise<SubmissionEntity> {
    await this.Repository.validateSubmissionId(id);
    return this.Repository.findOneOrFail({ where: { id }, relations: { assessment: true } });
  }

  static async getOne(submission: SubmissionEntity):
        Promise<{ message: string, data: SubmissionEntity }> {
    return {
      message: 'Submission successfully retrieved',
      data: submission,
    };
  }

  async updateOne(arg: object, submission: SubmissionEntity):
        Promise<{ message: string, data: SubmissionEntity }> {
    this.Repository.merge(submission, arg);
    const data = await this.Repository.save(submission);
    return { message: 'Submission successfully updated', data };
  }

  async deleteOne(submission: SubmissionEntity):
        Promise<{ message: string }> {
    await this.Repository.remove(submission);
    return { message: 'Submission successfully deleted' };
  }
}
