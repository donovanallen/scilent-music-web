'use client';

import { Input, Skeleton } from '@nextui-org/react';
import { Album, Track, TrackItem } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { useTopMusic } from '@/hooks/useTopMusic';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
import FilterOptions from '@/components/FilterOptions';
import Header from '@/components/Header';
import HeaderItem from '@/components/HeaderItem';
import ReviewCreate from '@/components/ReviewCreate';

import {
  ReviewSubjectSearchFilters,
  ReviewSubjectTypes,
} from '@/constant/types';

const NewReview = ({
  params,
}: {
  params: {
    id: string;
    subject:
      | { id: string; type: string; name: string }
      | Track
      | Album
      | TrackItem;
    text?: string;
  };
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [reviewSubject, setReviewSubject] = useState<Album | Track | null>();
  const [reviewSubjectSearchType, setReviewSubjectSearchType] =
    useState<ReviewSubjectTypes>();
  console.log(params);

  const { tracks: topTracks, isLoading } = useTopMusic('short_term');
  // const searchParams = useSearchParams();

  // const router = useRouter();
  // const qParams = router.query; // Destructure the query parameters
  // console.log(qParams);
  // console.log(searchParams);

  // console.log('Reaction subject :: ', subject);
  // const album = subject && 'album' in subject ? subject.album : undefined;
  // const image = album ? album.images[0].url : undefined;

  // useEffect(() => {
  //   first

  //   return () => {
  //     second
  //   }
  // }, [topTracks])

  return (
    <Box className='h-full flex flex-col'>
      <Header>
        <div className='w-full inline-flex items-center justify-between'>
          <h3>Create Review</h3>
          {reviewSubject && (
            <Button variant='primary' onClick={() => setReviewSubject(null)}>
              New
            </Button>
          )}
        </div>
        {/* SEARCH */}
        {!reviewSubject && (
          <div className='flex items-center justify-between gap-x-6 mb-4'>
            <Input
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
              startContent={
                <FaSearch className='my-auto mx-1 dark:text-light/50 text-dark/50 pointer-events-none flex-shrink-0' />
              }
            />
            <FilterOptions
              filterOptions={ReviewSubjectSearchFilters}
              selectedFilter={reviewSubjectSearchType}
              onFilterSelect={setReviewSubjectSearchType as () => void}
              isNullable
              className='w-fit'
            />
          </div>
        )}

        {/* SUGGESTED REVIEW SUBJECTS */}
        <h4 className='subtitle text-dark/60 dark:text-light/60'>
          Suggested Review Subjects
        </h4>
        <Skeleton
          className='rounded-md bg-neutral-500'
          isLoaded={topTracks && !isLoading}
        >
          {topTracks && (
            <div className='grid grid-flow-row gap-6 grid-cols-3'>
              {topTracks.slice(0, 3).map((track, i) => (
                <HeaderItem
                  key={track.id}
                  title={`#${i + 1}`}
                  name={track.name}
                  image={track.album.images[0].url}
                  onClick={() => setReviewSubject(track)}
                />
              ))}
            </div>
          )}
        </Skeleton>
      </Header>

      <div className='flex w-full overflow-y-auto overflow-x-hidden p-10'>
        {reviewSubject && <ReviewCreate subject={reviewSubject} />}
      </div>
    </Box>
  );
};

export default NewReview;
