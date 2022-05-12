import Assessment from './Assessment';
import SubmissionEntity, { SubmissionFields } from '../entities/Submissions';
import { UserFields } from '../entities/User';

export default class Submission extends Assessment {
  private SubmissionEntity: typeof SubmissionEntity;

  constructor(entityClass = SubmissionEntity) {
    super();
    this.SubmissionEntity = entityClass;
    this.listSuBmissionsForStudent = this.listSuBmissionsForStudent.bind(this);
    this.listSubmissionsForMentor = this.listSubmissionsForMentor.bind(this);
    this.createSubmission = this.createAssessment.bind(this);
    this.readSubmissionEntity = this.readSubmissionEntity.bind(this);
  }

  readSubmissionEntity() {
    return this.SubmissionEntity;
  }

  async createSubmission(arg: any & SubmissionFields, user: any & UserFields) {
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
      { ...arg, assessment, student: student ?? user },
    );
  }

  async listSuBmissionsForStudent(student: string):
    Promise<{ message: string, data: Array<unknown> }> {
    const arg = {
      relation: 'assessment',
      select: ['submission.id', 'submission.student.name', 'submission.student.id', 'submission.submittedAt',
        'submission.assessment.id', 'submission.assessment.title'],
      where: student != null ? ['submission.student = :student', { student }] : [],
      entity: 'submission',
    };
    return this.fetchAll(this.SubmissionEntity, arg);
  }

  async listSubmissionsForMentor(mentor: string) {
    const submissions = await this.dataSrc.manager.createQueryBuilder(this.SubmissionEntity, 'submission')
      .leftJoinAndSelect('submission.assessment', 'assessment')
      .leftJoinAndSelect('assessment.mentor', 'mentor')
      .where('submission.assessment.mentor = :mentor', { mentor })
      .getMany();
    return { message: 'Submissions for mentor assessments successfully retrieved', data: submissions };
  }
}
