'use client';

import { ScrollShadow } from '@nextui-org/react';
import React, { useState } from 'react';

import Box from '@/components/Box';
import FilterOptions from '@/components/FilterOptions';
import Header from '@/components/Header';
import InfoIcon from '@/components/InfoIcon';

import { FilterOption, SearchFilterValue } from '@/constant/types';

import SearchContent from './components/SearchContent';

const SearchFilters: FilterOption[] = [
  {
    value: 'artist',
    desc: 'Show only artists in search results',
    label: 'Artists',
  },
  {
    value: 'album',
    desc: 'Show only albums in search results',
    label: 'Albums',
  },
  {
    value: 'track',
    desc: 'Show only tracks in search results',
    label: 'Tracks',
  },
];

// TODO: update to support multiple selected filters
const Search = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    SearchFilterValue | undefined
  >();

  return (
    <Box className='h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='flex items-center justify-between text-dark dark:text-light mb-4 cursor-pointer gap-x-4 md:justify-start'>
          {/* TITLE */}
          <div className='inline-flex items-center gap-x-2'>
            <h1 className='text-dark dark:text-brand-light w-fit text-lg sm:text-xl md:text-2xl'>
              Search
            </h1>
            <InfoIcon
              tooltipEnabled
              tooltip={{
                content:
                  'Search for any and all music. Use the filters to see a specific type of result. Support for playlists, users, genres and extended album types (mixtapes, compilations, etc.) coming soon. Undecided on support for podcasts, sorry 🤷',
              }}
            />
          </div>
          <div className='flex items-center w-fit gap-x-2 sm:gap-x-4 lg:gap-x-6'>
            <FilterOptions
              filterOptions={SearchFilters}
              selectedFilter={selectedFilter}
              onFilterSelect={setSelectedFilter as () => void}
              tooltipsEnabled
              isNullable
            />
          </div>
        </div>
        <input
          type='search'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='w-full subtitle p-2 placeholder:text-neutral-700 outline-none my-4 dark:caret-brand-light caret-dark bg-light dark:bg-dark rounded-sm'
          placeholder='Search music...'
        />
      </Header>
      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden px-6'>
          <SearchContent
            searchInput={searchInput}
            searchType={selectedFilter}
          />
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Search;
