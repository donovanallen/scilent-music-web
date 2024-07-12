import { Prisma, PrismaClient } from '@prisma/client';

// Extend the NodeJS global type with the prisma property
declare global {
  /* eslint-disable no-var */
  var prisma: PrismaClient | undefined;
}

const prismaOptions: Prisma.PrismaClientOptions = {
  log: ['query', 'error', 'warn'],
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaOptions);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(prismaOptions);
  }
  prisma = global.prisma;
}

export default prisma;
