import {
    validateOrReject,
    IsUUID,
    isEmpty,
    IsIn,
    Equals,
} from 'class-validator';

import { Prisma } from '@prisma/client';

const userArg = Prisma.validator<Prisma.UserArgs>()({
    select: { name: true, email: true, role: true },
});
type User = Prisma.UserGetPayload<typeof userArg>;

export default abstract class IsEntity {
    property: string;

    @IsIn(['mentor', 'admin'], {
        message: 'User role must be mentor or admin',
        groups: ['restricted'],
    })
    user_role!: string;

    @Equals('admin', { message: 'User role must be admin', groups: ['admin'] })
    'user.role'!: string;

    @IsUUID(undefined, { message: 'Invalid uuid', groups: ['uuid'] })
    id!: string;

    constructor(property: string) {
        this.property = property;
        this.isFound = this.isFound.bind(this);
        this.isUUID = this.isUUID.bind(this);
        this.validateProps = this.validateProps.bind(this);
    }

    async isAdmin(user: User) {
        this['user.role'] = user.role;
        return this.validateProps(
            { groups: ['admin'], validationError: { target: false } },
            403
        );
    }

    async isRestricted(user: User) {
        this.user_role = user.role;
        return this.validateProps(
            { groups: ['restricted'], validationError: { target: false } },
            403
        );
    }

    async isUUID(id: string, target: boolean = true) {
        this.id = id;
        return this.validateProps({
            groups: ['uuid'],
            validationError: { target },
            forbidUnknownValues: true,
        });
    }

    async validateProps(options: object, errorCode: number = 400) {
        await validateOrReject(this, options).catch((err) => {
            const error = { ...err, errorCode };
            throw error;
        });
    }

    async isFound(arg: any) {
        if (isEmpty(arg)) {
            const error = new Error(`${this.property} not found`);
            error.name = 'NotFoundError';
            error.cause = new Error(`${this.property} is null or undefined`);
            throw error;
        }
    }
}
