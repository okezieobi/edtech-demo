import { Request, Response, NextFunction } from 'express';

import Controller from '.';
import JWT from '../utils/Jwt';
import UserServices from '../services/User';

export default class User extends Controller {
  UserServices: typeof UserServices;

  Jwt: typeof JWT;

  constructor(Services = UserServices, Jwt = JWT) {
    super();
    this.UserServices = Services;
    this.Jwt = Jwt;
    this.setJWT = this.setJWT.bind(this);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.auth = this.auth.bind(this);
    this.listAll = this.listAll.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.createOne = this.createOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  setJWT(req: Request, res: Response, next: NextFunction) {
    const { generate } = new this.Jwt();
    generate(res.locals[this.constructor.name].data.id).then((token) => {
      res.locals[this.constructor.name].token = token;
      next();
    }).catch(next);
  }

  async signup({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const { signup } = new this.UserServices();
    await this.handleService({
      method: signup, res, next, arg: body, status: 201,
    });
  }

  async createOne({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const { createUser } = new this.UserServices();
    res.locals[this.constructor.name] = await createUser(body, res.locals.authorized).catch(next);
    res.status(201);
    next();
  }

  async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const { login } = new this.UserServices();
    await this.handleService({
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

  async getOne({ params: { id } }: Request, res: Response, next: NextFunction): Promise<void> {
    const { getUserById } = new this.UserServices();
    res.locals[this.constructor.name] = await getUserById(id, res.locals.authorized).catch(next);
    next();
  }

  async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { listUsers } = new this.UserServices();
    await this.handleService({
      method: listUsers,
      res,
      next,
      arg: res.locals.authorized,
    });
  }

  async updateOne(
    { params: { id }, body }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { updateUserById } = new this.UserServices();
    res.locals[this.constructor.name] = await updateUserById(id, res.locals.authorized, body)
      .catch(next);
    next();
  }

  async deleteOne({ params: { id } }: Request, res: Response, next: NextFunction) {
    const { deleteUserById } = new this.UserServices();
    res.locals[this.constructor.name] = await deleteUserById(id, res.locals.authorized);
    next();
  }
}
