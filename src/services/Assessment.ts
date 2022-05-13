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
    this.getAssessmentById = this.getAssessmentById.bind(this);
  }

  readAssessmentEntity() {
    return this.AssessmentEntity;
  }

  async createAssessment(arg: any & AssessmentFields, mentor: UserFields) {
    let optMentor: any;
    if (arg.mentorId != null) {
      await this.isAdmin(mentor);
      await this.validateId(arg.mentor);
      optMentor = await this.fetchOne(
        this.readUserEntity(),
        { where: { id: arg.mentorId } },
      );
    }
    const data = await this.createOne(
      this.AssessmentEntity,
      { ...arg, mentor: optMentor ?? mentor },
    );
    return { message: 'Assessment successfully created', data };
  }

  async listAssessments(mentor: string): Promise<{ message: string, data: Array<unknown> }> {
    const arg = {
      relation: 'mentor',
      select: ['assessment.id', 'mentor.id', 'mentor.name', 'mentor.role',
        'assessment.title', 'assessment.deadline', 'assessment.createdAt'],
      where: mentor != null ? ['assessment.mentor = :mentor', { mentor }] : [],
      entity: 'assessment',
    };
    const data = await this.fetchAll(this.AssessmentEntity, arg);
    return { message: 'Assessments successfully retrieved', data };
  }

  async getAssessmentById(id: string) {
    await this.validateId(id, true);
    const data = await this.fetchOne(this.AssessmentEntity, { where: { id } });
    return { message: 'Assessment successfully retrieved', data };
  }

  async updateAssessmentById(
    id: string,
    arg: any & AssessmentFields,
    user: any & UserFields,
  ) {
    await this.isRestricted(user);
    await this.validateId(id);
    const data = user.role === 'admin'
      ? await this.updateOne(this.AssessmentEntity, { where: { id } }, arg)
      : await this.updateOne(this.AssessmentEntity, { where: { id, mentor: user } }, arg);
    return { message: 'Assessment successfully updated', data };
  }

  async deleteAssessmentById(id: string, user: any & UserFields) {
    await this.isRestricted(user);
    await this.validateId(id);
    if (user.role === 'admin') await this.deleteOne(this.AssessmentEntity, { where: { id } });
    else await this.deleteOne(this.AssessmentEntity, { where: { id, mentor: user } });
    return { message: 'Assessment successfully deleted' };
  }
}
