import Assessment from './Assessment';
import Submission, { SubmissionFields } from '../entities/Submissions';
import { UserFields } from '../entities/User';

export default class SubmissionServices extends Assessment {
  private Submission: typeof Submission;

  constructor(entityClass = Submission) {
    super();
    this.Submission = entityClass;
    this.listSubmissionsByUserRole = this.listSubmissionsByUserRole.bind(this);
    this.createSubmission = this.createSubmission.bind(this);
    this.readSubmissionEntity = this.readSubmissionEntity.bind(this);
    this.getSubmissionById = this.getSubmissionById.bind(this);
  }

  readSubmissionEntity() {
    return this.Submission;
  }

  async createSubmission(
    arg: any & SubmissionFields,
    assessmentId: string,
    user: any & UserFields,
    studentId: string,
  ) {
    await this.validateId(assessmentId);
    const assessment = await this.fetchOne(
      this.readAssessmentEntity(),
      { where: { id: assessmentId } },
    );
    let student: any;
    if (studentId) {
      await this.isAdmin(user);
      student = await this.fetchOne(this.readUserEntity(), { where: { id: arg.studentId } });
    }
    const data = await this.createOne(
      this.Submission,
      { ...arg, assessment, student: student ?? user },
    );
    return { message: 'Submission successfully created', data };
  }

  async listSubmissionsByUserRole(role: string, user: any & UserFields) {
    let data: any;
    switch (role) {
      case 'student':
        data = await this.dataSrc.manager.createQueryBuilder(this.Submission, 'submission')
          .leftJoinAndSelect('submission.assessment = : assessment', 'assessment')
          .select(['submission.id', 'submission.student.name', 'submission.student.id', 'submission.submittedAt',
            'submission.assessment.id', 'submission.assessment.title'])
          .where('submission.student = : student', { student: user.id })
          .getMany();
        break;
      case 'mentor':
        await this.isRestricted(user);
        data = await this.dataSrc.manager.createQueryBuilder(this.Submission, 'submission')
          .leftJoinAndSelect('submission.assessment', 'assessment')
          .leftJoinAndSelect('assessment.mentor', 'mentor')
          .where('submission.assessment.mentor = :mentor', { mentor: user.id })
          .getMany();
        break;
      default:
        await this.isAdmin(user);
        data = await this.dataSrc.manager.createQueryBuilder(this.Submission, 'submission')
          .leftJoinAndSelect('submission.assessment = : assessment', 'assessment')
          .select(['submission.id', 'submission.student.name', 'submission.student.id', 'submission.submittedAt',
            'submission.assessment.id', 'submission.assessment.title'])
          .getMany();
    }
    return { message: 'Submissions successfully retrieved', data };
  }

  async getSubmissionById(role:string, id: string, user: UserFields) {
    let data;
    await this.validateId(id);
    switch (role) {
      case 'student':
        data = await this.fetchOne(this.Submission, { where: { id, student: user } });
        break;
      case 'mentor':
        await this.isRestricted(user);
        data = await this.dataSrc.manager.createQueryBuilder(this.Submission, 'submission')
          .leftJoinAndSelect('submission.assessment', 'assessment')
          .leftJoinAndSelect('assessment.mentor', 'mentor')
          .where('submission.assessment.mentor = :mentor', { mentor: user })
          .getOne();
        break;
      default:
        await this.isAdmin(user);
        data = await this.fetchOne(this.Submission, { where: { id } });
    }
    return { message: 'Submissions successfully retrieved', data };
  }
}
