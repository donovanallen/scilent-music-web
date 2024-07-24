import sdk from '@/lib/spotify-sdk/ClientInstance';

export const getArtistDiscography = async (artistId: string) => {
  const artist = sdk.artists.get(artistId);
  const topTracks = sdk.artists.topTracks(artistId, 'US');
  const albums = sdk.artists.albums(artistId);
  const relatedArtists = sdk.artists.relatedArtists(artistId);

  return Promise.all([artist, topTracks, albums, relatedArtists]);
};
