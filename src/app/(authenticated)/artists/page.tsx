'use client';

import { ScrollShadow } from '@nextui-org/react';
import { Artist } from '@spotify/web-api-ts-sdk';
import React from 'react';

import { useFollowedArtists } from '@/hooks/useFollowedArtists';

import ArtistsCollection from '@/components/ArtistsCollection';
import Box from '@/components/Box';
import Header from '@/components/Header';
import InfoIcon from '@/components/InfoIcon';

const Artists = () => {
  const {
    total: followedCount,
    followedArtists,
    isLoading,
  } = useFollowedArtists();

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
            Followed Artists
          </h1>

          <InfoIcon
            tooltipEnabled
            tooltip={{
              content:
                'Your collection of artists followed on Spotify. Follow you favorite artists to enhance your Scilent Music experience.',
            }}
          />
        </div>
        <h4 className='text-dark dark:text-light self-end font-thin subtitle'>
          {followedCount} total
          {/* {followedArtists.length} of {followedCount} total */}
        </h4>
        {/* add top artist(s)? top 3  */}
      </Header>

      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden py-4 px-6'>
          <ArtistsCollection
            artists={
              followedArtists.sort((a, b) =>
                a.name.localeCompare(b.name),
              ) as Artist[]
            }
          />
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Artists;
