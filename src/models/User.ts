import { equals } from 'typescript-is'
import { PrismaClient, Primsa } from '@prisma/client';

export default function UserModel(prisma: PrismaClient['user']) {
    return Object.assign(prisma, {});
}

