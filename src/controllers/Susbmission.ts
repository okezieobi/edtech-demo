import { Request, Response, NextFunction } from 'express';

import Controller from '.';
import SubmissionServices from '../services/Submission';

export default class Submission extends Controller {
  SubmissionServices: typeof SubmissionServices;

  constructor(Services = SubmissionServices) {
    super(Services);
    this.SubmissionServices = Services;
  }

  async listAll({ query: { owner } }: Request, res: Response, next: NextFunction): Promise<void> {
    const { listAll } = new this.SubmissionServices();
    return this.handleService({
      method: listAll,
      res,
      next,
      arg: owner,
    });
  }
}
