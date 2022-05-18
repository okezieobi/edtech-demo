import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
// import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { ValidationError } from 'class-validator';

import AppError from '../Error';

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
  { headers }: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    res.status(401);
    next({
      isClient: errorMarkers.isClient,
      response: {
        status: errorMarkers.status,
        message: err.message,
        data: {
          name: err.name,
          param: 'token',
          location: 'headers',
          value: headers.token,
          msg: 'Verification of jwt failed',
          timestamp: errorMarkers.timestamp,
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

// const handleSQLErr = (err: Error, req: Request, res: Response, next: NextFunction): void => {
//   if (err instanceof QueryFailedError) {
//     res.status(400);
//     next({
//       isClient: errorMarkers.isClient,
//       response: {
//         status: errorMarkers.status,
//         message: err.message,
//         data: { type: 'SQLQueryError', ...err.driverError, timestamp: errorMarkers.timestamp },
//       },
//     });
//   } else next(err);
// };

const handleValidationError = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err.constructor.name === 'ValidationError' || err[0] instanceof ValidationError) {
    res.status(err?.contexts?.errorCode ?? 400);
    next({
      isClient: errorMarkers.isClient,
      response: {
        status: errorMarkers.status,
        message: err.message,
        data: { type: 'ValidationError', ...err, timestamp: errorMarkers.timestamp },
      },
    });
  } else next(err);
};

const handleCustomError = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error = { status: errorMarkers.status, message: err.message, data: err.data };
  switch (err.type) {
    case 'Authorization':
      res.status(401);
      next({ isClient: errorMarkers.isClient, response: error });
      break;
    case 'Forbidden':
      res.status(403);
      next({ isClient: errorMarkers.isClient, response: error });
      break;
    case 'NotFound':
      res.status(404);
      next({ isClient: errorMarkers.isClient, response: error });
      break;
    default:
      next(err);
  }
};

const dispatchClientError = ((
  err: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err.isClient) res.send(err.response);
  else next(err);
});

export default [
  handleJwtError,
  // handleEntityNotFoundErr,
  // handleSQLErr,
  handleValidationError,
  handleCustomError,
  dispatchClientError];
