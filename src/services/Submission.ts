import Services from '.';
import SubmissionEntity from '../entities/Submissions';

export default class Submission extends Services {
  constructor(entityClass = SubmissionEntity) {
    super(entityClass);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
  }

  async listAll(student: string): Promise<{ message: string, data: Array<unknown> }> {
    const arg = {
      relation: 'assessment',
      select: ['submissionEntity.id', 'submissionEntity.student.name', 'submissionEntity.student.id', 'submissionEntity.submittedAt',
        'submissionEntity.assessment.id', 'submissionEntity.assessment.title'],
      where: student != null ? ['submissionEntity.student = :student', { student }] : [],
      entity: 'submissionEntity',
    };
    return this.fetchAll(arg);
  }

  async verifyOne(id: string): Promise<SubmissionEntity> {
    return super.fetchOne({ where: { id }, relations: { assessment: true } });
  }
}
