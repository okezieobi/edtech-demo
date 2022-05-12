import GradeEntity, { GradeFields } from '../entities/Grade';
import Submission from './Submission';
import { UserFields } from '../entities/User';

export default class Grade extends Submission {
  private GradeEntity: typeof GradeEntity;

  constructor(entityClass = GradeEntity) {
    super();
    this.GradeEntity = entityClass;
    this.listGrades = this.listGrades.bind(this);
    this.createGrade = this.createGrade.bind(this);
    this.readGradeEntity = this.readGradeEntity.bind(this);
  }

  readGradeEntity() {
    return this.GradeEntity;
  }

  async createGrade(arg: any & GradeFields, authorized: UserFields) {
    await this.isRestricted(authorized);
    if (authorized.role === 'admin') {
      const submission = await this.fetchOne(
        this.readSubmissionEntity(),
        { where: { id: arg.submissionId } },
      );
      return this.createOne(this.GradeEntity, { ...arg, submission });
    }
    const submission = await this.dataSrc.manager.createQueryBuilder(this.readSubmissionEntity(), 'submission')
      .leftJoinAndSelect('submission.assessment', 'assessment')
      .leftJoinAndSelect('assessment.mentor', 'mentor')
      .where('submission.assessment.mentor = :mentor', { mentor: authorized })
      .getOne();
    return this.createOne(this.GradeEntity, { ...arg, submission });
  }

  async listGrades(authorized: UserFields): Promise<{ message: string, data: Array<any> }> {
    let where: Array<any>;
    switch (authorized.role) {
      case 'student':
        where = ['grade'];
        break;
      default:
        where = [];
    }
    const arg = {
      relation: 'submission',
      select: ['grade.id', 'grade.mark', 'grade.submission.id', 'grade.createdAt'],
      entity: 'grade',
      where,
    };
    const grades = this.dataSrc.manager.createQueryBuilder(this.GradeEntity, 'grade')
      .leftJoinAndSelect('grade.submission', 'submission')
      .leftJoinAndSelect('submission.student', 'student')
      .getMany();
    return { message: 'stuff', data: grades };
  }
}
