import { Request, Response, NextFunction } from 'express';

interface handleServiceFields {
    method: Function;
    res: Response;
    next: NextFunction;
    status?: number;
    arg: unknown;

}

export default abstract class Controller {
  constructor() {
    this.dispatchResponse = this.dispatchResponse.bind(this);
    this.handleService = this.handleService.bind(this);
  }

  handleService({
    method, res, next, status = 200, arg,
  }: handleServiceFields): void {
    method(arg).catch(next).then((data: any) => {
      res.locals[this.constructor.name] = data;
      res.status(status);
      next();
    }).catch(next);
  }

  dispatchResponse(req: Request, res: Response): void {
    res.status(res.statusCode ?? 200).json({ success: { ...res.locals[this.constructor.name] } });
  }
}
