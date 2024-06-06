import { Artist } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';

export const useFollowedArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([] as Artist[]);
  const [total, setTotal] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let allArtists: Artist[] = [];
      const batchSize = 50;
      let after;
      let next = false;

      do {
        const { artists } = await sdk.currentUser.followedArtists(
          after,
          batchSize,
        );
        setTotal(artists.total);
        allArtists = [...allArtists, ...artists.items];
        after = allArtists[allArtists.length - 1].id;
        next = !!artists.next;
      } while (next);

      setArtists(allArtists);
    })()
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    // Data
    followedArtists: artists,
    total,

    // Status
    isLoading: isLoading && !error,
    isError: error,
  };
};
