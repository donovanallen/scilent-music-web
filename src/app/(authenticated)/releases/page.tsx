'use client';

import { ScrollShadow } from '@nextui-org/react';
import { Album, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';

// import { useFollowedArtists } from '@/hooks/useFollowedArtists';
import Box from '@/components/Box';
import FilterOptions from '@/components/FilterOptions';
import Header from '@/components/Header';
import InfoIcon from '@/components/InfoIcon';
import PageContent from '@/components/PageContent';

import { ReleaseFilters, ReleaseTypes } from '@/constant/types';

const Releases: React.FC = () => {
  const session = useSession();
  const [featuredReleases, setFeaturedReleases] = useState<
    SimplifiedAlbum[] | Album[]
  >();

  const [selectedReleaseFilter, setSelectedReleaseFilter] = useState<
    ReleaseTypes | undefined
  >();

  // const {
  //   total: followedCount,
  //   followedArtists,
  //   isLoading,
  // } = useFollowedArtists();

  // useEffect(() => {
  //   if (followedArtists) {
  //     console.log(followedCount, followedArtists.length);
  //     (async () => {
  //       const result = await fetchMostRecentReleases(
  //         followedArtists.map((a) => a.id),
  //       );
  //       console.log('follow releases', result);
  //       // setFeaturedReleases(() => result.albums.items);
  //     })();
  //   }
  // }, [followedArtists, followedCount]);

  useEffect(() => {
    if (session) {
      (async () => {
        const result = await sdk.browse.getNewReleases();
        setFeaturedReleases(() => result.albums.items);
      })();
    }
  }, [session]);

  return (
    <Box className='bg-dark rounded-md h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='inline-flex items-center gap-x-2'>
          <h1 className='text-brand-light line-clamp-1 text-2xl sm:text-3xl md:h1'>
            Release Hub
          </h1>
          <InfoIcon
            tooltipEnabled
            tooltip={{
              content:
                'The Release Hub is home to all the recent and upcoming releases from your favorite artists.',
            }}
          />
        </div>
      </Header>
      <ScrollShadow hideScrollBar>
        {/* FEATURED RELEASES */}
        <div className='overflow-y-auto overflow-x-hidden py-4 px-6'>
          <div className='inline-flex items-center gap-x-2'>
            <h3 className='w-fit text-lg sm:text-xl md:text-2xl'>
              Featured Releases
            </h3>
            <InfoIcon
              tooltipEnabled
              tooltip={{
                content: "These are Spotify's featured new releases",
              }}
            />
            <FilterOptions
              filterOptions={ReleaseFilters}
              onFilterSelect={setSelectedReleaseFilter as () => void}
              selectedFilter={selectedReleaseFilter}
              tooltipsEnabled
              isNullable
            />
          </div>
          <PageContent
            albums={
              selectedReleaseFilter
                ? (featuredReleases?.filter(
                    (r) => r.album_type === selectedReleaseFilter,
                  ) as SimplifiedAlbum[])
                : featuredReleases
            }
            albumContentProps={{ showArtist: true }}
          />
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Releases;
