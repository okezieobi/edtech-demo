import { Request, Response, NextFunction } from 'express';

import Controller from '.';
import JWT from '../utils/Jwt';
import UserServices from '../services/User';

export default class User extends Controller {
  UserServices: typeof UserServices;

  Jwt: typeof JWT;

  constructor(Services = UserServices, Jwt = JWT) {
    super(Services);
    this.UserServices = Services;
    this.Jwt = Jwt;
    this.setJWT = this.setJWT.bind(this);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.listAll = this.listAll.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.createOne = this.createOne.bind(this);
  }

  setJWT(req: Request, res: Response, next: NextFunction) {
    const { generate } = new this.Jwt();
    generate(res.locals[this.constructor.name].data.id).then((token) => {
      res.locals[this.constructor.name].token = token;
      next();
    }).catch(next);
  }

  async signup({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const { createOne } = new this.UserServices();
    res.locals[this.constructor.name] = await createOne(body).catch(next);
    delete res.locals[this.constructor.name].data.password;
    res.locals[this.constructor.name].message = `${this.constructor.name} successfully signed up`;
    res.status(201);
    next();
  }

  async createOne({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const { createOne } = new this.UserServices();
    res.locals[this.constructor.name] = await createOne(body).catch(next);
    delete res.locals[this.constructor.name].data.password;
    res.status(201);
    next();
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

  async updateOne(
    { body }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { updateOne } = new this.UserServices();
    res.locals[this.constructor.name] = await updateOne(body, res.locals[this.constructor.name])
      .catch(next);
    delete res.locals[this.constructor.name].data.password;
    next();
  }
}
