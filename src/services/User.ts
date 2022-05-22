/* eslint-disable class-methods-use-this */
import { PrismaClient } from '@prisma/client';
import IsUser, { User, Login } from '../validators/User';
import userHelper from '../helpers/User';

const prisma = new PrismaClient();

const primaWithMiddleware = userHelper.middleware(prisma, IsUser);

const userModel = userHelper.model(primaWithMiddleware);

export default class UserServices extends IsUser {
    model: typeof userModel;

    constructor(model = userModel, property = 'user') {
        super(property);
        this.model = model;
        this.login = this.login.bind(this);
        this.auth = this.auth.bind(this);
        this.listUsers = this.listUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.signup = this.signup.bind(this);
        this.createUser = this.createUser.bind(this);
        this.updateUserById = this.updateUserById.bind(this);
        this.deleteUserById = this.deleteUserById.bind(this);
    }

    async signup({ email, name, password, role }: User) {
        const user = await this.model.user.create({
            data: { email, name, password, role },
        });
        return { message: 'User successfully signed up', data: user };
    }

    async createUser(arg: any, user: User) {
        await this.isAdmin(user);
        const data = await this.model.user.create(arg);
        return { message: 'User successfully created', data };
    }

    async login({ email, password }: Login) {
        await this.isLogin({ email, password });
        const user = await this.model.user.findUnique({
            where: { email },
        });
        await this.model.comparePassword(password, user!.password);
        return {
            message: 'Registered user successfully signed in',
            data: user,
        };
    }

    async auth(id: string) {
        await this.isUUID(id, false);
        const user = await this.model.user.findUnique({ where: { id } });
        await this.isFound(user);
        return user;
    }

    async listUsers(user: User) {
        await this.isAdmin(user);
        const data = await this.model.user.findMany();
        return { message: 'Users successfully retrieved', data };
    }

    async getUserById(id: string, user: User) {
        await this.isAdmin(user);
        await this.isUUID(id);
        const existingUser = await this.model.user.findUnique({
            where: { id },
        });
        await this.isFound(existingUser);
        return { message: 'User successfully retrieved', data: user };
    }

    async updateUserById(id: string, user: User, arg: User) {
        await this.isUUID(id);
        await this.isAdmin(user);

        const data = await this.model.user.update({ where: { id }, data: arg });
        return { message: 'User successfully updated', data };
    }

    async deleteUserById(id: string, user: User) {
        await this.isUUID(id);
        await this.isAdmin(user);
        await this.model.user.delete({ where: { id } });
        return { message: 'User successfully deleted' };
    }
}
