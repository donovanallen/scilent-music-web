import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

import spotifyProfile from './SpotifyProfile';

async function refreshSpotifyAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ':' +
              process.env.SPOTIFY_CLIENT_SECRET,
          ).toString('base64'),
      },
      body: `grant_type=refresh_token&refresh_token=${token.refreshToken}`,
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
      // throw new Error('Failed to refresh token');
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      // access_token: refreshedTokens.access_token,
      // expires_at: Date.now() + refreshedTokens.expires_in * 1000, // Convert expires_in to milliseconds
      // refresh_token: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    logger({ error }, 'ERROR: Error refreshing token');
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [spotifyProfile],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 3600, // 1 hour
  },
  callbacks: {
    async redirect({ baseUrl, url }) {
      if (url.startsWith('/'))
        return `${baseUrl}${url}`; // Allows relative callback URLs
      else if (new URL(url).origin === baseUrl) return url; // Allows callback URLs on the same origin
      return baseUrl;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...session.user,
          id: token.sub, // Use the subject from the token as the user id
        },
      };
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: (account.expires_at ?? 0) * 1000, // Use 0 as default if undefined // Convert to milliseconds for JS Date object compatibility
          refreshToken: account.refresh_token,
          user,
        };
      }
      // If the access token has not expired yet, return the token as is
      if (
        typeof token.accessTokenExpires === 'number' &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      // If the token has expired, try to refresh it
      return refreshSpotifyAccessToken(token);
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
    signOut: async ({ token, session }) => {
      logger({ user: session.user }, 'SIGNING OUT - User: ');
      if (token.sub) {
        await prisma.account.updateMany({
          where: { userId: token.sub },
          data: {
            access_token: null,
            refresh_token: null,
            expires_at: null,
          },
        });
      }
    },
  },
};

export default authOptions;
