// import Assessment, { AssessmentFields } from '../models/Assessment';
// import User, { UserFields } from '../models/User';
// import IsValidFields from '../validators';

// export default class AssessmentServices extends IsValidFields {
//   constructor(model = { Assessment, User }, key = 'assessment') {
//     super(model, key);
//     this.listAssessments = this.listAssessments.bind(this);
//     this.createAssessment = this.createAssessment.bind(this);
//     this.getAssessmentById = this.getAssessmentById.bind(this);
//     this.updateAssessmentById = this.updateAssessmentById.bind(this);
//     this.deleteAssessmentById = this.deleteAssessmentById.bind(this);
//   }

//   async createAssessment(arg: any & AssessmentFields, user: User & UserFields) {
//     await this.isRestricted(user);
//     let result: any;
//     if (arg.mentorId != null) {
//       await this.isAdmin(user);
//       await this.isUUID(arg.mentorId);
//       const mentor = await this.model.User.findByPk(arg.mentorId, { attributes: { include: ['password'] } });
//       await this.isFound(mentor);
//       result.data = await mentor?.$create('assessment', arg);
//     }
//     result.data = await user.$create('assessment', arg);
//     result.message = { message: 'Assessment successfully created' };
//     return result;
//   }

//   async listAssessments(mentor: string): Promise<{ message: string, data: Array<unknown> }> {
//     const data = mentor == null ? await this.model.Assessment.findAll(
//       {
//         include: {
//           model: this.model.User,
//           attributes: {
//             include: ['id', 'mentor.id', 'mentor.name', 'mentor.role',
//               'title', 'deadline', 'createdAt'],
//           },
//         },
//       },
//     ) : await this.model.Assessment.findAll(
//       {
//         include: {
//           model: this.model.User,
//           where: { mentorId: mentor },
//           attributes: {
//             include: ['id', 'mentor.id', 'mentor.name', 'mentor.role',
//               'title', 'deadline', 'createdAt'],
//           },
//         },
//       },
//     );
//     return { message: 'Assessments successfully retrieved', data };
//   }

//   async getAssessmentById(id: string) {
//     await this.isUUID(id);
//     const data = await this.model.Assessment.findByPk(
//       id,
//       { include: { model: this.model.User, attributes: { exclude: ['password'] } } },
//     );
//     return { message: 'Assessment successfully retrieved', data };
//   }

//   async updateAssessmentById(
//     id: string,
//     arg: any & AssessmentFields,
//     user: any & UserFields,
//     userId: string,
//   ) {
//     await this.isRestricted(user);
//     await this.isUUID(id);
//     let result: any;
//     if (user.role === 'admin') {
//       const mentor = await this.model.User.findByPk(userId, { attributes: { exclude: ['password'] } });
//       await this.isFound(mentor);
//     }
//     // const data = user.role === 'admin'
//     //   ? await this.updateOne(this.Assessment, { where: { id } }, arg)
//     //   : await this.updateOne(this.Assessment, { where: { id, mentor: user } }, arg);
//     return { message: 'Assessment successfully updated', data };
//   }

//   async deleteAssessmentById(id: string, user: any & UserFields) {
//     // await this.isRestricted(user);
//     // await this.validateId(id);
//     // if (user.role === 'admin') await this.deleteOne(this.Assessment, { where: { id } });
//     // else await this.deleteOne(this.Assessment, { where: { id, mentor: user } });
//     return { message: 'Assessment successfully deleted' };
//   }
// }
