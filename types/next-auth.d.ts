/* eslint-disable unused-imports/no-unused-imports */
import { Account, Profile } from '@prisma/client';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      profile?: Profile;
      accounts?: Account[];
    };
    accessToken?: string;
  }
}
