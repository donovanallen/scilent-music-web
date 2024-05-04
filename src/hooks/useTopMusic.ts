import { Album, Artist, Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { TOP_ITEMS_FILTER_OPTIONS } from '@/lib/utils';

export const useTopMusic = (
  filter?: 'short_term' | 'medium_term' | 'long_term' | undefined,
) => {
  const [selectedFilter, setSelectedFilter] = useState(filter);
  const [artists, setArtists] = useState<Artist[]>();
  const [tracks, setTracks] = useState<Track[]>();
  const [albums, setAlbums] = useState<Album[]>([] as Album[]);

  useEffect(() => {
    (async () => {
      const artists = await sdk.currentUser.topItems('artists', selectedFilter);
      const tracks = await sdk.currentUser.topItems('tracks', selectedFilter);
      setArtists(() => artists.items);
      setTracks(() => tracks.items);
      setAlbums(() => [] as Album[]);
    })();
  }, [selectedFilter]);

  return {
    // Data
    artists,
    tracks,
    albums,
    filterOptions: TOP_ITEMS_FILTER_OPTIONS,
    selectedFilter,
    setSelectedFilter,

    // Status
    // isLoading: isLoading && !error && !data,
    // isError: error,
    // isValidating,
  };
};
