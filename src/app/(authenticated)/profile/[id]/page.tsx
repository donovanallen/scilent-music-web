'use client';

import { ScrollShadow, Tooltip, User } from '@nextui-org/react';
// import TopItems from '@/components/TopItems';
// import ProfileAura from '@/app/(authenticated)/profile/components/ProfileAura';
// import ProfileInfo from '../components/ProfileInfo';
import {
  Account,
  Follow,
  Profile as ScilentProfile,
  User as ScilentUser,
} from '@prisma/client';
import { User as SpotifyUser } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa6';
import { TbUserCheck, TbUserHeart } from 'react-icons/tb';

import logger from '@/lib/logger';
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { getSourceIcon } from '@/lib/utils';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
import Header from '@/components/Header';
import IconLink from '@/components/links/IconLink';
import Skeleton from '@/components/Skeleton';

const Profile = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<
    ScilentProfile & { followers: Follow[] } & { following: Follow[] } & {
      user: ScilentUser & { accounts: Account[] };
    }
  >();
  const [accounts, setAccounts] = useState<SpotifyUser[]>([] as SpotifyUser[]);

  const [currentUser, setCurrentUser] = useState<
    ScilentUser & { profile: ScilentProfile }
  >();
  const [isFollowing, setIsFollowing] = useState(false);
  const handleFollow = useCallback(async () => {
    const method = isFollowing ? 'DELETE' : 'POST';

    if (currentUser?.id) {
      const response = await fetch(
        `/api/db/${params.id}/follow?follower=${currentUser?.id}`,
        { method },
      );

      if (response.ok) {
        setIsFollowing(!isFollowing);
      }
    }
  }, [isFollowing, currentUser, params.id]);

  useEffect(() => {
    (async () => {
      if (params.id && currentUser && currentUser.id) {
        const followStatus = await fetch(
          `/api/db/${params.id}/follow?follower=${currentUser?.id}`,
          { method: 'GET' },
        ).then((res) => {
          if (res.ok) return res.json();
        });
        setIsFollowing(!!followStatus);
      }
    })();
  }, [params.id, currentUser]);

  useEffect(() => {
    (async () => {
      const dbProfile = await fetch(`/api/db/${params.id}`).then((res) =>
        res.json(),
      );
      setProfile(dbProfile);
    })();
  }, [params.id]);

  useEffect(() => {
    (async () => {
      const currentUserProfile = await fetch(
        `/api/db/user/${session?.user.id}`,
      ).then((res) => res.json());
      setCurrentUser(currentUserProfile);
    })();
  }, [session?.user]);

  useEffect(() => {
    (async () => {
      const spotifyId = profile?.user.accounts.find(
        (account) => account.provider === 'spotify',
      )?.providerAccountId;
      if (spotifyId) {
        await sdk.users
          .profile(spotifyId)
          .then((sProfile: SpotifyUser) => {
            setAccounts((a) => [...a, sProfile]);
          })
          .catch((error) => {
            logger(
              { error },
              'ERROR: Error finding user external account: ' + spotifyId,
            );
          });
      }
    })();
  }, [profile]);

  const getAccountUrl = useCallback(
    (account: Account) => {
      if (account.provider === 'spotify') {
        return accounts.find((a) => a.id === account.providerAccountId)
          ?.external_urls.spotify;
      }
    },
    [accounts],
  );

  return (
    <Box className='h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='flex w-full items-center justify-between'>
          <h4 className='text-dark/50 dark:text-light/50'>Profile</h4>
          <div className='inline-flex items-center gap-x-2'>
            {/* FOLLOW BUTTON */}
            {currentUser && currentUser.profile?.id !== params.id && (
              <Tooltip
                content={`${isFollowing ? 'Unfollow' : 'Follow'} ${profile?.user.name}'s profile`}
              >
                <Button size='sm' onClick={handleFollow}>
                  {isFollowing ? 'Unfollow -' : 'Follow +'}
                </Button>
              </Tooltip>
            )}

            {/* LINK TO SOURCE ACCOUNT */}
            {profile?.user.accounts.map((account) => (
              <Tooltip
                key={account.provider}
                content={`Go to user's ${account.provider} profile`}
                delay={1000}
                classNames={{
                  content:
                    'text-dark bg-light dark:bg-dark dark:text-light p-4',
                  base: 'max-w-xs',
                }}
              >
                <IconLink
                  href={getAccountUrl(account) ?? ''}
                  target='_blank'
                  rel='noopener noreferrer'
                  icon={getSourceIcon(account.provider)}
                  variant='ghost'
                />
              </Tooltip>
            ))}
          </div>
        </div>

        <Suspense fallback={<Skeleton />}>
          {profile && (
            <User
              name={profile.user.name}
              description={
                <>
                  {profile.following && (
                    <div className='flex gap-x-1 items-center'>
                      <TbUserHeart className='text-dark/50 dark:text-light/50' />
                      <p>{profile.following.length}</p>
                      <p className='subtitle text-dark/50 dark:text-light/50'>
                        Following
                      </p>
                    </div>
                  )}
                  {profile.followers && (
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
