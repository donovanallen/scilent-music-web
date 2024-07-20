'use client';

import { Album, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import React, { memo, useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';

import AlbumsCollection from '@/components/AlbumsCollection';
import FilterOptions from '@/components/FilterOptions';
import LoadingIndicator from '@/components/LoadingIndicator';

import { ReleaseFilters, ReleaseTypes } from '@/constant/types';

const FeaturedReleases = () => {
  const [selectedReleaseFilter, setSelectedReleaseFilter] = useState<
    ReleaseTypes | undefined
  >();
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

  return loadingFeaturedReleases ? (
    <div className='flex flex-col gap-y-4 w-full'>
      <LoadingIndicator />
    </div>
  ) : (
    <div className='flex flex-col gap-y-4 w-full'>
      <div className='inline-flex items-center justify-between w-full'>
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
  );
};

export default memo(FeaturedReleases);
