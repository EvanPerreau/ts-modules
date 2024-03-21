import { PrismaClient } from '@prisma/client';
import {Environment} from "./environment";

let prisma: PrismaClient = new PrismaClient();

let environment: Environment = new Environment([
    'DATABASE_URL',
    'SECRET_KEY',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'EMAIL_SECURE',
]);

export {
    prisma,
    environment,
};