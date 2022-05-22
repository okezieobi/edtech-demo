import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ValidationError } from 'class-validator';

interface ResponseError extends Error {
    error: any;
}

const handleJwtError = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
        res.status(401);
        next({
            error: {
                name: err.name,
                message: err.message,
                data: {
                    param: 'token',
                    location: 'headers',
                    summary: 'Verification of jwt failed',
                },
            },
        });
    } else next(err);
};

const handleUniqueErr = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err.name === 'Not') {
        res.status(404);
        next({
            error: {
                name: err.name,
                message: err.message,
            },
        });
    } else next(err);
};

const handleValidationError = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (
        err.constructor.name === 'ValidationError' ||
        err[0] instanceof ValidationError
    ) {
        res.status(err?.errorCode ?? err?.contexts?.errorCode ?? 400);
        next({
            error: {
                name: err.name,
                message: err.message,
                data: err,
            },
        });
    } else next(err);
};

const handlePassWordErr = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err.name === 'PasswordError') {
        res.status(401);
        next({
            error: {
                name: err.name,
                message: err.message,
            },
        });
    } else next(err);
};

const dispatchClientError = (
    err: ResponseError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (res.statusCode > 399 || res.statusCode < 500)
        res.send({ error: err.error });
    else next(err);
};

export default [
    handleJwtError,
    handleUniqueErr,
    handleValidationError,
    handlePassWordErr,
    dispatchClientError,
];
