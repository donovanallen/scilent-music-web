'use client';

import { Album, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import { compareDesc } from 'date-fns';
import React, { memo, useEffect, useState } from 'react';
import { IoClose, IoRefresh } from 'react-icons/io5';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { useFollowedArtists } from '@/hooks/useFollowedArtists';

import AlbumsCollection from '@/components/AlbumsCollection';
import IconButton from '@/components/buttons/IconButton';
import InfoIcon from '@/components/InfoIcon';
import LoadingIndicator from '@/components/LoadingIndicator';

const UserReleases = () => {
  const { followedArtists, isLoading } = useFollowedArtists();

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  // ALL USER RELEASES
  const [userReleases, setUserReleases] =
    useState<(SimplifiedAlbum | Album)[]>();
  const [loadingUserReleases, setLoadingUserReleases] = useState(false);
  const splitIntoBatches = (array: any[], batchSize: number) => {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  };
  const getAllUserReleases = async () => {
    const controller = new AbortController();
    setAbortController(controller);
    setLoadingUserReleases(true);
    try {
      const batchSize = 20; // Adjust this value based on Spotify's rate limits
      const artistBatches = splitIntoBatches(followedArtists, batchSize);
      let allAlbums: SimplifiedAlbum[] = [];

      for (const batch of artistBatches) {
        const batchResults = await Promise.all(
          batch.map((artist) => sdk.artists.albums(artist.id)),
        );
        allAlbums = [...allAlbums, ...batchResults.flatMap((r) => r.items)];

        // Add a delay between batches to further reduce the risk of hitting rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const allUserReleases = allAlbums
        .filter((a) => {
          const releaseDate = new Date(a.release_date);
          return (
            a.release_date_precision === 'day' &&
            a.release_date &&
            releaseDate >= thirtyDaysAgo
          );
        })
        .sort((a, b) => compareDesc(a?.release_date, b?.release_date));

      setUserReleases(() => allUserReleases);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error fetching user releases:', error);
      }
    } finally {
      setLoadingUserReleases(false);
      setAbortController(null);
    }
  };
  useEffect(() => {
    (async () => {
      if (!followedArtists?.length) return;
      await getAllUserReleases();
    })();
  }, [followedArtists]);

  return isLoading ? (
    <div className='flex flex-col gap-y-4 w-full'>
      <LoadingIndicator />
    </div>
  ) : (
    <>
      <div className='inline-flex items-center gap-x-2'>
        <h3 className='w-fit text-lg sm:text-xl md:text-2xl'>User Releases</h3>
        <InfoIcon
          tooltipEnabled
          tooltip={{
            content: 'These are recent releases from your followed artists',
          }}
        />
        <IconButton
          variant='ghost'
          icon={IoRefresh}
          onClick={getAllUserReleases}
          classNames={{
            icon: loadingUserReleases ? 'animate-spin' : '',
          }}
          disabled={loadingUserReleases}
        />
        {loadingUserReleases && (
          <IconButton
            variant='ghost'
            icon={IoClose}
            onClick={() => {
              if (abortController) {
                abortController.abort();
                setLoadingUserReleases(false);
              }
            }}
          />
        )}
      </div>
      {userReleases && userReleases.length > 0 && (
        <AlbumsCollection
          albums={userReleases as Album[]}
          albumContentProps={{ showArtist: true }}
        />
      )}
    </>
  );
};

export default memo(UserReleases);
