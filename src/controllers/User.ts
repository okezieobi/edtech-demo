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
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.listAll = this.listAll.bind(this);
  }

  async setJWT(req: Request, res: Response, next: NextFunction) {
    const token = await new this.Jwt().generate(res.locals.user.data.id).catch(next);
    if (token == null) next('Server error');
    else {
      res.locals.user.data.token = token;
      next();
    }
  }

  static isAdmin(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user.role === 'admin') next();
    else {
      res.status(403);
      next({ isClient: true, response: { status: 'error', message: 'User must be an admin', data: { timestamp: new Date() } } });
    }
  }

  static isRestricted(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user.role === 'student') {
      res.status(403);
      next({ isClient: true, response: { status: 'error', message: 'User must be an admin or a mentor', data: { timestamp: new Date() } } });
    } else next();
  }

  async signup({
    body: {
      email, name, password, role,
    },
  }: Request, res: Response, next: NextFunction) {
    const { signup } = new this.Service();
    return this.handleService({
      method: signup,
      res,
      next,
      arg: {
        email, name, password, role,
      },
      status: 201,
    });
  }

  async login({ body }: Request, res: Response, next: NextFunction) {
    const { login } = new this.Service();
    return this.handleService({
      method: login, res, next, arg: body,
    });
  }

  async auth({ headers: { token } }: Request, res: Response, next: NextFunction) {
    const payload: any = await new this.Jwt().verify(`${token}`).catch(next);
    const { auth } = new this.Service();
    const data = await auth(payload.id).catch(next);
    if (data == null) next('Service error');
    else {
      res.locals.authorized = data;
      next();
    }
  }

  async listAll(req: Request, res: Response, next: NextFunction) {
    const { listAll } = new this.Service();
    return this.handleService({
      method: listAll,
      res,
      next,
      arg: undefined,
    });
  }

  async verifyOne({ params: { id } }: Request, res: Response, next: NextFunction) {
    const { auth } = new this.Service();
    return this.handleService({
      method: auth,
      res,
      next,
      arg: id,
    });
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const { getOne } = new this.Service();
    return this.handleService({
      method: getOne,
      res,
      next,
      arg: res.locals.user,
    });
  }

  async updateOne(
    {
      body: {
        email, name, password, role,
      },
    }: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { updateOne } = new this.Service();
    const data = await updateOne(
      {
        email, name, password, role,
      },
      res.locals.user,
    ).catch(next);
    if (data == null) next('Service error');
    else {
      res.locals.user = data;
      next();
    }
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    const { deleteOne } = new this.Service();
    return this.handleService({
      method: deleteOne,
      res,
      next,
      arg: res.locals.user,
    });
  }
}
