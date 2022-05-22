import { IsEmail, IsString, IsNotEmpty, IsIn } from 'class-validator';
import { Prisma } from '@prisma/client';

import IsValidFields from '.';

const userArgs = Prisma.validator<Prisma.UserArgs>()({
    select: { name: true, email: true, password: true, role: true },
});
export type User = Prisma.UserGetPayload<typeof userArgs>;

const loginArgs = Prisma.validator<Prisma.UserArgs>()({
    select: { email: true, password: true },
});
export type Login = Prisma.UserGetPayload<typeof loginArgs>;

export default class IsUser extends IsValidFields implements User {
    @IsEmail(undefined, {
        message: '$value is not a valid email',
        groups: ['login', 'signup'],
    })
    email!: string;

    @IsString({
        message: '$target must be string',
        context: { errorCode: 400 },
        groups: ['login', 'signup'],
    })
    @IsNotEmpty({
        message: '$target must not be empty',
        groups: ['login', 'signup'],
    })
    password!: string;

    @IsString({
        message: '$target must be string',
        groups: ['signup'],
    })
    @IsNotEmpty({
        message: '$target must not be empty',
        groups: ['signup'],
    })
    name!: string;

    @IsIn(['User', 'Admin', 'Admin'], {
        message: '$target must be User or Mentor or Admin and not $value',
        groups: ['signup'],
    })
    role: any;

    async isLogin({ email, password }: Login) {
        this.email = email;
        this.password = password;
        return this.validateProps({
            validationError: { target: true },
            groups: ['login'],
        });
    }

    async isSignup({ email, password, role, name }: User) {
        this.email = email;
        this.password = password;
        return this.validateProps({
            validationError: { target: true },
            groups: ['signup'],
        });
    }
}
