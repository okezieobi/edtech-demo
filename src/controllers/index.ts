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
    this.getOne = this.getOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.isOwner = this.isOwner.bind(this);
    this.dispatchResponse = this.dispatchResponse.bind(this);
    this.handleService = this.handleService.bind(this);
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
    res.locals[this.constructor.name] = await updateOne(body, res.locals[this.constructor.name])
      .catch(next);
    next();
  }

  dispatchResponse(req: Request, res: Response): void {
    res.status(res.statusCode ?? 200).send({ status: 'success', ...res.locals[this.constructor.name] });
  }

  static isAdmin(req: Request, res: Response, next: NextFunction) {
    if (res.locals.authorized.role === 'admin') next();
    else {
      next({ message: 'User role must be admin', type: 'Forbidden', data: { timestamp: new Date() } });
    }
  }

  static isRestricted(req: Request, res: Response, next: NextFunction) {
    if (res.locals.authorized.role === 'student') {
      next({ message: 'User role must be admin or a mentor', type: 'Forbidden', data: { timestamp: new Date() } });
    } else next();
  }

  isOwner(role: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (res.locals.authorized.id !== res.locals[this.constructor.name][role].id) {
        res.status(403);
        next({ message: `Only Users with role as ${role} can read or write to ${res.locals[this.constructor.name]} they own`, type: 'Forbidden', data: { timestamp: new Date() } });
      } else next();
    };
  }
}
