import { Request, Response, NextFunction } from 'express';

import Controller, { ControllerParam } from '.';
import AssessmentServices from '../services/Assessment';
import UserServices from '../services/User';

interface AssessmentControllerParams extends ControllerParam {
  Service: typeof AssessmentServices;
  UserService: typeof UserServices;
}

export default class AssessmentController extends Controller implements AssessmentControllerParams {
  Service: typeof AssessmentServices;

  UserService: typeof UserServices;

  constructor(Service = AssessmentServices, UserService = UserServices, key = 'assessment') {
    super(key);
    this.Service = Service;
    this.UserService = UserService;
    this.createOne = this.createOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.isOwner = this.isOwner.bind(this);
  }

  async createOne(
    { body: { title, description, deadline } }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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

  async listAll({ query: { mentor } }: Request, res: Response, next: NextFunction): Promise<void> {
    const { listAll } = new this.Service();
    return this.handleService({
      method: listAll,
      res,
      next,
      arg: mentor,
    });
  }

  async verifyOne({ params: { id } }: Request, res: Response, next: NextFunction): Promise<void> {
    const { verifyOne } = new this.Service();
    res.locals[this.key] = await verifyOne(id).catch(next);
    next();
  }

  isOwner(req: Request, res: Response, next: NextFunction): void {
    if (res.locals.authorized.id !== res.locals[this.key].mentor.id) {
      res.status(403);
      next({ isClient: true, response: { status: 'error', message: 'Users with role as mentor can only edit or delete they own', data: { timestamp: new Date() } } });
    } else next();
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { getOne } = this.Service;
    return this.handleService({
      method: getOne,
      res,
      next,
      arg: res.locals[this.key],
    });
  }

  async updateOne(
    {
      body: {
        title, description, deadline, mentorId,
      },
    }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { updateOne } = new this.Service();
    let mentor: unknown;
    if (mentorId != null) {
      const { auth } = new this.UserService();
      mentor = await auth(mentorId).catch(next);
    }
    res.locals[this.key] = await updateOne(
      {
        title, description, deadline, mentor: mentor ?? res.locals.authorized,
      },
      res.locals[this.key],
    ).catch(next);
    next();
  }

  async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { deleteOne } = new this.Service();
    return this.handleService({
      method: deleteOne,
      res,
      next,
      arg: res.locals[this.key],
    });
  }
}
