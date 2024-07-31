'use client';

import { ScrollShadow, Tooltip } from '@nextui-org/react';
import {
  Account,
  Follow,
  Profile as ScilentProfile,
  User as ScilentUser,
} from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { Suspense, useCallback, useEffect, useState } from 'react';

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
  const { data: session } = useSession();
  const [accountUrls, setAccountUrls] = useState<{
    [key: string]: string | undefined;
  }>({});
  const [profile, setProfile] = useState<
    ScilentProfile & { user: ScilentUser & { accounts: Account[] } } & {
      following: Follow[];
      followers: Follow[];
    }
  >();
  const {
    artists: topArtists,
    tracks: topTracks,
    filterOptions,
    selectedFilter,
    setSelectedFilter,
    isLoading,
  } = useTopMusic('short_term');

  const getAccountUrl = useCallback(async (account: Account) => {
    if (account.provider === 'spotify') {
      const spotifyUrl = (await sdk.users.profile(account.providerAccountId))
        .external_urls.spotify;
      return spotifyUrl;
    }
  }, []);

  useEffect(() => {
    const fetchAccountUrls = async () => {
      if (profile?.user?.accounts) {
        const urls = await Promise.all(
          profile.user.accounts.map(async (account) => ({
            provider: account.provider,
            url: await getAccountUrl(account),
          })),
        );
        setAccountUrls(
          Object.fromEntries(urls.map(({ provider, url }) => [provider, url])),
        );
      }
    };

    fetchAccountUrls();
  }, [profile, getAccountUrl]);

  useEffect(() => {
    (async () => {
      const result = await fetch(`/api/db/${session?.user.id}`).then((res) =>
        res.json(),
      );
      setProfile(
        () =>
          result as ScilentProfile & {
            user: ScilentUser & { accounts: Account[] };
          } & { following: Follow[]; followers: Follow[] },
      );
    })();
  }, [session]);

  return (
    <Box className='h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='flex w-full items-center justify-between'>
          <div className='flex w-full items-center gap-x-2'>
            <h4 className='text-dark/50 dark:text-light/50'>{`My Profile | ${profile?.type}`}</h4>
            <div className='inline-flex items-center gap-x-2'>
              {/* LINK TO SOURCE ACCOUNT */}
              {profile?.user?.accounts?.map((account) => (
                <Tooltip
                  key={account.provider}
                  content={`Go to user's ${account.provider} profile`}
                  isDisabled={!accountUrls[account.provider]}
                  delay={1000}
                  classNames={{
                    content:
                      'text-dark bg-light dark:bg-dark dark:text-light p-4',
                    base: 'max-w-xs',
                  }}
                >
                  <IconLink
                    href={accountUrls[account.provider] ?? ''}
                    target='_blank'
                    rel='noopener noreferrer'
                    icon={getSourceIcon(account.provider)}
                    variant='ghost'
                  />
                </Tooltip>
              ))}
            </div>
          </div>
          {/* <IconLink variant='ghost' href='/settings' icon={TbSettings} /> */}
        </div>

        <Suspense fallback={<Skeleton />}>
          {profile && (
            <ProfileInfo
              {...(profile as ScilentProfile & { user: ScilentUser } & {
                followers: Follow[];
              } & { following: Follow[] })}
            />
          )}
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
