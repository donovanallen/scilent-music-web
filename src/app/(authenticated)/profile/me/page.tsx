'use client';

import { ScrollShadow, Tooltip } from '@nextui-org/react';
import { Profile as ScilentProfile } from '@prisma/client';
import { UserProfile } from '@spotify/web-api-ts-sdk';
import React, { Suspense, useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { getSourceIcon } from '@/lib/utils';
import { useTopMusic } from '@/hooks/useTopMusic';

import Box from '@/components/Box';
import Header from '@/components/Header';
import IconLink from '@/components/links/IconLink';
import Skeleton from '@/components/Skeleton';
import TopItems from '@/components/TopItems';

import ProfileAura from '@/app/(authenticated)/profile/components/ProfileAura';

import ProfileInfo from '../components/ProfileInfo';

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | ScilentProfile>();
  const {
    artists: topArtists,
    tracks: topTracks,
    filterOptions,
    selectedFilter,
    setSelectedFilter,
    isLoading,
  } = useTopMusic('short_term');

  useEffect(() => {
    (async () => {
      const result = await sdk.currentUser.profile();
      setProfile(() => result as UserProfile);
    })();
  }, []);

  return (
    <Box className='h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='flex w-full items-center justify-between'>
          <h4 className='text-dark/50 dark:text-light/50'>Profile</h4>
          {profile && (
            <>
              <Tooltip
                content='Anywhere you see the Spotify icon, click to go directly to the app for any profile, artist, album, track, or playlist.'
                delay={1000}
                classNames={{
                  content:
                    'text-dark bg-light dark:bg-dark dark:text-light p-4',
                  base: 'max-w-xs',
                }}
              >
                <IconLink
                  href={
                    'external_urls' in profile
                      ? profile.external_urls.spotify
                      : ''
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  icon={getSourceIcon('spotify')}
                  variant='ghost'
                />
              </Tooltip>
            </>
          )}
        </div>

        <Suspense fallback={<Skeleton />}>
          {profile && <ProfileInfo {...(profile as UserProfile)} />}
        </Suspense>
      </Header>
      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden px-6 no-scrollbar'>
          <Suspense fallback={<Skeleton />}>
            <ProfileAura />
          </Suspense>
          <Suspense fallback={<Skeleton />}>
            <TopItems
              artists={topArtists}
              tracks={topTracks}
              filterOptions={filterOptions}
              selectedFilter={selectedFilter}
              onFilterSelect={setSelectedFilter as () => void}
              isLoading={isLoading}
            />
          </Suspense>
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Profile;
