import { Request, Response, NextFunction } from 'express';

import Controller from '.';
import UserServices from '../services/User';
import JWT from '../utils/Jwt';

export default class User extends Controller {
  Jwt: typeof JWT;

  UserServices: typeof UserServices;

  constructor(Services = UserServices, Jwt = JWT) {
    super(Services);
    this.UserServices = Services;
    this.Jwt = Jwt;
    this.setJWT = this.setJWT.bind(this);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.updateOne = this.updateOne.bind(this);
  }

  setJWT(req: Request, res: Response, next: NextFunction) {
    const { generate } = new this.Jwt();
    generate(res.locals[this.constructor.name].data.id).then((token) => {
      res.locals[this.constructor.name].token = token;
      next();
    }).catch(next);
  }

  async signup({
    body: {
      email, name, password, role,
    },
  }: Request, res: Response, next: NextFunction): Promise<void> {
    const { signup } = new this.UserServices();
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

  async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const { login } = new this.UserServices();
    return this.handleService({
      method: login, res, next, arg: body,
    });
  }

  auth({ headers: { token } }: Request, res: Response, next: NextFunction): void {
    const { verify } = new this.Jwt();
    verify(`${token}`)
      .then(async ({ id }: any) => {
        const { auth } = new this.UserServices();
        res.locals.authorized = await auth(id).catch(next);
        next();
      })
      .catch(next);
  }

  async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { listAll } = new this.UserServices();
    return this.handleService({
      method: listAll,
      res,
      next,
      arg: undefined,
    });
  }

  async verifyOne({ params: { id } }: Request, res: Response, next: NextFunction): Promise<void> {
    const { auth } = new this.UserServices();
    return this.handleService({
      method: auth,
      res,
      next,
      arg: id,
    });
  }

  async updateOne(
    { body }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { updateUser } = new this.UserServices();
    res.locals[this.constructor.name] = await updateUser(body, res.locals[this.constructor.name])
      .catch(next);
    next();
  }
}
