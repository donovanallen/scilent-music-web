'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Input, Skeleton } from '@nextui-org/react';
import { Album, Track, TrackItem } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaMinus, FaPlus } from 'react-icons/fa6';

import { cn } from '@/lib/utils';
import { useTopMusic } from '@/hooks/useTopMusic';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
import FilterOptions from '@/components/FilterOptions';
import Header from '@/components/Header';
import HeaderItem from '@/components/HeaderItem';
import InfoIcon from '@/components/InfoIcon';
import LoadingIndicator from '@/components/LoadingIndicator';
import ReviewCreate from '@/components/review/ReviewCreate';

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
  console.log(params);
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const [searchInput, setSearchInput] = useState('');
  const [reviewSubject, setReviewSubject] = useState<Album | Track | null>();
  const [reviewSubjectSearchType, setReviewSubjectSearchType] =
    useState<ReviewSubjectTypes>();
  const [expanded, setExpanded] = useState(true);

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
        {/* TITLE */}
        <div ref={parent} className='inline-flex items-center'>
          <Button
            onClick={() => setExpanded(!expanded)}
            variant='ghost'
            rightIcon={expanded ? FaMinus : FaPlus}
            className='text-dark/60 dark:text-light/60'
          >
            <h4>Suggested Review Subjects</h4>
          </Button>
          <InfoIcon
            tooltipEnabled
            tooltip={{
              content: 'Get started with some of your recent favorites.',
            }}
          />
        </div>
        {isLoading && <LoadingIndicator />}
        {topTracks && (
          <div
            className={cn(
              expanded ? 'grid grid-flow-row gap-6 grid-cols-3' : 'hidden',
            )}
          >
            {topTracks.slice(0, 3).map((track, i) => (
              <Skeleton
                className='rounded-md bg-neutral-500'
                isLoaded={!!topTracks}
                key={track.id}
              >
                <HeaderItem
                  key={track.id}
                  title={`#${i + 1}`}
                  name={track.name}
                  image={track.album.images[0].url}
                  onClick={() => {
                    setReviewSubject(track);
                    setExpanded(false);
                  }}
                />
              </Skeleton>
            ))}
          </div>
        )}
      </Header>

      <div className='flex w-2/3 overflow-y-auto overflow-x-hidden self-center py-6'>
        {reviewSubject && (
          <ReviewCreate
            subject={reviewSubject}
            type={'album' in reviewSubject ? 'track' : 'album'}
          />
        )}
      </div>
    </Box>
  );
};

export default NewReview;
