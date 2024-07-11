import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions } from 'next-auth';

import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

import spotifyProfile from './SpotifyProfile';

const authOptions: AuthOptions = {
  providers: [spotifyProfile],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
    maxAge: 60 * 60, // 1hr
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('---------- CALLBACK: SIGN IN -------');
      console.log('user', user);
      console.log('account', account);
      console.log('profile', profile);
      console.log('email', email);
      console.log('credentials', credentials);

      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('---------- CALLBACK: REDIRECT -------');
      console.log('url', url);
      console.log('baseUrl', baseUrl);
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.log('---------- CALLBACK: SESSION -------');
      console.log('session', session);
      console.log('user', user);
      console.log('token', token);
      return session;
    },
    async jwt({ token, user, account, profile }) {
      console.log('---------- CALLBACK: JWT -------');
      console.log('profile', profile);
      console.log('account', account);
      console.log('user', user);
      console.log('token', token);
      return token;
    },
    //   async signIn({ user, account, profile, email, credentials }) {
    //     // You can perform any custom actions here before the user is signed in
    //     // For example, logging or modifying the user data
    //     console.log('-------------Sign in attempt---------', {
    //       user,
    //       account,
    //       profile,
    //       email,
    //       credentials,
    //     });

    //      // Check if the user already exists in the database
    //     let dbUser = await prisma.user.findUnique({
    //       where: {
    //         email: user.email as string, // Assuming 'email' is unique in your User model
    //       },
    //     });

    //     console.log('DB USER', dbUser);

    //     // If the user does not exist, create a new entry
    //     if (!dbUser) {
    //       dbUser = await prisma.user.create({
    //         data: {
    //           name: user.name, // Adjust according to your User model fields
    //           email: user.email,
    //           // image: user.image, // Optional: save the user's profile picture URL
    //         },
    //       });
    //     }

    //     // Link the account details to the user
    // // if (account && !dbUser.accounts.some(acc => acc.providerAccountId === account.providerAccountId)) {
    // //   await prisma.account.create({
    // //     data: {
    // //       userId: dbUser.id,
    // //       type: account.type,
    // //       provider: account.provider,
    // //       providerAccountId: account.providerAccountId,
    // //       refresh_token: account.refresh_token,
    // //       access_token: account.access_token,
    // //       expires_at: account.expires_at,
    // //       token_type: account.token_type,
    // //       scope: account.scope,
    // //       id_token: account.id_token,
    // //       session_state: account.session_state,
    // //     },
    // //   });
    // // }

    //     // Log the action for debugging purposes
    //     console.log(`User ${dbUser.email} signed in.`);

    //     // Return true to continue the sign-in process, or false to abort
    //     return true;
    //   },
    // async jwt({ token, account }: { token: JWT; account: Account | null }) {
    // async jwt({
    //   token,
    //   account,
    //   user,
    // }: {
    //   token: JWT;
    //   account: Account | null;
    //   user: User;
    // }) {
    //   // This callback is triggered whenever a JWT is created (on sign in) or updated
    //   // You can add custom claims to the JWT here
    //   // or pass access token info from account signin to JWT

    //   console.log('JWT callback:', { token, user, account });

    //   if (!account) {
    //     return token;
    //   }

    //   const updatedToken = {
    //     ...token,
    //     access_token: account?.access_token,
    //     token_type: account?.token_type,
    //     expires_at: account?.expires_at ?? Date.now() / 1000,
    //     expires_in: (account?.expires_at ?? 0) - Date.now() / 1000,
    //     refresh_token: account?.refresh_token,
    //     scope: account?.scope,
    //     id: account?.providerAccountId,
    //   };

    //   if (Date.now() < updatedToken.expires_at) {
    //     return refreshAccessToken(updatedToken);
    //   }

    //   return updatedToken;
    // },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // async session({ session, token, user }: { session: any; token: any; user: AdapterUser; }) {
    //   // This callback is triggered whenever session data is sent to the client
    //   // You can modify the session data here
    //   // or pass access token info from JWT to session to be used in Spotify SDK

    //   const authUser: AuthUser = {
    //     ...session.user,
    //     access_token: token.access_token,
    //     token_type: token.token_type,
    //     expires_at: token.expires_at,
    //     expires_in: token.expires_in,
    //     refresh_token: token.refresh_token,
    //     scope: token.scope,
    //     id: token.id,
    //   };
    //   session.user = user;
    //   session.error = token.error;
    //   console.log('Session callback:', { session, token, user, authUser });
    //   return session;
    // },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  events: {
    signIn({ user, account, profile, isNewUser }) {
      logger(
        { user, account, profile, isNewUser },
        'authOptions.ts EVENT : signIn',
      );
    },
    signOut({ token, session }) {
      logger({ token, session }, 'authOptions.ts EVENT : signOut');
    },
    updateUser({ user }) {
      logger({ user }, 'authOptions.ts EVENT : updateUser');
    },
    session({ session, token }) {
      logger({ session, token }, 'authOptions.ts EVENT : session');
    },
  },
};

export default authOptions;
