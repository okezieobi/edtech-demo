import GradeEntity from '../entities/Grade';
import Services from '.';

export default class Grade extends Services {
  constructor(entityClass = GradeEntity) {
    super(entityClass);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
  }

  async listAll(): Promise<{ message: string, data: Array<unknown> }> {
    const arg = {
      relation: 'submission',
      select: ['gradeEntity.id', 'gradeEntity.mark', 'gradeEntity.submission.id', 'gradeEntity.createdAt'],
    };
    return this.fetchAll(arg);
  }

  async verifyOne(id: string): Promise<GradeEntity> {
    return this.fetchOne({ where: { id }, relation: { submission: true } });
  }
}
