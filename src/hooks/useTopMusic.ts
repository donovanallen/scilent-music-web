import { Album, Artist, Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { TOP_ITEMS_FILTER_OPTIONS } from '@/lib/utils';

import { FilterValue } from '@/constant/types';

export const useTopMusic = (filter?: FilterValue) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterValue | undefined>(
    filter,
  );
  const [artists, setArtists] = useState<Artist[]>();
  const [tracks, setTracks] = useState<Track[]>();
  const [albums, setAlbums] = useState<Album[]>([] as Album[]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const artists = await sdk.currentUser.topItems('artists', selectedFilter);
      const tracks = await sdk.currentUser.topItems('tracks', selectedFilter);
      setArtists(() => artists.items);
      setTracks(() => tracks.items);
      setAlbums(() => [] as Album[]);
    })()
      .catch((e) => {
        console.error('ERROR getting Top Artists/Tracks:', e);
        setError(true);
      })
      .finally(() => setIsLoading(false));
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
    isLoading: isLoading && !error,
    isError: error,
    // isValidating,
  };
};
