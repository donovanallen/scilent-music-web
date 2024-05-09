'use client';

import { UserProfile } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';

import Box from '@/components/Box';
import Header from '@/components/Header';

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
        <h4 className='text-neutral-500'>Profile</h4>
        <div className='flex flex-col gap-y-4'>
          {profileInfo && <ProfileInfo {...profileInfo} />}
        </div>
      </Header>
      <TopItems />
    </Box>
  );
};

export default Profile;
