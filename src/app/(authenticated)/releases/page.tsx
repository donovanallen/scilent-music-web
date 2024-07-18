'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ScrollShadow } from '@nextui-org/react';
import { Album, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import React, { useEffect, useState } from 'react';

// import { TbMusicStar } from 'react-icons/tb';
import sdk from '@/lib/spotify-sdk/ClientInstance';

import AlbumsCollection from '@/components/AlbumsCollection';
// import { useAPIStatus } from '@/hooks/useAPIStatus';
// import { useFollowedArtists } from '@/hooks/useFollowedArtists';
// import { useFollowedArtists } from '@/hooks/useFollowedArtists';
import Box from '@/components/Box';
import FilterOptions from '@/components/FilterOptions';
import Header from '@/components/Header';
// import HeaderItem from '@/components/HeaderItem';
import InfoIcon from '@/components/InfoIcon';

// import { getUpcomingReleases } from '@/actions/getUpcomingReleases';
// import { batchUpcomingReleases } from '@/actions/getUpcomingReleases';
import { ReleaseFilters, ReleaseTypes } from '@/constant/types';

const Releases: React.FC = () => {
  // const { apiEnabled } = useAPIStatus();
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  // const [userReleases, setUserReleases] = useState<
  //   SimplifiedAlbum[] | Album[] | any[]
  // >([]);
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

  // const processedArtistsCtRef = useRef<number>(0);

  // useEffect(() => {
  //   if (followedArtists) {
  //     console.log(followedCount, followedArtists.length);

  //     (async () => {
  //       const batchSize = 20;
  //       const artistBatches = [];
  //       // let processedArtistsCount = 0;

  //       for (let i = 0; i < followedArtists.length; i += batchSize) {
  //         const batch = followedArtists.slice(i, i + batchSize);
  //         artistBatches.push(batch);
  //       }

  //       const results = await Promise.all(
  //         artistBatches.map(async (batch) => {
  //           const batchResults = await Promise.all(
  //             batch.map(async (artist) => {
  //               processedArtistsCtRef.current++;
  //               return await getUpcomingReleases(artist.name);
  //             }),
  //           );
  //           return batchResults;
  //         }),
  //       );

  //       const updatedUserReleases = results.flat();
  //       setUserReleases(updatedUserReleases);
  //       // const result = Promise.all(
  //       //   followedArtists.map(
  //       //     async (artist) => await getUpcomingReleases(artist.name)
  //       //   ),
  //       // );
  //       // console.log('user releases', result);
  //       // setFeaturedReleases(() => result.albums.items);
  //     })();
  //   }
  // }, [followedArtists, followedCount]);

  useEffect(() => {
    (async () => {
      const result = await sdk.browse.getNewReleases();
      setFeaturedReleases(() => result.albums.items);
    })();
  }, []);

  return (
    <Box className='h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='inline-flex items-center gap-x-2'>
          <h1 className='text-brand-dark dark:text-brand-light line-clamp-1 text-2xl sm:text-3xl md:h1'>
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
        {/* {apiEnabled && (
          <Progress
            isIndeterminate={isLoading}
            label='Searching for new releases...'
            size='md'
            radius='md'
            color='default'
            showValueLabel
            minValue={0}
            maxValue={followedCount}
            value={processedArtistsCtRef.current}
          />
        )}
        {userReleases.length > 0 &&
          userReleases.map(
            (r) =>
              r && (
                <HeaderItem
                  key={r.id}
                  title={`Coming ${r.releaseDate}`}
                  name={r.title}
                  icon={TbMusicStar}
                  image={r.artwork.url}
                  className='self-center cursor-default'
                  // disabled
                  // onClick={() =>
                  //   router.push(`/release/${r.album.id}`)
                  // }
                />
              ),
          )} */}
      </Header>
      <ScrollShadow hideScrollBar>
        {/* FEATURED RELEASES */}
        <div
          ref={parent}
          className='overflow-y-auto overflow-x-hidden py-4 px-6'
        >
          <div className='inline-flex items-center justify-between w-full'>
            <div className='inline-flex items-center gap-x-2'>
              <h3 className='w-fit text-lg sm:text-xl md:text-2xl'>
                Featured Releases
              </h3>
              {/* TODO: if user-curated releases, show link (small), onClick switch PageContent albums + title */}
              <InfoIcon
                tooltipEnabled
                tooltip={{
                  content: "These are Spotify's featured new releases",
                }}
              />
            </div>
            <FilterOptions
              filterOptions={ReleaseFilters}
              onFilterSelect={setSelectedReleaseFilter as () => void}
              selectedFilter={selectedReleaseFilter}
              tooltipsEnabled
              isNullable
              className='justify-self-end'
            />
          </div>
          <AlbumsCollection
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
