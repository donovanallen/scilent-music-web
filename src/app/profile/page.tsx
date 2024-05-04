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

  // const [recents, setRecents] = useState<PlayHistory[]>();
  const [profileInfo, setProfileInfo] = useState<UserProfile>();

  // * RECENTS
  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     (async () => {
  //       const result = await sdk.player.getRecentlyPlayedTracks();
  //       setRecents(() => result.items as PlayHistory[]);
  //     })();
  //   }
  // }, [status]);

  // * PROFILE INFO
  useEffect(() => {
    (async () => {
      const result = await sdk.currentUser.profile();
      setProfileInfo(() => result as UserProfile);
    })();
  }, [status]);

  return (
    <Box className='bg-dark rounded-md h-full flex flex-col overflow-y-auto px-6'>
      <Header className=''>
        <h4 className='text-neutral-500'>Profile</h4>
        <div className='flex flex-col gap-y-4'>
          {profileInfo && <ProfileInfo {...profileInfo} />}
        </div>
      </Header>
      <TopItems />
      {/* <div className='py-6 border-t mx-6 overflow-scroll no-scrollbar relative'>
        <div className='sticky top-0 bg-dark z-10'>
          <h3 className='text-neutral-500'>My Mix</h3>
        </div>
        {status === 'authenticated' && <PageContent history={recents} />}
      </div> */}
    </Box>
  );
};

export default Profile;
