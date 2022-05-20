import { IsEmail, IsString, IsNotEmpty } from 'class-validator'

import { LoginFields } from '../interfaces'

import IsValidFields from '.'

export default class IsUser extends IsValidFields {
    @IsEmail(undefined, { context: { errorCode: 400 }, groups: ['login'] })
    email!: string

    @IsString({ context: { errorCode: 400 }, groups: ['login'] })
    @IsNotEmpty({ context: { errorCode: 400 }, groups: ['login'] })
    password?: string

    async isLogin({ email, password }: LoginFields) {
        this.email = email
        this.password = password
        return this.validateProps({
            validationError: { target: true },
            groups: ['login'],
        })
    }
}
