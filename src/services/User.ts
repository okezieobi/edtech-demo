/* eslint-disable class-methods-use-this */
import { PrismaClient } from '@prisma/client'
import UserFields, { LoginFields } from '../interfaces'
import IsUser from '../validators/User'

export default class UserServices extends IsUser {
    constructor(model = new PrismaClient(), property = 'user') {
        super(model, property)
        this.login = this.login.bind(this)
        this.auth = this.auth.bind(this)
        this.listUsers = this.listUsers.bind(this)
        this.getUserById = this.getUserById.bind(this)
        this.signup = this.signup.bind(this)
        this.createUser = this.createUser.bind(this)
        this.updateUserById = this.updateUserById.bind(this)
        this.deleteUserById = this.deleteUserById.bind(this)
    }

    async signup(arg: any & UserFields) {
        const user = await this.model.user.create(arg)
        return { message: 'User successfully signed up', data: user }
    }

    async createUser(arg: any & UserFields, user: UserFields) {
        await this.isAdmin(user)
        const data = await this.model.user.create(arg)
        return { message: 'User successfully created', data }
    }

    async login({ email, password }: LoginFields) {
        await this.isLogin({ email, password })
        const user = await this.model.user.findUnique({
            where: { email },
        })
        await this.isFound(user)
        // await user?.validatePassword(password)
        return { message: 'Registered user successfully signed in', data: user }
    }

    async auth(id: string) {
        await this.isUUID(id, false)
        const user = await this.model.user.findUnique({ where: { id } })
        await this.isFound(user)
        return user
    }

    async listUsers(user: UserFields) {
        await this.isAdmin(user)
        const data = await this.model.user.findMany()
        return { message: 'Users successfully retrieved', data }
    }

    async getUserById(id: string, user: UserFields) {
        await this.isAdmin(user)
        await this.isUUID(id)
        const existingUser = await this.model.user.findUnique({ where: { id } })
        await this.isFound(existingUser)
        return { message: 'User successfully retrieved', data: user }
    }

    async updateUserById(id: string, user: UserFields, arg: any & UserFields) {
        await this.isUUID(id)
        await this.isAdmin(user)

        const data = await this.model.user.update({ where: { id }, data: arg })
        return { message: 'User successfully updated', data }
    }

    async deleteUserById(id: string, user: UserFields) {
        await this.isUUID(id)
        await this.isAdmin(user)
        await this.model.user.delete({ where: { id } })
        return { message: 'User successfully deleted' }
    }
}
