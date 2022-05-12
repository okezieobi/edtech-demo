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
    const { createOne, readUserEntity } = new this.UserServices();
    res.locals[this.constructor.name] = await createOne(readUserEntity(), body).catch(next);
    delete res.locals[this.constructor.name].data.password;
    res.locals[this.constructor.name].message = `${this.constructor.name} successfully signed up`;
    res.status(201);
    next();
  }

  async createOne({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const { createOne, readUserEntity } = new this.UserServices();
    res.locals[this.constructor.name] = await createOne(readUserEntity(), body).catch(next);
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

  async getOne({ params: { id } }: Request, res: Response, next: NextFunction): Promise<void> {
    const { validateId, readUserEntity, getOne } = new this.UserServices();
    await validateId(id).catch(next);
    res.locals[this.constructor.name] = await getOne(
      readUserEntity(),
      { where: { id } },
    ).catch(next);
    next();
  }

  async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { listUsers } = new this.UserServices();
    return this.handleService({
      method: listUsers,
      res,
      next,
      arg: undefined,
    });
  }

  async updateOne(
    { params: { id }, body }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { updateOne, readUserEntity, validateId } = new this.UserServices();
    await validateId(id).catch(next);
    res.locals[this.constructor.name] = await updateOne(readUserEntity(), body, { where: { id } })
      .catch(next);
    delete res.locals[this.constructor.name].data.password;
    next();
  }

  async deleteOne({ params: { id } }: Request, res: Response, next: NextFunction) {
    const { deleteOne, readUserEntity, validateId } = new this.UserServices();
    await validateId(id).catch(next);
    res.locals[this.constructor.name] = await deleteOne(readUserEntity(), { where: { id } });
    next();
  }
}
