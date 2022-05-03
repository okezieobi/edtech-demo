import { Request, Response, NextFunction } from 'express';

import Controller, { ControllerParam } from '.';
import AssessmentServices from '../services/Assessment';

interface AssessmentControllerParams extends ControllerParam {
    Service: typeof AssessmentServices;
}

export default class AssessmentController extends Controller implements AssessmentControllerParams {
  Service: typeof AssessmentServices;

  constructor(Service = AssessmentServices, key = 'assessment') {
    super(key);
    this.Service = Service;
    this.createOne = this.createOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  async createOne(
    { body: { title, description, deadline } }: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { createOne } = new this.Service();
    return this.handleService({
      method: createOne,
      res,
      next,
      arg: {
        title, description, deadline, mentor: res.locals.authorized,
      },
      status: 201,
    });
  }

  async listAll({ query: { mentor } }: Request, res: Response, next: NextFunction) {
    const { listAll } = new this.Service();
    return this.handleService({
      method: listAll,
      res,
      next,
      arg: mentor,
    });
  }

  async verifyOne({ params: { id } }: Request, res: Response, next: NextFunction) {
    const { verifyOne } = new this.Service();
    return this.handleService({
      method: verifyOne,
      res,
      next,
      arg: id,
    });
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const { getOne } = new this.Service();
    return this.handleService({
      method: getOne,
      res,
      next,
      arg: res.locals.assessment,
    });
  }

  async updateOne(
    { body: { title, description, deadline } }: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { updateOne } = new this.Service();
    const data = await updateOne(
      {
        title, description, deadline, mentor: res.locals.authorized,
      },
      res.locals.assessment,
    );
    if (data == null) next('Service error');
    else {
      res.locals.assessment = data;
      res.status(200);
      next();
    }
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    const { deleteOne } = new this.Service();
    return this.handleService({
      method: deleteOne,
      res,
      next,
      arg: res.locals.assessment,
    });
  }
}
