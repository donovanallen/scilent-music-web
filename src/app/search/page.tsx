'use client';

import { ItemTypes } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Header from '@/components/Header';

import SearchContent from '@/app/search/components/SearchContent';

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
    <Box className='h-full overflow-hidden overflow-y-scroll no-scrollbar px-6'>
      <Header>
        <div className='w-full flex items-center gap-x-2'>
          <h1 className='text-brand-light'>Search</h1>
          {SearchFilters.map((option) => (
            <Button
              key={option.value}
              className={cn(
                'subtitle text-neutral-800 bg-transparent hover:text-brand-dark transition',
                selectedFilter == option.value ? 'text-brand-primary' : '',
              )}
              onClick={() =>
                setSelectedFilter(
                  selectedFilter == option.value ? undefined : option.value,
                )
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
        <input
          type='search'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='w-full subtitle p-2 placeholder:text-neutral-700 outline-none my-4 caret-brand-light rounded-sm'
          placeholder='Search music...'
        />
      </Header>
      <SearchContent searchInput={searchInput} searchType={selectedFilter} />
    </Box>
  );
};

export default Search;
