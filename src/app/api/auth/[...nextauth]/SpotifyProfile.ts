import SpotifyProvider from 'next-auth/providers/spotify';

if (!process.env.SPOTIFY_CLIENT_ID) {
  throw new Error('Missing SPOTIFY_CLIENT_ID');
}

if (!process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error('Missing SPOTIFY_CLIENT_SECRET');
}

const SCOPES: string[] = [
  'user-follow-modify',
  'user-follow-read',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-email',
  'user-read-playback-state', // applies to device/player
  'user-read-playback-position', // applies to episodes/shows
  'user-read-private',
  'user-read-recently-played',
  'user-top-read',
  // 'user-library-read', // applies to saved content
  // 'user-library-modify', // applies to modifyiing saved content
  // 'playlist-read-private',
  // 'playlist-read-collaborative',
];

const spotifyProfile = SpotifyProvider({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  authorization: {
    url: 'https://accounts.spotify.com/authorize',
    params: {
      scope: SCOPES.join(' '),
    },
  },
});

export default spotifyProfile;
