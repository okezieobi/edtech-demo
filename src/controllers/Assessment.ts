// import { Request, Response, NextFunction } from 'express';

// import Controller from '.';
// import AssessmentServices from '../services/Assessment';

// export default class Assessment extends Controller {
//   AssessmentServices: typeof AssessmentServices;

//   constructor(Services = AssessmentServices) {
//     super();
//     this.AssessmentServices = Services;
//     this.createOne = this.createOne.bind(this);
//     this.listAll = this.listAll.bind(this);
//     this.getOne = this.getOne.bind(this);
//     this.updateOne = this.updateOne.bind(this);
//     this.deleteOne = this.deleteOne.bind(this);
//   }

//   async createOne(
//     { body }: Request,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> {
//     const { createAssessment } = new this.AssessmentServices();
//     res.locals[this.constructor.name] = await await createAssessment(body, res.locals.authorized)
//       .catch(next);
//     res.status(201);
//     next();
//   }

//   async listAll({ query }: Request, res: Response, next: NextFunction): Promise<void> {
//     const { listAssessments } = new this.AssessmentServices();
//     return this.handleService({
//       method: listAssessments,
//       res,
//       next,
//       arg: query.mentor,
//     });
//   }

//   async getOne({ params: { id } }: Request, res: Response, next: NextFunction): Promise<void> {
//     const { getAssessmentById } = new this.AssessmentServices();
//     await this.handleService({
//       method: getAssessmentById, res, next, arg: id,
//     });
//   }

//   async updateOne(
//     { body, params }: Request,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> {
//     const { updateAssessmentById } = new this.AssessmentServices();
//     res.locals[this.constructor.name] = await updateAssessmentById(
//       params.id,
//       body,
//       res.locals.authorized,
//     ).catch(next);
//     next();
//   }

//   async deleteOne({ params: { id } }: Request, res: Response, next: NextFunction) {
//     const { deleteAssessmentById } = new this.AssessmentServices();
//     await this.handleService({
//       method: deleteAssessmentById, res, next, arg: id,
//     });
//   }
// }
