import { Artist } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';

export const useFollowedArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([] as Artist[]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const { artists } = await sdk.currentUser.followedArtists();
      setArtists(() => artists.items);
      setTotal(() => artists.total);
    })();
  }, []);

  // const getFollowedArtistsData = async () => {
  //   try {
  //     const allArtists: Artist[] = [];
  //     const totalArtists = artists?.length || 0;
  //     const batchSize = 50;
  //     let offset = 0;

  //     while (offset < totalArtists) {
  //       const batchArtists = await sdk.currentUser.followedArtists(
  //         artists?.slice(offset, offset + batchSize),
  //       );
  //       allArtists.push(...batchArtists.artists.items);
  //       offset += batchSize;
  //     }

  //     return allArtists;
  //   } catch (error) {
  //     console.error('Error fetching artist data:', error);
  //   }
  // };

  return {
    // Data
    followedArtists: artists,
    total,

    // Status
    // isLoading: isLoading && !error && !data,
    // isError: error,
    // isValidating,
  };
};
