import { Request, Response, NextFunction } from 'express';

import Controller from '.';
import AssessmentServices from '../services/Assessment';

export default class Assessment extends Controller {
  AssessmentServices: typeof AssessmentServices;

  constructor(Services = AssessmentServices) {
    super();
    this.AssessmentServices = Services;
    this.createOne = this.createOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
  }

  async createOne(
    { body }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { createAssessment } = new this.AssessmentServices();
    return this.handleService({
      method: createAssessment,
      res,
      next,
      arg: { ...body, mentor: res.locals.authorized },
      status: 201,
    });
  }

  async listAll({ query }: Request, res: Response, next: NextFunction): Promise<void> {
    const { listAssessments } = new this.AssessmentServices();
    return this.handleService({
      method: listAssessments,
      res,
      next,
      arg: query.mentor,
    });
  }

  async getOne({ params: { id } }: Request, res: Response, next: NextFunction): Promise<void> {
    const { getOne, validateId, readAssessmentEntity } = new this.AssessmentServices();
    await validateId(id).catch(next);
    res.locals[this.constructor.name] = await getOne(
      readAssessmentEntity,
      { where: { id } },
    ).catch(next);
    next();
  }

  async updateOne(
    { body, params }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { updateOne, readAssessmentEntity } = new this.AssessmentServices();
    res.locals[this.constructor.name] = await updateOne(
      readAssessmentEntity(),
      { where: { id: params.id, mentor: body.mentor ?? res.locals.authorized } },
      body,
    ).catch(next);
    next();
  }
}
