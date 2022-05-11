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
  MainServices: typeof MainServices;

  constructor(Services: any) {
    this.MainServices = Services;
    this.isOwner = this.isOwner.bind(this);
    this.dispatchResponse = this.dispatchResponse.bind(this);
    this.handleService = this.handleService.bind(this);
    this.useOwner = this.useOwner.bind(this);
  }

  async handleService({
    method, res, next, status = 200, arg,
  }: handleServiceParams): Promise<void> {
    res.locals[this.constructor.name] = await method(arg).catch(next);
    res.status(status);
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

  useOwner(relation: string) {
    return async ({ body, query }: Request, res: Response, next: NextFunction) => {
      if (body[relation] != null || query[relation] != null) {
        const { fetchOne, validateId } = new this.MainServices();
        await validateId(body[relation] ?? query[relation]);
        res.locals[relation] = await fetchOne(body[relation] ?? query[relation]).catch(next);
        next();
      } else next();
    };
  }
}
