import { Request, Response, NextFunction } from 'express';

import MainServices from '../services';

interface handleServiceParams {
    method: Function;
    res: Response;
    next: NextFunction;
    status?: number;
    arg: unknown;

}

export default abstract class Controller {
  Services: typeof MainServices;

  constructor(Services: typeof MainServices) {
    this.Services = Services;
    this.createOne = this.createOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.updateOne = this.deleteOne.bind(this);
    this.dispatchResponse = this.dispatchResponse.bind(this);
    this.handleService = this.handleService.bind(this);
  }

  async createOne({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const { createOne } = new this.Services();
    res.locals[this.constructor.name] = await createOne(body).catch(next);
    res.status(201);
    next();
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { getOne } = new this.Services();
    res.locals[this.constructor.name] = await getOne(res.locals[this.constructor.name]);
    next();
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    const { deleteOne } = new this.Services();
    res.locals[this.constructor.name] = await deleteOne(res.locals[this.constructor.name])
      .catch(next);
    next();
  }

  async handleService({
    method, res, next, status = 200, arg,
  }: handleServiceParams): Promise<void> {
    res.locals[this.constructor.name] = await method(arg).catch(next);
    res.status(status);
    next();
  }

  async updateOne(
    { body }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { updateOne } = new this.Services();
    res.locals[this.constructor.name] = await updateOne(body, this.constructor.name).catch(next);
    next();
  }

  dispatchResponse(req: Request, res: Response): void {
    res.status(res.statusCode ?? 200).send({ status: 'success', ...res.locals[this.constructor.name] });
  }
}
