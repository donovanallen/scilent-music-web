import { PrismaClient } from '@prisma/client';

// Extend the NodeJS global type with the prisma property
declare global {
  /* eslint-disable no-var */
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
