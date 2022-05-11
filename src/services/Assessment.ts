import AssessmentEntity from '../entities/Assessment';
import Services from '.';

export default class Assessment extends Services {
  constructor(entityClass = AssessmentEntity) {
    super(entityClass);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
  }

  async listAll(mentor: string): Promise<{ message: string, data: Array<unknown> }> {
    const arg = {
      relation: 'mentor',
      select: ['assessmentEntity.id', 'mentor.id', 'mentor.name', 'mentor.role',
        'assessmentEntity.title', 'assessmentEntity.deadline', 'assessmentEntity.createdAt'],
      where: mentor != null ? ['assessmentEntity.mentor = :mentor', { mentor }] : [],
      entity: 'assessmentEntity',
    };
    return this.fetchAll(arg);
  }

  async verifyOne(id: string): Promise<AssessmentEntity> {
    return this.fetchOne({ where: { id }, relations: { mentor: true } });
  }
}
