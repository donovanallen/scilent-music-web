import { Album, Artist, Track } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

import logger from '@/lib/logger';
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { TOP_ITEMS_FILTER_OPTIONS } from '@/lib/utils';

import { FilterValue } from '@/constant/types';

export const useTopMusic = (filter?: FilterValue, profileId?: string) => {
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
    filter?: FilterValue;
  };

  const fetchTopItemsFromDB = useCallback(
    async (
      profileId: string,
      filter: FilterValue,
    ): Promise<{ artists: Artist[]; tracks: Track[] }> => {
      const response = await fetch(
        `/api/db/${profileId}/top?filter=${filter}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch top items from DB');
      }
      return response.json();
    },
    [],
  );

  const updateTopItems = useCallback(
    async ({
      tracks,
      artists,
      filter,
      profileId,
    }: TopItems & { profileId: string }) => {
      if (profileId) {
        const response = await fetch(`/api/db/${profileId}/top`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tracks, artists, filter }),
        });
        if (!response.ok) {
          throw new Error('Failed to update top items');
        }

        const result = await response.json();

        const { artists: artistsResponse, tracks: trackResponse } = result;

        return {
          tracks: trackResponse.tracks,
          artists: artistsResponse.artists,
          filter,
        } as TopItems;
      }
    },
    [],
  );

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (profileId) {
        const result = await fetchTopItemsFromDB(
          profileId,
          selectedFilter || 'short_term',
        );
        const { artists: artistsResponse, tracks: trackResponse } = result;

        setArtists(() => artistsResponse);
        setTracks(() => trackResponse);
        setAlbums(() => [] as Album[]);
      } else {
        const artists = await sdk.currentUser.topItems(
          'artists',
          selectedFilter,
        );
        const tracks = await sdk.currentUser.topItems('tracks', selectedFilter);
        const top = await updateTopItems({
          profileId: session?.user.id as string,
          tracks: tracks.items,
          artists: artists.items,
          filter: selectedFilter as FilterValue,
        });
        setArtists(() => top?.artists);
        setTracks(() => top?.tracks);
        setAlbums(() => [] as Album[]);
      }
    })()
      .catch((e) => {
        logger(e, 'ERROR getting Top Artists/Tracks:');
        setError(true);
      })
      .finally(() => setIsLoading(false));
  }, [
    selectedFilter,
    profileId,
    session?.user,
    updateTopItems,
    fetchTopItemsFromDB,
  ]);

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
  };
};
