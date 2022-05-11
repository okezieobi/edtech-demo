import { Request, Response, NextFunction } from 'express';

import Controller from '.';
import AssessmentServices from '../services/Assessment';

export default class Assessment extends Controller {
  AssessmentServices: typeof AssessmentServices;

  constructor(Services = AssessmentServices) {
    super(Services);
    this.AssessmentServices = Services;
    this.createOne = this.createOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
  }

  async createOne(
    {
      body: {
        title, description, deadline,
      },
    }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { createOne } = new this.AssessmentServices();
    return this.handleService({
      method: createOne,
      res,
      next,
      arg: {
        title, description, deadline, mentor: res.locals.mentor ?? res.locals.authorized,
      },
      status: 201,
    });
  }

  async listAll({ query }: Request, res: Response, next: NextFunction): Promise<void> {
    const { listAll } = new this.AssessmentServices();
    return this.handleService({
      method: listAll,
      res,
      next,
      arg: query.mentor,
    });
  }

  async verifyOne({ params: { id } }: Request, res: Response, next: NextFunction): Promise<void> {
    const { verifyOne } = new this.AssessmentServices();
    res.locals[this.constructor.name] = await verifyOne(id).catch(next);
    next();
  }

  async updateOne(
    {
      body: {
        title, description, deadline,
      },
    }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { updateOne } = new this.AssessmentServices();
    res.locals[this.constructor.name] = await updateOne(
      {
        title, description, deadline, mentor: res.locals.mentor ?? res.locals.authorized,
      },
      res.locals[this.constructor.name],
    ).catch(next);
    next();
  }
}
