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

  async handleService({
    method, res, next, status = 200, arg,
  }: handleServiceFields): Promise<void> {
    res.locals[this.constructor.name] = await method(arg).catch(next);
    res.status(status);
    next();
  }

  dispatchResponse(req: Request, res: Response): void {
    res.status(res.statusCode ?? 200).json({ status: 'success', ...res.locals[this.constructor.name] });
  }
}
