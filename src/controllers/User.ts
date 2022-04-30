import { Request, Response, NextFunction } from 'express';

import Controller, { ControllerParam } from '.';
import UserServices from '../services/User';
import JWT from '../utils/Jwt';

interface UserControllerParams extends ControllerParam {
  Jwt: typeof JWT;
  Service: typeof UserServices;
}

export default class UserController extends Controller implements UserControllerParams {
  Jwt: typeof JWT;

  Service: typeof UserServices;

  constructor(Service = UserServices, Jwt = JWT, key = 'user') {
    super(key);
    this.Service = Service;
    this.Jwt = Jwt;
    this.setJWT = this.setJWT.bind(this);
    this.signupUser = this.signupUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.authUser = this.authUser.bind(this);
  }

  setJWT(req: Request, res: Response, next: NextFunction) {
    new this.Jwt().generate(res.locals.user.data.id)
      .then((token) => {
        if (token) {
          res.locals.user.data.token = token;
          next();
        }
      }).catch(next);
  }

  static isAdmin(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user.role === 'admin') next();
    else {
      res.status(403);
      next({ isClient: true, response: { status: 'error', message: 'User must be an admin', data: { timestamp: new Date() } } });
    }
  }

  signupUser({
    body: {
      email, name, password, role,
    },
  }: Request, res: Response, next: NextFunction) {
    const { signupUser } = new this.Service();
    return this.handleService({
      method: signupUser,
      res,
      next,
      arg: {
        email, name, password, role,
      },
      status: 201,
    });
  }

  loginUser({ body }: Request, res: Response, next: NextFunction) {
    const { loginUser } = new this.Service();
    return this.handleService({
      method: loginUser, res, next, arg: body,
    });
  }

  authUser({ headers: { token } }: Request, res: Response, next: NextFunction) {
    new this.Jwt().verify(`${token}`)
      .then(({ id }: any) => {
        const { authUser } = new this.Service();
        this.handleService({
          method: authUser, res, next, arg: id,
        });
      })
      .catch(next);
  }
}
