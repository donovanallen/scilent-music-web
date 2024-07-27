'use client';

import { ScrollShadow, Tooltip, User } from '@nextui-org/react';
// import TopItems from '@/components/TopItems';
// import ProfileAura from '@/app/(authenticated)/profile/components/ProfileAura';
// import ProfileInfo from '../components/ProfileInfo';
import {
  Account,
  Follow,
  Profile as ScilentProfile,
  TopArtists,
  TopTracks,
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
import { useTopMusic } from '@/hooks/useTopMusic';

import Box from '@/components/Box';
import Header from '@/components/Header';
import IconLink from '@/components/links/IconLink';
import Skeleton from '@/components/Skeleton';
import TopItems from '@/components/TopItems';

const Profile = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<
    ScilentProfile & { topArtists: TopArtists[]; topTracks: TopTracks[] } & {
      followers: Follow[];
    } & { following: Follow[] } & {
      user: ScilentUser & { accounts: Account[] };
    }
  >();
  const [accounts, setAccounts] = useState<SpotifyUser[]>([] as SpotifyUser[]);

  const [currentUser, setCurrentUser] = useState<
    ScilentUser & { profile: ScilentProfile }
  >();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const fetchFollowStatus = useCallback(async () => {
    if (currentUser?.profile?.id) {
      const response = await fetch(
        `/api/db/${params.id}/follow?follower=${currentUser.profile.id}`,
        { method: 'GET' },
      );
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      }
    }
  }, [currentUser, params.id]);
  const handleFollow = async () => {
    const method = isFollowing ? 'DELETE' : 'POST';

    // if (currentUser?.profile?.id) {
    //   const response = await fetch(
    //     `/api/db/${params.id}/follow?follower=${currentUser.profile.id}`,
    //     { method },
    //   );

    //   if (response.ok) {
    //     const data = await response.json();
    //     setIsFollowing(!data.follow);
    //     // setFollowersCount(data.followersCount);
    //   }
    // }
  };

  const {
    artists: topArtists,
    tracks: topTracks,
    albums: topAlbums,
    filterOptions,
    selectedFilter,
    setSelectedFilter,
    isLoading,
  } = useTopMusic('short_term', params.id);

  useEffect(() => {
    fetchFollowStatus();
  }, [fetchFollowStatus]);

  useEffect(() => {
    (async () => {
      const dbProfile: ScilentProfile & {
        topArtists: TopArtists[];
        topTracks: TopTracks[];
      } & {
        followers: Follow[];
      } & { following: Follow[] } & {
        user: ScilentUser & { accounts: Account[] };
      } = await fetch(`/api/db/${params.id}`).then((res) => res.json());
      setProfile(dbProfile);
      setFollowersCount(dbProfile?.followers.length);
      setFollowingCount(dbProfile?.following.length);
    })();
  }, [params.id, fetchFollowStatus, isFollowing]);

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
            {/* {currentUser && currentUser.profile?.id !== params.id && (
              <Tooltip
                isDisabled
                content={`${isFollowing ? 'Unfollow' : 'Follow'} ${profile?.user.name}'s profile`}
              >
                <Button size='sm' disabled onClick={handleFollow}>
                  {isFollowing ? 'Unfollow -' : 'Follow +'}
                </Button>
              </Tooltip>
            )} */}

            {/* LINK TO SOURCE ACCOUNT */}
            {profile?.user.accounts.map((account) => (
              <Tooltip
                key={account.provider}
                content={`Go to user's ${account.provider} profile`}
                isDisabled={!getAccountUrl(account)}
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
                      <p>{followingCount}</p>
                      <p className='subtitle text-dark/50 dark:text-light/50'>
                        Following
                      </p>
                    </div>
                  )}
                  {profile.followers && (
                    <div className='flex gap-x-1 items-center'>
                      <TbUserCheck className='text-dark/50 dark:text-light/50' />
                      <p>{followersCount}</p>
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
      <div className='overflow-y-auto overflow-x-hidden px-6 no-scrollbar'>
        {topArtists && topTracks && topAlbums && (
          <ScrollShadow hideScrollBar>
            <Suspense fallback={<Skeleton />}>
              <TopItems
                artists={topArtists}
                tracks={topTracks}
                albums={topAlbums}
                filterOptions={filterOptions}
                selectedFilter={selectedFilter}
                onFilterSelect={setSelectedFilter as () => void}
                isLoading={isLoading}
              />
            </Suspense>
          </ScrollShadow>
        )}
      </div>
    </Box>
  );
};

export default Profile;
