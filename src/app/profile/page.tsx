'use client';

import { UserProfile } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { getSourceIcon } from '@/lib/utils';

import Box from '@/components/Box';
import Header from '@/components/Header';
import IconLink from '@/components/links/IconLink';

import ProfileInfo from './components/ProfileInfo';
import TopItems from '../../components/TopItems';

const Profile: React.FC = () => {
  const { status } = useSession();

  // * RECENTS
  // const [recents, setRecents] = useState<PlayHistory[]>();
  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     (async () => {
  //       const result = await sdk.player.getRecentlyPlayedTracks();
  //       setRecents(() => result.items as PlayHistory[]);
  //     })();
  //   }
  // }, [status]);

  // * PROFILE INFO
  const [profileInfo, setProfileInfo] = useState<UserProfile>();
  useEffect(() => {
    (async () => {
      const result = await sdk.currentUser.profile();
      setProfileInfo(() => result as UserProfile);
    })();
  }, [status]);

  return (
    <Box className='bg-dark rounded-md h-full flex flex-col overflow-y-auto px-6'>
      <Header>
        <div className='flex w-full items-center justify-between'>
          <h4 className='text-neutral-500'>Profile</h4>
          <IconLink
            href={profileInfo?.external_urls.spotify || ''}
            target='_blank'
            rel='noopener noreferrer'
            icon={getSourceIcon('spotify')}
            variant='ghost'
          />
        </div>
        {profileInfo && <ProfileInfo {...profileInfo} />}
      </Header>
      <TopItems />
    </Box>
  );
};

export default Profile;
