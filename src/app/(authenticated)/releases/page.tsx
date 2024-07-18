'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ScrollShadow } from '@nextui-org/react';
import { Album, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import { compareDesc } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { IoRefresh } from 'react-icons/io5';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { useFollowedArtists } from '@/hooks/useFollowedArtists';

import AlbumsCollection from '@/components/AlbumsCollection';
import Box from '@/components/Box';
import IconButton from '@/components/buttons/IconButton';
import FilterOptions from '@/components/FilterOptions';
import Header from '@/components/Header';
import InfoIcon from '@/components/InfoIcon';
import LoadingIndicator from '@/components/LoadingIndicator';

import { ReleaseFilters, ReleaseTypes } from '@/constant/types';

// interface ReleaseGroup extends IReleaseGroupMatch {
//   // id: string;
//   mbid: string;
//   artwork?: IImage;
//   // title: string;
//   type: string;
//   date: string;
//   artists: Array<{ artist?: { name: string }; name: string }>; // Simplified type
//   // releases: Array<any>; // Add a more specific type if available
//   // subTypes: Array<string>;
// }

const Releases: React.FC = () => {
  const [parent] = useAutoAnimate();

  const [selectedReleaseFilter, setSelectedReleaseFilter] = useState<
    ReleaseTypes | undefined
  >();

  const { followedArtists, isLoading } = useFollowedArtists();

  // ALL USER RELEASES
  const [userReleases, setUserReleases] =
    useState<(SimplifiedAlbum | Album)[]>();
  const [loadingUserReleases, setLoadingUserReleases] = useState(false);
  const splitIntoBatches = (array: any[], batchSize: number) => {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  };
  const getAllUserReleases = async () => {
    setLoadingUserReleases(true);
    try {
      const batchSize = 20; // Adjust this value based on Spotify's rate limits
      const artistBatches = splitIntoBatches(followedArtists, batchSize);
      let allAlbums: SimplifiedAlbum[] = [];

      for (const batch of artistBatches) {
        const batchResults = await Promise.all(
          batch.map((artist) => sdk.artists.albums(artist.id)),
        );
        allAlbums = [...allAlbums, ...batchResults.flatMap((r) => r.items)];

        // Add a delay between batches to further reduce the risk of hitting rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const allUserReleases = allAlbums
        .filter((a) => {
          const releaseDate = new Date(a.release_date);
          return (
            a.release_date_precision === 'day' &&
            a.release_date &&
            releaseDate >= thirtyDaysAgo
          );
        })
        .sort((a, b) => compareDesc(a?.release_date, b?.release_date));

      setUserReleases(() => allUserReleases);
    } catch (error) {
      console.error('Error fetching user releases:', error);
    } finally {
      setLoadingUserReleases(false);
    }
  };
  useEffect(() => {
    (async () => {
      if (!followedArtists?.length) return;
      await getAllUserReleases();
    })();
  }, [followedArtists]);

  // FEATURED RELEASES
  const [featuredReleases, setFeaturedReleases] =
    useState<(SimplifiedAlbum | Album)[]>();
  const [loadingFeaturedReleases, setLoadingFeaturedReleases] = useState(false);
  const getFeaturedReleases = async () => {
    setLoadingFeaturedReleases(true);
    try {
      const result = await sdk.browse.getNewReleases();
      setFeaturedReleases(() => result.albums.items);
    } catch (error) {
      console.error('Error fetching featured releases:', error);
    } finally {
      setLoadingFeaturedReleases(false);
    }
  };
  useEffect(() => {
    (async () => {
      await getFeaturedReleases();
    })();
  }, []);

  // UPCOMING RELEASES
  // const [totalArtists, setTotalArtists] = useState(0);
  // const [processedArtists, setProcessedArtists] = useState(0);
  // const [upcomingReleases, setUpcomingReleases] = useState<
  //   (SimplifiedAlbum | Album)[]
  // >([]);
  // const getUpcomingReleases = useCallback(async (artists: Artist[]) => {
  //   setTotalArtists(artists.length);
  //   setProcessedArtists(0); // Reset the processed count

  //   // Extract artist names for concurrent requests
  //   const artistNames: string[] = artists.map((artist) => artist.name);

  //   // Fetch releases for all artists concurrently
  //   const releases = await getUpcomingReleasesForMultipleArtists(artistNames);

  //   // Flatten and filter the releases
  //   const nonEmptyReleases = releases?.flat().filter(Boolean) as Album[];
  //   if (nonEmptyReleases.length > 0) {
  //     setUpcomingReleases((prev) => [...prev, ...nonEmptyReleases]);
  //     setProcessedArtists((prev) => prev + artists.length);
  //   }
  // }, []);
  // useEffect(() => {
  //   if (followedArtists?.length) {
  //     const fetchReleases = async () => {
  //       try {
  //         await getUpcomingReleases(followedArtists);
  //       } catch (error) {
  //         console.error('Error fetching user releases:', error);
  //       }
  //     };
  //     return () => {
  //       fetchReleases();
  //     };
  //   }
  // }, [followedArtists, getUpcomingReleases]);

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
      </Header>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollShadow hideScrollBar>
          <div
            ref={parent}
            className='overflow-y-auto overflow-x-hidden py-4 px-6'
          >
            {/* USER RELEASES */}
            <>
              <div className='inline-flex items-center justify-between w-full'>
                <div className='inline-flex items-center gap-x-2'>
                  <h3 className='w-fit text-lg sm:text-xl md:text-2xl'>
                    User Releases
                  </h3>
                  <InfoIcon
                    tooltipEnabled
                    tooltip={{
                      content:
                        'These are recent releases from your followed artists',
                    }}
                  />
                  <IconButton
                    variant='ghost'
                    icon={IoRefresh}
                    onClick={getAllUserReleases}
                    classNames={{
                      icon: loadingUserReleases ? 'animate-spin' : '',
                    }}
                    disabled={loadingUserReleases}
                  />
                </div>
              </div>
              {userReleases && userReleases.length > 0 && (
                <AlbumsCollection
                  albums={userReleases as Album[]}
                  albumContentProps={{ showArtist: true }}
                />
              )}
            </>

            {/* FEATURED RELEASES */}
            <>
              <div className='inline-flex items-center justify-between w-full'>
                <div className='inline-flex items-center gap-x-2'>
                  <h3 className='w-fit text-lg sm:text-xl md:text-2xl'>
                    Featured Releases
                  </h3>
                  {/* TODO: if user-curated releases, show link (small), onClick switch page content albums + title */}
                  <InfoIcon
                    tooltipEnabled
                    tooltip={{
                      content: "These are Spotify's featured new releases",
                    }}
                  />
                  <IconButton
                    variant='ghost'
                    icon={IoRefresh}
                    onClick={getAllUserReleases}
                    classNames={{
                      icon: loadingFeaturedReleases ? 'animate-spin' : '',
                    }}
                    disabled={loadingFeaturedReleases}
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
            </>

            {/* UPCOMING RELEASES */}
            {/* {upcomingReleases && (
            <>
              <div className='inline-flex items-center justify-between w-full'>
                <div className='inline-flex items-center gap-x-2'>
                  <h3 className='w-fit text-lg sm:text-xl md:text-2xl'>
                    User Releases
                  </h3>
                  <InfoIcon
                    tooltipEnabled
                    tooltip={{
                      content:
                        'These are recent releases from your followed artists',
                    }}
                  />
                </div>

              </div>
              <AlbumsCollection
                albums={upcomingReleases as Album[]}
                albumContentProps={{ showArtist: true }}
              />
            </>
          )} */}
          </div>
        </ScrollShadow>
      )}
    </Box>
  );
};

export default Releases;
