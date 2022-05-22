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
        this.generateJWT = this.generateJWT.bind(this);
        this.verifyJWT = this.verifyJWT.bind(this);
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.auth = this.auth.bind(this);
        this.listAll = this.listAll.bind(this);
        this.updateOne = this.updateOne.bind(this);
        this.createOne = this.createOne.bind(this);
        this.getOne = this.getOne.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }

    generateJWT(req: Request, res: Response, next: NextFunction) {
        if (res.locals[this.constructor.name] === {})
            next({ message: 'User services error' });
        else {
            const { generate } = new this.Jwt();
            generate(res.locals[this.constructor.name].data.id)
                .then((token) => {
                    res.locals[this.constructor.name].token = token;
                    next();
                })
                .catch(next);
        }
    }

    signup({ body }: Request, res: Response, next: NextFunction): void {
        const { signup } = new this.UserServices();
        this.handleService({
            method: signup,
            res,
            next,
            arg: body,
            status: 201,
        });
    }

    createOne({ body }: Request, res: Response, next: NextFunction): void {
        const { createUser } = new this.UserServices();
        createUser(body, res.locals.authorized)
            .then((data) => {
                res.locals[this.constructor.name] = data;
                res.status(201);
                next();
            })
            .catch(next);
    }

    login({ body }: Request, res: Response, next: NextFunction): void {
        const { login } = new this.UserServices();
        return this.handleService({
            method: login,
            res,
            next,
            arg: body,
        });
    }

    auth(req: Request, res: Response, next: NextFunction): void {
        const { auth } = new this.UserServices();
        auth(res.locals.authorized)
            .then((user) => {
                res.locals.authorized = user;
                next();
            })
            .catch(next);
    }

    verifyJWT(
        { headers: { token } }: Request,
        res: Response,
        next: NextFunction
    ): void {
        const { verify } = new this.Jwt();
        verify(`${token}`)
            .then(async ({ id }: any) => {
                res.locals.authorized = id;
            })
            .catch(next);
    }

    getOne(
        { params: { id } }: Request,
        res: Response,
        next: NextFunction
    ): void {
        const { getUserById } = new this.UserServices();
        getUserById(id, res.locals.authorized)
            .then((data) => {
                res.locals[this.constructor.name] = data;
                next();
            })
            .catch(next);
    }

    listAll(req: Request, res: Response, next: NextFunction): void {
        const { listUsers } = new this.UserServices();
        this.handleService({
            method: listUsers,
            res,
            next,
            arg: res.locals.authorized,
        });
    }

    updateOne(
        { params: { id }, body }: Request,
        res: Response,
        next: NextFunction
    ): void {
        const { updateUserById } = new this.UserServices();
        updateUserById(id, res.locals.authorized, body)
            .then((data) => {
                res.locals[this.constructor.name] = data;
                next();
            })
            .catch(next);
    }

    async deleteOne(
        { params: { id } }: Request,
        res: Response,
        next: NextFunction
    ) {
        const { deleteUserById } = new this.UserServices();
        deleteUserById(id, res.locals.authorized).then((data) => {
            res.locals[this.constructor.name] = data;
            next();
        });
    }
}
