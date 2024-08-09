'use client';

import { Artist } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';

import { useFollowedArtists } from '@/hooks/useFollowedArtists';

import ArtistsCollection from '@/components/ArtistsCollection';
import Box from '@/components/Box';
import Header from '@/components/Header';
import InfoIcon from '@/components/InfoIcon';
import LoadingIndicator from '@/components/LoadingIndicator';
import ViewToggle, { ViewType } from '@/components/ViewToggle';

const Artists = () => {
  const {
    total: followedCount,
    followedArtists,
    isLoading,
  } = useFollowedArtists();

  const [view, setView] = useState<ViewType>('grid');

  // const [followedArtists, setFollowedArtists] = useState<FollowedArtists>(
  //   {} as FollowedArtists,
  // );

  // useEffect(() => {
  //   (async () => {
  //     const result = await sdk.currentUser.followedArtists();
  //     setFollowedArtists(() => result);
  //   })();
  // }, []);

  // const getFollowedArtists = async ({
  //   pageParam = '',
  // }: {
  //   pageParam: string;
  // }) => {
  //   const result = await sdk.currentUser.followedArtists(pageParam, 20);
  //   return {
  //     items: result.artists.items,
  //     nextPage: result.artists.next ? !!pageParam : undefined,
  //   };
  // };

  // const {
  //   data: artists,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  // } = useInfiniteQuery({
  //   queryKey: ['followedArtists'],
  //   queryFn: getFollowedArtists,
  //   initialPageParam: '',
  //   getNextPageParam: (lastPage) =>
  //     lastPage.items[lastPage.items.length - 1].id,
  // });

  // useEffect(() => {
  //   if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage();
  //   }
  // }, [entry, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Box className='h-full flex flex-col'>
      <Header>
        {/* TITLE */}
        <div className='inline-flex items-center gap-x-2'>
          <h1 className='text-brand-dark dark:text-brand-light w-fit text-lg sm:text-xl md:text-2xl'>
            Artists
          </h1>

          <InfoIcon
            tooltipEnabled
            tooltip={{
              content:
                'Your collection of artists followed on Spotify. Follow you favorite artists to enhance your Scilent Music experience.',
            }}
          />
        </div>

        {/* add top artist(s)? top 3  */}
      </Header>

      <div className='flex flex-col h-full w-full p-6'>
        <div className='inline-flex items-center justify-between w-full'>
          <h4 className='w-fit'>Following</h4>
          <div className='inline-flex items-center gap-x-4'>
            <h4 className='text-dark dark:text-light font-thin subtitle'>
              {followedCount} total
              {/* {followedArtists.length} of {followedCount} total */}
            </h4>
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center h-full w-full gap-y-12'>
            <LoadingIndicator />
          </div>
        ) : (
          <ArtistsCollection
            artists={
              followedArtists.sort((a, b) =>
                a.name.localeCompare(b.name),
              ) as Artist[]
            }
            layout={view}
          />
        )}
      </div>
    </Box>
  );
};

export default Artists;
