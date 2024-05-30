'use client';

import { Artist, FollowedArtists } from '@spotify/web-api-ts-sdk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import React, { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';

import Box from '@/components/Box';
import Header from '@/components/Header';
import PageContent from '@/components/PageContent';
import InfoIcon from '@/components/InfoIcon';

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
    <Box className='bg-dark rounded-md h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        {/* TITLE */}
        {/* TITLE */}
        <div className='inline-flex items-center gap-x-2'>
          <h1 className='text-brand-light w-fit text-lg sm:text-xl md:text-2xl'>
            Followed Artists
          </h1>
          <InfoIcon />
        </div>
        <h4 className='self-end font-thin subtitle'>
          {artists?.pages.flatMap((page) => page.items).length} of{' '}
          {followedArtists?.artists?.total} total
        </h4>
        {/* add top artist(s)? top 3?  */}
      </Header>

      <div className='overflow-y-auto overflow-x-hidden px-6'>
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
