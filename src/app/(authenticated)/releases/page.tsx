'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Progress, ScrollShadow } from '@nextui-org/react';
import { Album, Artist, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import { IImage, IReleaseGroupMatch } from 'musicbrainz-api';
import React, { useCallback, useEffect, useState } from 'react';

// import { TbMusicStar } from 'react-icons/tb';
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { useFollowedArtists } from '@/hooks/useFollowedArtists';

// import { useAPIStatus } from '@/hooks/useAPIStatus';
// import { useFollowedArtists } from '@/hooks/useFollowedArtists';
// import { useFollowedArtists } from '@/hooks/useFollowedArtists';
import Box from '@/components/Box';
import FilterOptions from '@/components/FilterOptions';
import Header from '@/components/Header';
// import HeaderItem from '@/components/HeaderItem';
import InfoIcon from '@/components/InfoIcon';
import PageContent from '@/components/PageContent';

import { getUpcomingReleasesForMultipleArtists } from '@/actions/getUpcomingReleases';
import { ReleaseFilters, ReleaseTypes } from '@/constant/types';

const BATCH_SIZE = 20; // Declare batch size as a constant

interface ReleaseGroup extends IReleaseGroupMatch {
  // id: string;
  mbid: string;
  artwork?: IImage;
  // title: string;
  type: string;
  date: string;
  artists: Array<{ artist?: { name: string }; name: string }>; // Simplified type
  // releases: Array<any>; // Add a more specific type if available
  // subTypes: Array<string>;
}

const Releases: React.FC = () => {
  // const { apiEnabled } = useAPIStatus();
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  const [userReleases, setUserReleases] = useState<(SimplifiedAlbum | Album)[]>(
    [],
  );

  const [featuredReleases, setFeaturedReleases] = useState<
    SimplifiedAlbum[] | Album[]
  >();

  const [selectedReleaseFilter, setSelectedReleaseFilter] = useState<
    ReleaseTypes | undefined
  >();

  const [totalArtists, setTotalArtists] = useState(0);
  const [processedArtists, setProcessedArtists] = useState(0);

  const {
    total: followedCount,
    followedArtists,
    isLoading,
  } = useFollowedArtists();

  const getReleases = useCallback(async (artists: Artist[]) => {
    setTotalArtists(artists.length);
    setProcessedArtists(0); // Reset the processed count

    // Extract artist names for concurrent requests
    const artistNames: string[] = artists.map((artist) => artist.name);

    // Fetch releases for all artists concurrently
    const releases = await getUpcomingReleasesForMultipleArtists(artistNames);

    // Flatten and filter the releases
    const nonEmptyReleases = releases?.flat().filter(Boolean) as Album[];

    setUserReleases((prev) => [...prev, ...nonEmptyReleases]);
    setProcessedArtists((prev) => prev + artists.length);
  }, []);

  // Fetch releases for a batch of artists
  // const getReleases = useCallback(async (artists: Artist[]) => {
  //   setTotalArtists(artists.length);
  //   setProcessedArtists(0); // Reset the processed count

  //   // const allReleases = [];

  //   // Fetch releases for each batch of artists
  //   for (let i = 0; i < artists.length; i += BATCH_SIZE) {
  //     const batch = artists.slice(i, Math.min(i + BATCH_SIZE, artists.length));
  //     const batchNames = batch.map((artist) => artist.name);

  //     const releases = await Promise.all(
  //       batchNames.map((name) => getUpcomingReleases(name)),
  //     );
  //     console.log('BATCH RELEASES: ', releases);

  //     const nonEmptyReleases = releases.flat().filter(Boolean) as Album[];

  //     setUserReleases((prev) => [...prev, ...nonEmptyReleases]);
  //     setProcessedArtists((prev) => prev + batch.length);

  //     // allReleases.push(...releases.flat());
  //     // setProcessedArtists((prev) => prev + batch.length); // Update processed artists
  //   }

  //   // Filter out empty or undefined releases once
  //   // const nonEmptyReleases = allReleases.filter(Boolean) as Album[];

  //   // Transform releases to Spotify format
  //   // const transformedReleases = transformToSpotifyFormat(nonEmptyReleases);

  //   // return nonEmptyReleases;
  // }, []);

  // Fetch user releases when followed artists change
  useEffect(() => {
    if (followedArtists?.length) {
      const fetchReleases = async () => {
        try {
          await getReleases(followedArtists);
        } catch (error) {
          console.error('Error fetching user releases:', error);
        }
      };
      fetchReleases();
    }
  }, [followedArtists, getReleases]);

  useEffect(() => {
    (async () => {
      try {
        const result = await sdk.browse.getNewReleases();
        setFeaturedReleases(() => result.albums.items);
      } catch (error) {
        console.error('Error fetching featured releases:', error);
      }
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
        <Progress
          value={processedArtists}
          maxValue={totalArtists}
          size='md'
          radius='md'
          color='primary'
          showValueLabel
          valueLabel={`${processedArtists} / ${totalArtists}`}
          label='Searching for new releases...'
          isIndeterminate={isLoading || !totalArtists}
        />
        {/* {userReleases.length > 0 &&
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
          {userReleases && (
            <>
              <div className='inline-flex items-center justify-between w-full'>
                <div className='inline-flex items-center gap-x-2'>
                  <h3 className='w-fit text-lg sm:text-xl md:text-2xl'>
                    User Releases
                  </h3>
                  {/* TODO: if user-curated releases, show link (small), onClick switch PageContent albums + title */}
                  <InfoIcon
                    tooltipEnabled
                    tooltip={{
                      content:
                        'These are recent releases from your followed artists',
                    }}
                  />
                </div>
                {/* <FilterOptions
                  filterOptions={ReleaseFilters}
                  onFilterSelect={setSelectedReleaseFilter as () => void}
                  selectedFilter={selectedReleaseFilter}
                  tooltipsEnabled
                  isNullable
                  className='justify-self-end'
                /> */}
              </div>
              <PageContent
                albums={userReleases as Album[]}
                albumContentProps={{ showArtist: true }}
              />
            </>
          )}
          {featuredReleases && (
            <>
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
            </>
          )}
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Releases;
