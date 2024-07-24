/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
      profile: {
        create: {
          bio: "Hello, I'm Alice!",
        },
      },
    },
    include: {
      profile: true,
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
      profile: {
        create: {
          bio: "Hi there, I'm Bob!",
        },
      },
    },
    include: {
      profile: true,
    },
  });

  // Make Alice follow Bob
  await prisma.follow.create({
    data: {
      followerId: alice.profile!.id,
      followingId: bob.profile!.id,
    },
  });

  // Make Bob follow Alice
  await prisma.follow.create({
    data: {
      followerId: bob.profile!.id,
      followingId: alice.profile!.id,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Error seeding database:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
