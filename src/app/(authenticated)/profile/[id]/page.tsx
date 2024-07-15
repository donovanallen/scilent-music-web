'use client';

import { ScrollShadow, User } from '@nextui-org/react';
// import TopItems from '@/components/TopItems';
// import ProfileAura from '@/app/(authenticated)/profile/components/ProfileAura';
// import ProfileInfo from '../components/ProfileInfo';
import {
  Account,
  Profile as ScilentProfile,
  User as ScilentUser,
} from '@prisma/client';
import React, { Suspense, useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa6';
import { TbUserCheck, TbUserHeart } from 'react-icons/tb';

import Box from '@/components/Box';
import Header from '@/components/Header';
import Skeleton from '@/components/Skeleton';

const Profile = async ({ params }: { params: { id: string } }) => {
  const [profile, setProfile] = useState<
    ScilentProfile & { user: ScilentUser & { accounts: Account[] } }
  >();

  // const [isFollowing, setIsFollowing] = useState(false);
  // const handleFollow = async () => {
  //   if (!(session?.user as any)?.id) return;

  //   const method = isFollowing ? 'DELETE' : 'POST';
  //   const response = await fetch(
  //     `/api/users/${(session?.user as any)?.id}/following/${params.id}`,
  //     { method },
  //   );

  //   if (response.ok) {
  //     setIsFollowing(!isFollowing);
  //   }
  // };

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/db/${params.id}`);
      const dbProfile = await response.json();
      console.log('PRISMA RESPONSE', dbProfile);
      setProfile(dbProfile);
    })();
  }, [params.id]);

  return (
    <Box className='h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='flex w-full items-center justify-between'>
          <h4 className='text-dark/50 dark:text-light/50'>Profile</h4>
          {/* {
      profile?.user.accounts[0].provider === 'spotify' && profile?.user.accounts[0].providerAccountId
     && (
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
                  href={'external_urls' in profile ? profile.external_urls.spotify : ''}
                  target='_blank'
                  rel='noopener noreferrer'
                  icon={getSourceIcon('spotify')}
                  variant='ghost'
                />
              </Tooltip>
              {session?.user &&
                'id' in session.user &&
                session?.user?.id !== params.id && (
                  <Button onClick={handleFollow}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
            </>
          )} */}
        </div>

        <Suspense fallback={<Skeleton />}>
          {profile && (
            <User
              name={profile.user.name}
              description={
                <>
                  {profile &&
                    'following' in profile &&
                    Array.isArray(profile.following) &&
                    profile.following.length > 0 && (
                      <div className='flex gap-x-1 items-center cursor-pointer'>
                        <TbUserHeart className='text-dark/50 dark:text-light/50' />
                        <p>{profile.following.length}</p>
                        <p className='subtitle text-dark/50 dark:text-light/50'>
                          Following
                        </p>
                      </div>
                    )}
                  {profile &&
                    'followers' in profile &&
                    Array.isArray(profile.followers) &&
                    profile.followers.length > 0 && (
                      <div className='flex gap-x-1 items-center'>
                        <TbUserCheck className='text-dark/50 dark:text-light/50' />
                        <p>{profile.followers.length}</p>
                        <p className='subtitle text-dark/50 dark:text-light/50'>
                          Followers
                        </p>
                      </div>
                    )}
                </>
              }
              avatarProps={{
                src: profile.user.image ?? '',
                fallback: <FaUser />,
                radius: 'sm',
                size: 'lg',
              }}
              classNames={{
                name: 'text-brand-dark dark:text-brand-primary w-full line-clamp-1 text-lg sm:h2',
                description: '',
                base: 'justify-start',
                wrapper: '',
              }}
            />
          )}
        </Suspense>
      </Header>
      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden px-6 no-scrollbar'>
          {/* <Suspense fallback={<Skeleton />}>
            <ProfileAura />
          </Suspense> */}
          {/* <Suspense fallback={<Skeleton />}>
            <TopItems />
          </Suspense> */}
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Profile;
