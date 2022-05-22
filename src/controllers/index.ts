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
        method,
        res,
        next,
        status = 200,
        arg,
    }: handleServiceFields): void {
        method(arg)
            .then((data: any) => {
                res.locals[this.constructor.name] = data;
                res.status(status);
                next();
            })
            .catch(next);
    }

    dispatchResponse(req: Request, res: Response, next: NextFunction): void {
        if (res.locals[this.constructor.name] == null)
            next({ message: 'Entity is null' });
        else
            res.status(res.statusCode).send({
                success: { ...res.locals[this.constructor.name] },
            });
    }
}
