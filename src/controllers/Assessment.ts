import { Request, Response, NextFunction } from 'express';

import Controller from '.';
import AssessmentServices from '../services/Assessment';
import UserServices from '../services/User';

export default class Assessment extends Controller {
  UserService: typeof UserServices;

  AssessmentServices: typeof AssessmentServices;

  constructor(Services = AssessmentServices, UserService = UserServices) {
    super(Services);
    this.AssessmentServices = Services;
    this.UserService = UserService;
    this.createOne = this.createOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.useMentor = this.useMentor.bind(this);
    this.isOwnerMentor = this.isOwnerMentor.bind(this);
  }

  async useMentor({ body: { mentorId } }: Request, res: Response, next: NextFunction) {
    if (mentorId != null) {
      const { auth } = new this.UserService();
      res.locals.mentor = await auth(mentorId).catch(next);
      next();
    } else next();
  }

  async createOne(
    { body: { title, description, deadline } }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { createOne } = new this.Services();
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

  async listAll({ query: { mentor } }: Request, res: Response, next: NextFunction): Promise<void> {
    const { listAll } = new this.AssessmentServices();
    return this.handleService({
      method: listAll,
      res,
      next,
      arg: mentor,
    });
  }

  async verifyOne({ params: { id } }: Request, res: Response, next: NextFunction): Promise<void> {
    const { verifyOne } = new this.AssessmentServices();
    res.locals[this.constructor.name] = await verifyOne(id).catch(next);
    next();
  }

  isOwnerMentor(req: Request, res: Response, next: NextFunction): void {
    if (res.locals.authorized.id !== res.locals[this.constructor.name].mentor.id) {
      res.status(403);
      next({ isClient: true, response: { status: 'error', message: 'Users with role as mentor can only edit or delete they own', data: { timestamp: new Date() } } });
    } else next();
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
    const { updateOne } = new this.Services();
    res.locals[this.constructor.name] = await updateOne(
      {
        title, description, deadline, mentor: res.locals.mentor ?? res.locals.authorized,
      },
      res.locals[this.constructor.name],
    ).catch(next);
    next();
  }
}
