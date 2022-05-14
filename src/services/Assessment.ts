import Assessment, { AssessmentFields } from '../entities/Assessment';
import { UserFields } from '../entities/User';
import User from './User';

export default class AssessmentServices extends User {
  private Assessment: typeof Assessment;

  constructor(entityClass = Assessment) {
    super();
    this.Assessment = entityClass;
    this.listAssessments = this.listAssessments.bind(this);
    this.createAssessment = this.createAssessment.bind(this);
    this.readAssessmentEntity = this.readAssessmentEntity.bind(this);
    this.getAssessmentById = this.getAssessmentById.bind(this);
    this.updateAssessmentById = this.updateAssessmentById.bind(this);
    this.deleteAssessmentById = this.deleteAssessmentById.bind(this);
  }

  readAssessmentEntity() {
    return this.Assessment;
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
      this.Assessment,
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
    const data = await this.fetchAll(this.Assessment, arg);
    return { message: 'Assessments successfully retrieved', data };
  }

  async getAssessmentById(id: string) {
    await this.validateId(id, true);
    const data = await this.fetchOne(this.Assessment, { where: { id } });
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
      ? await this.updateOne(this.Assessment, { where: { id } }, arg)
      : await this.updateOne(this.Assessment, { where: { id, mentor: user } }, arg);
    return { message: 'Assessment successfully updated', data };
  }

  async deleteAssessmentById(id: string, user: any & UserFields) {
    await this.isRestricted(user);
    await this.validateId(id);
    if (user.role === 'admin') await this.deleteOne(this.Assessment, { where: { id } });
    else await this.deleteOne(this.Assessment, { where: { id, mentor: user } });
    return { message: 'Assessment successfully deleted' };
  }
}
