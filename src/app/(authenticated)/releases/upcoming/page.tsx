'use client';

import { Album, Artist, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import React, { memo, useCallback, useEffect, useState } from 'react';

import { useFollowedArtists } from '@/hooks/useFollowedArtists';

import AlbumsCollection from '@/components/AlbumsCollection';
import InfoIcon from '@/components/InfoIcon';

import { getUpcomingReleasesForMultipleArtists } from '@/actions/getUpcomingReleases';

const UpcomingReleases = () => {
  const { followedArtists, isLoading } = useFollowedArtists();
  const [totalArtists, setTotalArtists] = useState(0);
  const [processedArtists, setProcessedArtists] = useState(0);
  const [upcomingReleases, setUpcomingReleases] = useState<
    (SimplifiedAlbum | Album)[]
  >([]);

  const getUpcomingReleases = useCallback(async (artists: Artist[]) => {
    setTotalArtists(artists.length);
    setProcessedArtists(0); // Reset the processed count

    // Extract artist names for concurrent requests
    const artistNames: string[] = artists.map((artist) => artist.name);

    // Fetch releases for all artists concurrently
    const releases = await getUpcomingReleasesForMultipleArtists(artistNames);

    // Flatten and filter the releases
    const nonEmptyReleases = releases?.flat().filter(Boolean) as Album[];
    if (nonEmptyReleases.length > 0) {
      setUpcomingReleases((prev) => [...prev, ...nonEmptyReleases]);
      setProcessedArtists((prev) => prev + artists.length);
    }
  }, []);

  useEffect(() => {
    if (followedArtists?.length) {
      const fetchReleases = async () => {
        try {
          await getUpcomingReleases(followedArtists);
        } catch (error) {
          console.error('Error fetching user releases:', error);
        }
      };
      return () => {
        fetchReleases();
      };
    }
  }, [followedArtists, getUpcomingReleases]);

  return (
    upcomingReleases && (
      <>
        <div className='inline-flex items-center justify-between w-full'>
          <div className='inline-flex items-center gap-x-2'>
            <h3 className='w-fit text-lg sm:text-xl md:text-2xl'>
              Upcoming Releases
            </h3>
            <InfoIcon
              tooltipEnabled
              tooltip={{
                content: 'These are recent releases from your followed artists',
              }}
            />
          </div>
        </div>
        <AlbumsCollection
          albums={upcomingReleases as Album[]}
          albumContentProps={{ showArtist: true }}
        />
      </>
    )
  );
};

export default memo(UpcomingReleases);
