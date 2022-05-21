import { equals } from 'typescript-is';
import { isEmail } from 'class-validator';
import { PrismaClient, Prisma } from '@prisma/client';

export default function UserModel(prisma: PrismaClient['user']) {
    const userArg = Prisma.validator<Prisma.UserArgs>()({
        select: { name: true, email: true, password: true, role: true },
    });
    type User = Prisma.UserGetPayload<typeof userArg>;
    return Object.assign(prisma, {
        async validateType(data: User) {
            if (!equals<User>(data)) {
                throw new Error(`Expected a valid user input but got ${data}`);
            } else if (!isEmail(data)) {
                throw new Error(`${data.email} is an invalid email`);
            }
        },
        async validateThenCreate(data: User) {
            await this.validateType(data);
            const user = await prisma.create({ data });
            return { ...user, password: undefined };
        },
    });
}
