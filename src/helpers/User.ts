import { PrismaClient } from '@prisma/client';

import bcrypt from '../utils/bcrypt';
import IsUser from '../validators/User';

export default {
    middleware(prisma: PrismaClient, isUserArg: typeof IsUser) {
        prisma.$use(async (params, next) => {
            if (
                params.model === 'User' &&
                (params.action === 'create' ||
                    params.action === 'update' ||
                    params.action === 'updateMany' ||
                    params.action === 'createMany' ||
                    params.action === 'upsert') &&
                params.args.data.password != null
            ) {
                params.args.data.password = await bcrypt.hashString(
                    params.args.data.password
                );
            }
            const result = await next(params);
            if (params.action === 'findUnique') {
                const { isFound } = new isUserArg('User');
                await isFound(result);
            }
            return result;
        });
        return prisma;
    },
    model(prisma: PrismaClient) {
        return Object.assign(prisma, {
            async comparePassword(password: string, hashedPassword: string) {
                await bcrypt.compareString(
                    password,
                    hashedPassword,
                    'Password'
                );
            },
        });
    },
};
