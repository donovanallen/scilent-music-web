'use client';

import { ScrollShadow, Tooltip } from '@nextui-org/react';
import {
  Account,
  Follow,
  PlayHistory as PlayHistoryModel,
  Profile as ScilentProfile,
  RecentlyPlayed,
  TopArtists,
  TopTracks,
  User as ScilentUser,
} from '@prisma/client';
import {
  PlayHistory,
  Track,
  TrackItem as SpotifyTrackItem,
  User as SpotifyUser,
} from '@spotify/web-api-ts-sdk';
import React, { Suspense, useCallback, useEffect, useState } from 'react';

import logger from '@/lib/logger';
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { firstName, getSourceIcon } from '@/lib/utils';
import { useTopMusic } from '@/hooks/useTopMusic';

import Box from '@/components/Box';
import CurrentlyPlaying from '@/components/CurrentlyPlaying';
import Header from '@/components/Header';
import ListLayout from '@/components/layouts/ListLayout';
import IconLink from '@/components/links/IconLink';
import Skeleton from '@/components/Skeleton';
import TopItems from '@/components/TopItems';
import TrackItem from '@/components/TrackItem';

import ProfileInfo from '@/app/(authenticated)/profile/components/ProfileInfo';
import TrackPlayerProvider from '@/providers/TrackPlayerProvider';

const Profile = ({ params }: { params: { id: string } }) => {
  const [profile, setProfile] = useState<
    | (ScilentProfile & {
        recentlyPlayed?: RecentlyPlayed[] & { tracks?: PlayHistoryModel[] };
      } & {
        topArtists?: TopArtists[];
        topTracks?: TopTracks[];
      } & {
        followers?: Follow[];
      } & { following?: Follow[] } & {
        user: ScilentUser & { accounts: Account[] };
      })
    | null
  >();

  const [accounts, setAccounts] = useState<SpotifyUser[]>([] as SpotifyUser[]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<PlayHistory[] | null>(
    [],
  );
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<SpotifyTrackItem | null>();

  const {
    artists: topArtists,
    tracks: topTracks,
    filterOptions,
    selectedFilter,
    setSelectedFilter,
    isLoading,
  } = useTopMusic('short_term', params.id);

  useEffect(() => {
    (async () => {
      const dbProfile = await fetch(`/api/db/${params.id}`).then((res) =>
        res.json(),
      );
      if (dbProfile) {
        setProfile(dbProfile);
        setCurrentlyPlaying(
          (dbProfile.currentlyPlaying?.track as SpotifyTrackItem) ?? null,
        );
        setRecentlyPlayed(
          dbProfile.recentlyPlayed?.tracks?.map((t: any) => {
            return {
              ...t,
              track: t.track as Track,
            } as PlayHistory;
          }) ?? [],
        );
      }
    })();
  }, [params.id]);

  useEffect(() => {
    (async () => {
      if (profile) {
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
        <div className='flex w-full items-center gap-x-2'>
          <h4 className='text-dark/50 dark:text-light/50'>{`Profile | ${profile?.type}`}</h4>
          <div className='inline-flex items-center gap-x-2'>
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

        <div className='flex gap-x-12 w-full items-start'>
          {/* PROFILE INFO */}
          <ProfileInfo
            {...(profile as ScilentProfile & { user: ScilentUser } & {
              followers: Follow[];
            } & { following: Follow[] })}
          />

          {/* CURRENTLY PLAYING */}
          {currentlyPlaying && (
            <div className='flex flex-1'>
              <TrackPlayerProvider>
                {/* TODO: Update to HeaderItem */}
                <CurrentlyPlaying />
              </TrackPlayerProvider>
            </div>
          )}
        </div>

        {/* TOP ITEMS */}
        {(topArtists || topTracks) && (
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
        )}
      </Header>
      <ScrollShadow
        hideScrollBar
        className='overflow-y-auto overflow-x-hidden p-6'
      >
        {recentlyPlayed && recentlyPlayed.length > 0 && (
          <>
            <h3 className='text-dark/80 dark:text-light/80 mb-4'>
              {`${firstName(profile?.user?.name as string)}'s Mix`}
            </h3>
            <ListLayout>
              {recentlyPlayed.map((track, i) => (
                <TrackItem
                  key={track?.played_at + i}
                  track={track.track as Track}
                  timestamp={new Date(track.played_at)}
                />
              ))}
            </ListLayout>
          </>
        )}
      </ScrollShadow>
    </Box>
  );
};

export default Profile;
