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
    desc: 'Show artists in search results',
    label: 'Artists',
  },
  {
    value: 'album',
    desc: 'Show albums in search results',
    label: 'Albums',
  },
  {
    value: 'track',
    desc: 'Show tracks in search results',
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
    <Box className='bg-dark rounded-md h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='flex items-center justify-between text-light mb-4 cursor-pointer gap-x-4 md:justify-start'>
          {/* TITLE */}
          <div className='inline-flex items-center gap-x-2'>
            <h1 className='text-brand-light w-fit text-lg sm:text-xl md:text-2xl'>
              Search
            </h1>
            <InfoIcon />
          </div>
          <div className='flex items-center w-fit gap-x-2 sm:gap-x-4 lg:gap-x-6'>
            <FilterOptions
              filterOptions={SearchFilters}
              selectedFilter={selectedFilter}
              onFilterSelect={setSelectedFilter as () => void}
              isNullable
            />
          </div>
        </div>
        <input
          type='search'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='w-full subtitle p-2 placeholder:text-neutral-700 outline-none my-4 caret-brand-light rounded-sm'
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
