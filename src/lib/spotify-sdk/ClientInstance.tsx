'use client';

import {
  AccessToken,
  IAuthStrategy,
  SdkConfiguration,
  SdkOptions,
  SpotifyApi,
} from '@spotify/web-api-ts-sdk';
import { getSession, signIn } from 'next-auth/react';

import logger from '@/lib/logger';

import { AuthUser } from '@/constant/types';

/**
 * A class that implements the Spotify SDK IAuthStrategy interface and wraps the NextAuth functionality.
 * It retrieves the access token and other information from the session handled by NextAuth.
 */
class NextAuthStrategy implements IAuthStrategy {
  public getOrCreateAccessToken(): Promise<AccessToken> {
    return this.getAccessToken();
  }

  public async getAccessToken(): Promise<AccessToken> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session: any = await getSession();
    if (!session) {
      return {} as AccessToken;
    }

    if (session && session?.error === 'RefreshAccessTokenError') {
      await signIn();
      return this.getAccessToken();
    }

    const { user }: { user: AuthUser } = session;

    return {
      access_token: user.access_token,
      token_type: 'Bearer',
      expires_in: user.expires_in,
      expires: user.expires_at,
      refresh_token: user.refresh_token,
    } as AccessToken;
  }

  public removeAccessToken(): void {
    logger(
      { WARNING: '[Spotify-SDK][WARN]\nremoveAccessToken not implemented' },
      'WARNING - ClientInstance.tsx line 47',
    );
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  public setConfiguration(configuration: SdkConfiguration): void {
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
