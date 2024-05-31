'use client';

import { ScrollShadow } from '@nextui-org/react';
import { UserProfile } from '@spotify/web-api-ts-sdk';
import React, { Suspense, useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { getSourceIcon } from '@/lib/utils';

import Box from '@/components/Box';
import Header from '@/components/Header';
import IconLink from '@/components/links/IconLink';
import Skeleton from '@/components/Skeleton';
import TopItems from '@/components/TopItems';

import ProfileAura from '@/app/(authenticated)/profile/components/ProfileAura';

import ProfileInfo from './components/ProfileInfo';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>();
  useEffect(() => {
    (async () => {
      const result = await sdk.currentUser.profile();
      setProfile(() => result as UserProfile);
    })();
  }, []);

  return (
    <Box className='bg-dark rounded-md h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='flex w-full items-center justify-between'>
          <h4 className='text-neutral-500'>Profile</h4>
          <Suspense>
            {profile && (
              <IconLink
                href={profile.external_urls.spotify || ''}
                target='_blank'
                rel='noopener noreferrer'
                icon={getSourceIcon('spotify')}
                variant='ghost'
              />
            )}
          </Suspense>
        </div>

        <Suspense fallback={<Skeleton />}>
          {profile && <ProfileInfo {...profile} />}
        </Suspense>
      </Header>
      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden px-6 no-scrollbar'>
          <Suspense fallback={<Skeleton />}>
            <ProfileAura />
          </Suspense>
          <Suspense fallback={<Skeleton />}>
            <TopItems />
          </Suspense>
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Profile;
