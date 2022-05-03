import { Request, Response, NextFunction } from 'express';

interface handleServiceParams {
    method: Function;
    res: Response;
    next: NextFunction;
    status?: number;
    arg: unknown;

}

interface ControllerParam {
  key: string;
}

export default abstract class Controller implements ControllerParam {
  key: string;

  constructor(key: string = 'main') {
    this.dispatchResponse = this.dispatchResponse.bind(this);
    this.handleService = this.handleService.bind(this);
    this.key = key;
  }

  async handleService({
    method, res, next, status = 200, arg,
  }: handleServiceParams) {
    const data = await method(arg).catch(next);
    if (data == null) next('Service error');
    else {
      res.locals[this.key] = data;
      res.status(status);
      next();
    }
  }

  dispatchResponse(req: Request, res: Response) {
    res.send({ status: 'success', ...res.locals[this.key] });
  }
}

export { ControllerParam };
