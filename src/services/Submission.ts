import Assessment from './Assessment';
import SubmissionEntity, { SubmissionFields } from '../entities/Submissions';
import { UserFields } from '../entities/User';

export default class Submission extends Assessment {
  private SubmissionEntity: typeof SubmissionEntity;

  constructor(entityClass = SubmissionEntity) {
    super();
    this.SubmissionEntity = entityClass;
    this.listSuBmissions = this.listSuBmissions.bind(this);
    this.createSubmission = this.createAssessment.bind(this);
    this.readSubmissionEntity = this.readSubmissionEntity.bind(this);
  }

  readSubmissionEntity() {
    return this.SubmissionEntity;
  }

  async createSubmission(arg: any & SubmissionFields, authorized: any & UserFields) {
    const assessment = await this.fetchOne(
      this.readAssessmentEntity(),
      { where: { id: arg.assessmentId } },
    );
    let student: any;
    if (arg.studentId) {
      student = await this.fetchOne(this.readUserEntity(), { where: { id: arg.studentId } });
    }
    return this.createOne(
      this.SubmissionEntity,
      { ...arg, assessment, student: student ?? authorized },
    );
  }

  async listSuBmissions(student: string): Promise<{ message: string, data: Array<unknown> }> {
    const arg = {
      relation: 'assessment',
      select: ['submission.id', 'submission.student.name', 'submission.student.id', 'submission.submittedAt',
        'submission.assessment.id', 'submission.assessment.title'],
      where: student != null ? ['submission.student = :student', { student }] : [],
      entity: 'submission',
    };
    return this.fetchAll(this.SubmissionEntity, arg);
  }
}
