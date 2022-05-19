import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ValidationError } from 'class-validator';

interface ResponseError extends Error {
    isClient: boolean;
    response: object;
}

const errorMarkers = {
  status: 'error',
  isClient: true,
  timestamp: new Date(),
};

const handleJwtError = (
  err: Error,
  req : Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    res.status(401);
    next({
      response: {
        status: errorMarkers.status,
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

// const handleEntityNotFoundErr = (
//   err: Error,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void => {
//   if (err instanceof EntityNotFoundError) {
//     res.status(404);
//     next({
//       isClient: errorMarkers.isClient,
//       response: {
//         status: errorMarkers.status,
//         ...err,
//         data: {
//           timestamp: errorMarkers.timestamp,
//         },
//       },
//     });
//   } else next(err);
// };

const handleUniqueErr = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(422);
    next({
      response: {
        status: errorMarkers.status,
        name: err.name,
        message: err.message,
        data: err.errors,
      },
    });
  } else next(err);
};

const handleValidationError = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err.constructor.name === 'ValidationError' || err[0] instanceof ValidationError) {
    res.status(err?.errorCode ?? err?.contexts?.errorCode ?? 400);
    next({
      response: {
        status: errorMarkers.status,
        name: err.name,
        message: err.message,
        data: err,
      },
    });
  } else next(err);
};

const handlePassWordErr = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'PasswordError') {
    res.status(401);
    next({
      response: {
        status: errorMarkers.status,
        name: err.name,
        message: err.message,
      },
    });
  } else next(err);
};

// const handleCustomError = (
//   err: AppError,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void => {
//   const error = {
//     status: errorMarkers.status, name: err.name, message: err.message, data: err.data,
//   };
//   switch (err.type) {
//     case 'Authorization':
//       res.status(401);
//       next({ response: error });
//       break;
//     case 'Forbidden':
//       res.status(403);
//       next({ response: error });
//       break;
//     case 'NotFound':
//       res.status(404);
//       next({ response: error });
//       break;
//     default:
//       next(err);
//   }
// };

const dispatchClientError = ((
  err: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.statusCode) res.send(err.response);
  else next(err);
});

export default [
  handleJwtError,
  // handleEntityNotFoundErr,
  handleUniqueErr,
  handleValidationError,
  // handleCustomError,
  handlePassWordErr,
  dispatchClientError];
