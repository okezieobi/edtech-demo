import Grade, { GradeFields } from '../entities/Grade';
import Submission from './Submission';
import { UserFields } from '../entities/User';

export default class GradeServices extends Submission {
  private Grade: typeof Grade;

  constructor(entityClass = Grade) {
    super();
    this.Grade = entityClass;
    this.listGradesForMentor = this.listGradesForMentor.bind(this);
    this.listGradesForStudent = this.listGradesForStudent.bind(this);
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

  async listGradesForStudent(student: UserFields) {
    const grades = this.dataSrc.manager.createQueryBuilder(this.Grade, 'grade')
      .leftJoinAndSelect('grade.submission', 'submission')
      .leftJoinAndSelect('submission.student', 'student')
      .where('grade.submission.student = : student', { student })
      .select(['grade.id', 'grade.mark', 'grade.submission.id', 'grade.createdAt'])
      .getMany();
    return { message: 'Student grades successfully retrieved', data: grades };
  }

  async listGradesForMentor(mentor: UserFields) {
    const grades = await this.dataSrc.manager.createQueryBuilder(this.Grade, 'grade')
      .leftJoinAndSelect('grade.submission', 'submission')
      .leftJoinAndSelect('submission.assessment', 'assessment')
      .leftJoinAndSelect('assessment.mentor', 'mentor')
      .where('submission.assessment.mentor = :mentor', { mentor })
      .select(['grade.id', 'grade.mark', 'grade.submission.id', 'grade.createdAt'])
      .getMany();
    return { message: 'Grades for mentor assessments successfully retrieved', data: grades };
  }
}
