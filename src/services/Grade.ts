import Grade, { GradeFields } from '../entities/Grade';
import Submission from './Submission';
import { UserFields } from '../entities/User';

export default class GradeServices extends Submission {
  private Grade: typeof Grade;

  constructor(entityClass = Grade) {
    super();
    this.Grade = entityClass;
    this.listGrades = this.listGrades.bind(this);
    this.createGrade = this.createGrade.bind(this);
    this.readGradeEntity = this.readGradeEntity.bind(this);
  }

  readGradeEntity() {
    return this.Grade;
  }

  async createGrade(arg: any & GradeFields, authorized: UserFields) {
    await this.isRestricted(authorized);
    if (authorized.role === 'admin') {
      const submission = await this.fetchOne(
        this.readSubmissionEntity(),
        { where: { id: arg.submissionId } },
      );
      return this.createOne(this.Grade, { ...arg, submission });
    }
    const submission = await this.dataSrc.manager.createQueryBuilder(this.readSubmissionEntity(), 'submission')
      .leftJoinAndSelect('submission.assessment', 'assessment')
      .leftJoinAndSelect('assessment.mentor', 'mentor')
      .where('submission.assessment.mentor = :mentor', { mentor: authorized })
      .getOne();
    return this.createOne(this.Grade, { ...arg, submission });
  }

  async listGrades(role: string, user: any & UserFields) {
    let data: any;
    switch (role) {
      case 'student':
        data = await this.dataSrc.manager.createQueryBuilder(this.Grade, 'grade')
          .leftJoinAndSelect('grade.submission', 'submission')
          .leftJoinAndSelect('submission.student', 'student')
          .where('grade.submission.student = : student', { student: user.id })
          .select(['grade.id', 'grade.mark', 'grade.submission.id', 'grade.createdAt'])
          .getMany();
        break;
      case 'mentor':
        await this.isRestricted(user);
        data = await this.dataSrc.manager.createQueryBuilder(this.Grade, 'grade')
          .leftJoinAndSelect('grade.submission', 'submission')
          .leftJoinAndSelect('submission.assessment', 'assessment')
          .leftJoinAndSelect('assessment.mentor', 'mentor')
          .where('submission.assessment.mentor = :mentor', { mentor: user.id })
          .select(['grade.id', 'grade.mark', 'grade.submission.id', 'grade.createdAt'])
          .getMany();
        break;
      default:
        await this.isAdmin(user);
        data = await this.dataSrc.manager.find(this.Grade, {});
    }
    return { message: 'Grades successfully retrieved', data };
  }
}
