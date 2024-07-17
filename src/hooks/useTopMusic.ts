import { Album, Artist, Track } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { TOP_ITEMS_FILTER_OPTIONS } from '@/lib/utils';

import { FilterValue } from '@/constant/types';

export const useTopMusic = (filter?: FilterValue) => {
  const { data: session } = useSession();
  const [selectedFilter, setSelectedFilter] = useState<FilterValue | undefined>(
    filter,
  );
  const [artists, setArtists] = useState<Artist[]>();
  const [tracks, setTracks] = useState<Track[]>();
  const [albums, setAlbums] = useState<Album[]>([] as Album[]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  type TopItems = {
    tracks: Track[];
    artists: Artist[];
    timeRange: string;
  };

  const updateTopItems = async ({ tracks, artists, timeRange }: TopItems) => {
    if (session?.user) {
      console.log('Updating top items', session.user, {
        tracks,
        artists,
        timeRange,
      });
      // update user.topTracks/user.topArtists in db
      const response = await fetch(`/api/db/user/${session.user.id}/top`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tracks, artists, timeRange }),
      });
      const result = await response.json();
      console.log('API response:', result);
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const artists = await sdk.currentUser.topItems('artists', selectedFilter);
      const tracks = await sdk.currentUser.topItems('tracks', selectedFilter);
      updateTopItems({
        tracks: tracks.items,
        artists: artists.items,
        timeRange: selectedFilter as string,
      });
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
