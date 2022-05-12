import AssessmentEntity, { AssessmentFields } from '../entities/Assessment';
import { UserFields } from '../entities/User';
import User from './User';

export default class Assessment extends User {
  private AssessmentEntity: typeof AssessmentEntity;

  constructor(entityClass = AssessmentEntity) {
    super();
    this.AssessmentEntity = entityClass;
    this.listAssessments = this.listAssessments.bind(this);
    this.createAssessment = this.createAssessment.bind(this);
    this.readAssessmentEntity = this.readAssessmentEntity.bind(this);
  }

  readAssessmentEntity() {
    return this.AssessmentEntity;
  }

  async createAssessment(arg: any & AssessmentFields, mentor: UserFields) {
    let optMentor: any;
    if (arg.mentorId != null) {
      await this.validateId(arg.mentor);
      optMentor = await this.fetchOne(
        this.readUserEntity(),
        { where: { id: arg.mentorId } },
      );
    }
    return super.createOne(this.AssessmentEntity, { ...arg, mentor: optMentor ?? mentor });
  }

  async listAssessments(mentor: string): Promise<{ message: string, data: Array<unknown> }> {
    const arg = {
      relation: 'mentor',
      select: ['assessment.id', 'mentor.id', 'mentor.name', 'mentor.role',
        'assessment.title', 'assessment.deadline', 'assessment.createdAt'],
      where: mentor != null ? ['assessment.mentor = :mentor', { mentor }] : [],
      entity: 'assessment',
    };
    return super.fetchAll(this.AssessmentEntity, arg);
  }
}
