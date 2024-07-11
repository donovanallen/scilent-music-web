import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
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
      sessions: {
        create: {
          sessionToken: 'example_session_token_1',
          expires: new Date(),
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
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
      sessions: {
        create: {
          sessionToken: 'example_session_token_2',
          expires: new Date(),
        },
      },
    },
  });
  console.log({ alice, bob });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
