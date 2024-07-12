import { PrismaClient } from '@prisma/client';

import logger from '@/lib/logger';
const prisma = new PrismaClient();

async function main() {
  const _alice = await prisma.user.upsert({
    where: { email: 'alice@example.io' },
    update: {},
    create: {
      email: 'alice@example.io',
      name: 'Alice Smith',
      accounts: {
        create: {
          type: 'oauth',
          provider: 'spotify',
          providerAccountId: 'example_spotify_id_123',
        },
      },
    },
  });

  const _bob = await prisma.user.upsert({
    where: { email: 'bob@example.io' },
    update: {},
    create: {
      email: 'bob@example.io',
      name: 'Bob Doe',
      accounts: {
        create: {
          type: 'oauth',
          provider: 'spotify',
          providerAccountId: 'example_spotify_id_456',
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    logger({ error }, 'ERROR: Error seeding database');
    await prisma.$disconnect();
    process.exit(1);
  });
