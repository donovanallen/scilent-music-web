'use client';

import { ScrollShadow } from '@nextui-org/react';
import { ItemTypes } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import Box from '@/components/Box';
import TextButton from '@/components/buttons/TextButton';
import Header from '@/components/Header';

import SearchContent from './components/SearchContent';

const SearchFilters = [
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
    ItemTypes | string | undefined
  >();

  return (
    <Box className='bg-dark rounded-md h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='flex items-center justify-between text-light mb-4 cursor-pointer gap-x-4 md:justify-start'>
          <h1 className='text-brand-light w-fit text-lg sm:text-xl md:text-2xl'>
            Search
          </h1>
          <div className='flex items-center w-fit gap-x-2 sm:gap-x-4 lg:gap-x-6'>
            {SearchFilters.map((option) => (
              <TextButton
                key={option.value}
                className={cn(
                  'subtitle text-neutral-800 hover:text-brand-dark',
                  'bg-transparent transition',
                  'flex',
                  selectedFilter == option.value ? 'text-brand-primary' : '',
                )}
                variant='basic'
                onClick={() =>
                  setSelectedFilter(
                    selectedFilter == option.value ? undefined : option.value,
                  )
                }
              >
                {option.label}
              </TextButton>
            ))}
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
