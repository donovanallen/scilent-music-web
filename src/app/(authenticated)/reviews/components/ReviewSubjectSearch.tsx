import { Autocomplete, AutocompleteItem, Avatar } from '@nextui-org/react';
import {
  Album,
  ItemTypes,
  SimplifiedAlbum,
  SimplifiedTrack,
  Track,
} from '@spotify/web-api-ts-sdk';
import { useDebounce } from '@uidotdev/usehooks';
import React, { useEffect, useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import sdk from '@/lib/spotify-sdk/ClientInstance';

import FilterOptions from '@/components/FilterOptions';
import NextPill from '@/components/Pill';

import {
  ReviewSubject,
  ReviewSubjectSearchFilters,
  ReviewSubjectTypes,
} from '@/constant/types';

type ReviewSubjectSearchProps = {
  onSubjectSelect: (
    subject: Track | Album | SimplifiedAlbum | SimplifiedTrack,
  ) => void;
};

function ReviewSubjectSearch({ onSubjectSelect }: ReviewSubjectSearchProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [reviewSubjectSearchType, setReviewSubjectSearchType] =
    useState<ReviewSubject | null>();
  const [results, setResults] =
    useState<(Track | Album | SimplifiedAlbum | SimplifiedTrack)[]>();
  // const [albumResults, setAlbumResults] =
  //   useState<(Album | SimplifiedAlbum)[]>();
  // const [trackResults, setTrackResults] =
  //   useState<(Track | SimplifiedTrack)[]>();

  const debouncedSearchInput = useDebounce(searchInput, 300);
  const memoizedSearchType: ItemTypes[] = useMemo(
    () =>
      reviewSubjectSearchType
        ? ([reviewSubjectSearchType] as ItemTypes[])
        : (ReviewSubjectTypes as ItemTypes[]),
    [reviewSubjectSearchType],
  );

  useEffect(() => {
    (async () => {
      if (debouncedSearchInput) {
        setIsLoading(true);
        const results = await sdk.search(
          debouncedSearchInput,
          memoizedSearchType,
        );
        if (!results) {
          setResults([] as (Track | Album)[]);
        } else {
          // if (results?.albums?.items) {
          //   setAlbumResults(() => results?.albums?.items);
          // }
          // if (results?.tracks?.items) {
          //   setTrackResults(() => results?.tracks?.items);
          // }
          const tracks = results.tracks?.items;
          const albums = results.albums?.items;
          if (tracks && albums) {
            setResults([...tracks, ...albums]);
          }
        }
        setIsLoading(false);
      }
    })();
  }, [debouncedSearchInput, memoizedSearchType]);

  return (
    <>
      <div className='flex items-center justify-between gap-x-6 mb-4'>
        <Autocomplete
          defaultItems={[] as (Track | Album)[]}
          items={results}
          placeholder='Search a track or album to review'
          inputValue={searchInput}
          onInputChange={(value) => setSearchInput(value || '')}
          onEmptied={() => {
            setSearchInput('');
            setResults([]);
          }}
          onClear={() => {
            setSearchInput('');
            setResults([]);
          }}
          startContent={
            <FaSearch className='my-auto mx-1 dark:text-light/50 text-dark/50 pointer-events-none flex-shrink-0' />
          }
          menuTrigger='input'
          shouldCloseOnBlur={false}
          aria-label='Search'
          isClearable
          radius='sm'
          size='lg'
          isLoading={isLoading}
          inputMode='search'
          inputProps={{
            classNames: {
              inputWrapper: isLoading ? 'animated-underline' : '',
            },
          }}
        >
          {/* {memoizedSearchType.map((t) => (
            <AutocompleteSection
              title={t === 'track' ? 'Tracks' : t === 'album' ? 'Albums' : ''}
            >
              {trackResults && (
                <AutocompleteItem key={item.id}>
                  {item.type} - {item.name}
                </AutocompleteItem>
              )}
            </AutocompleteSection>
          ))} */}
          {(item) => (
            <AutocompleteItem
              key={item.id}
              startContent={
                <Avatar
                  size='sm'
                  alt={item.name}
                  className='w-6 h-6'
                  src={
                    'album' in item
                      ? item.album.images[0].url
                      : 'images' in item
                        ? item.images[0].url
                        : undefined
                  }
                  showFallback
                />
              }
              onClick={() => {
                onSubjectSelect(item);
              }}
              endContent={<NextPill text={item.type} />}
            >
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        {/* <Input
          aria-label='Search'
          isClearable
          radius='sm'
          size='lg'
          type='search'
          value={searchInput}
          onValueChange={(value) => setSearchInput(value)}
          onClear={() => setSearchInput('')}
          placeholder='Search music to review'
          classNames={{
            label: 'text-black/50 dark:text-white/90',
            input: [
              'bg-transparent',
              'text-black/90 dark:text-white/90',
              'placeholder:text-default-700/50 dark:placeholder:text-white/60',
              'dark:caret-brand-light caret-dark',
              'subtitle',
            ],
            innerWrapper: 'bg-transparent',
            inputWrapper: [
              'shadow-xl',
              'bg-default-200/50',
              'dark:bg-default/60',
              'backdrop-blur-xl',
              'backdrop-saturate-200',
              'hover:bg-default-200/70',
              'dark:hover:bg-default/70',
              'group-data-[focus=true]:bg-default-200/50',
              'dark:group-data-[focus=true]:bg-default/60',
              '!cursor-text',
            ],
          }}
        /> */}
        <FilterOptions
          filterOptions={ReviewSubjectSearchFilters}
          selectedFilter={reviewSubjectSearchType}
          onFilterSelect={setReviewSubjectSearchType as () => void}
          isNullable
          className='w-fit'
        />
      </div>
    </>
  );
}

export default ReviewSubjectSearch;
