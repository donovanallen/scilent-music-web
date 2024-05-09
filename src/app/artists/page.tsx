'use client';

import { Artist, FollowedArtists } from '@spotify/web-api-ts-sdk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import React, { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';

import Box from '@/components/Box';
import Header from '@/components/Header';
import PageContent from '@/components/PageContent';

const Artists = () => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.7,
    root: null,
    rootMargin: '24px',
  });

  const [followedArtists, setFollowedArtists] = useState<FollowedArtists>(
    {} as FollowedArtists,
  );

  useEffect(() => {
    (async () => {
      const result = await sdk.currentUser.followedArtists();
      setFollowedArtists(() => result);
    })();
  }, []);

  const getFollowedArtists = async ({
    pageParam = 0,
  }: {
    pageParam: number;
  }) => {
    const result = await sdk.currentUser.followedArtists(`${pageParam}`, 20);
    return {
      items: result.artists.items,
      nextPage: result.artists.next ? pageParam + 20 : undefined,
    };
  };

  const {
    data: artists,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['followedArtists'],
    queryFn: getFollowedArtists,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Box className='h-full overflow-hidden overflow-y-auto px-6'>
      <Header title='Artists'>{/* add top artist(s)? top 3?  */}</Header>

      <div className='mt-2 mb-7'>
        <div className='flex justify-between items-center'>
          <h2 className='text-white'>
            Followed Artists ( showing{' '}
            {artists?.pages.flatMap((page) => page.items).length} of{' '}
            {followedArtists?.artists?.total})
          </h2>
        </div>
        <PageContent
          artists={
            artists?.pages
              .flatMap((page) => page.items)
              .sort((a, b) => a.name.localeCompare(b.name)) as Artist[]
          }
        />
        <hr ref={ref} />
      </div>
    </Box>
  );
};

export default Artists;
