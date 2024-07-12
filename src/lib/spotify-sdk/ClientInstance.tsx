'use client';

import {
  AccessToken,
  IAuthStrategy,
  SdkConfiguration,
  SdkOptions,
  SpotifyApi,
} from '@spotify/web-api-ts-sdk';
import { Session } from 'next-auth';
import { getSession, signIn } from 'next-auth/react';

import logger from '@/lib/logger';

// Extend the Session type to include accessToken
interface ExtendedSession extends Session {
  accessToken?: string;
  error?: string;
}

/**
 * A class that implements the Spotify SDK IAuthStrategy interface and wraps the NextAuth functionality.
 * It retrieves the access token and other information from the session handled by NextAuth.
 */
class NextAuthStrategy implements IAuthStrategy {
  public getOrCreateAccessToken(): Promise<AccessToken> {
    return this.getAccessToken();
  }

  public async getAccessToken(): Promise<AccessToken> {
    const session = (await getSession()) as ExtendedSession | null;
    if (!session) {
      throw new Error('No session found');
    }
    if (session.error === 'RefreshAccessTokenError') {
      await signIn('spotify'); // Re-authenticate
      throw new Error('Failed to refresh access token');
    }
    if (!session.accessToken) {
      throw new Error('No access token found in session');
    }

    return {
      access_token: session.accessToken,
      token_type: 'Bearer',
      expires_in: 3600, // You might want to store this in the session
      expires: session.expires || Date.now() + 3600 * 1000, // This should ideally come from the session
      refresh_token: '', // You might want to store this in the session if needed
    } as AccessToken;
  }

  public removeAccessToken(): void {
    logger(
      { WARNING: '[Spotify-SDK][WARN]\nremoveAccessToken not implemented' },
      'WARNING - ClientInstance.tsx line 47',
    );
  }

  public setConfiguration(_configuration: SdkConfiguration): void {
    logger(
      { WARNING: '[Spotify-SDK][WARN]\nsetConfiguration not implemented' },
      'WARNING - ClientInstance.tsx line 56',
    );
  }
}

function withNextAuthStrategy(config?: SdkOptions) {
  const strategy = new NextAuthStrategy();
  return new SpotifyApi(strategy, config);
}

export default withNextAuthStrategy();
