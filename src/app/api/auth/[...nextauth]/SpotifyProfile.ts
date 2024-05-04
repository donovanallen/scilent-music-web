import { JWT } from 'next-auth/jwt';
import SpotifyProvider from 'next-auth/providers/spotify';

// if (!process.env.SPOTIFY_CLIENT_ID) {
//   throw new Error('Missing SPOTIFY_CLIENT_ID');
// }

// if (!process.env.SPOTIFY_CLIENT_SECRET) {
//   throw new Error('Missing SPOTIFY_CLIENT_SECRET');
// }

const SCOPES: string[] = [
  'user-read-private',
  'user-read-currently-playing',
  'user-read-playback-state', // applies to device/player
  'user-read-playback-position', // applies to episodes/shows
  'user-follow-modify',
  'user-follow-read',
  'user-top-read',
  'user-read-recently-played',
  // 'user-modify-playback-state',
  // 'user-library-read', // applies to saved content
  // 'user-library-modify', // applies to modifyiing saved content
  // 'user-read-email',
  // 'playlist-read-private',
  // 'playlist-read-collaborative',
];

const spotifyProfile = SpotifyProvider({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  authorization: {
    url: 'https://accounts.spotify.com/authorize',
    params: {
      scope: SCOPES.join(' '),
    },
  },
});

export default spotifyProfile;

export async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch('https://accounts.spotify.com/authorize', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      token_type: refreshedTokens.token_type,
      expires_at: refreshedTokens.expires_at,
      expires_in: (refreshedTokens.expires_at ?? 0) - Date.now() / 1000,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      scope: refreshedTokens.scope,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
