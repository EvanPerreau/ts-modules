import { PrismaClient } from '@prisma/client';
import {Environment} from "./environment";

let prisma: PrismaClient = new PrismaClient();

let environment: Environment = new Environment([
    'DATABASE_URL',
    'SECRET_KEY',
]);

export {
    prisma,
    environment,
};