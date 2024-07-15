import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';

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
          id: token.sub!, // Use the subject from the token as the user id
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
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  events: {
    createUser: async ({ user }) => {
      // Create a profile for the new user
      const profile = await prisma.profile.create({
        data: {
          userId: user.id,
          // Add any other default fields you want for new profiles
        },
      });
      logger({ user, profile }, 'Profile created for user: ');
    },
    signOut: async ({ token, session }) => {
      logger({ user: session }, 'SIGNING OUT - Session: ');
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
    updateUser: async ({ user }) => {
      // Create a profile for the new user
      logger({ user }, 'Updating User: ');
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          userId: user.id,
          // Add any other default fields you want for new profiles
        },
      });
    },
  },
};

export default authOptions;
