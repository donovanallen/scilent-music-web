'use client';

import { Album, Artist, Track } from '@spotify/web-api-ts-sdk';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { BiAlbum } from 'react-icons/bi';
import { FaChevronUp, FaMinus, FaPlus } from 'react-icons/fa6';
import { TbMusicHeart, TbUserHeart } from 'react-icons/tb';

import { cn, formatArtists } from '@/lib/utils';

import FilterOptions from '@/components/FilterOptions';
import HeaderItem from '@/components/HeaderItem';
import InfoIcon from '@/components/InfoIcon';
import LoadingIndicator from '@/components/LoadingIndicator';

import { FilterOption, FilterValue } from '@/constant/types';

interface ExpandedTopItemProps {
  items: (Artist | Track | Album)[];
  title?: string;
  className?: string;
  icon?: IconType;
}

const ExpandedTopItem: React.FC<ExpandedTopItemProps> = ({
  items,
  title,
  icon: Icon,
  className,
}) => {
  const router = useRouter();
  if (!items) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <div className='flex gap-x-2 mb-4 text-dark dark:text-brand-dark items-center'>
          {Icon && <Icon />}
          <h4 className='subtitle text-lg md:text-sm lg:text-base'>{title}</h4>
        </div>
      )}

      {items.length === 0 ? (
        <div
          className={cn(
            'border-2 border-neutral-600 rounded-md ',
            'flex flex-col items-center justify-center gap-y-4 overflow-x-clip',
            'text-neutral-500 text-center',
            'py-12 md:py-20 lg:py-24',
          )}
        >
          {Icon && <Icon className='text-3xl' />}
          <h4
            className={cn(
              'font-semibold text-base md:text-sm truncate',
              'sm:flex md:hidden lg:flex',
            )}
          >
            Nothing to show
          </h4>
        </div>
      ) : (
        <ol className='flex flex-col gap-y-2 w-full'>
          {items?.map((item, index) =>
            index === 0 ? (
              <HeaderItem
                key={index}
                onClick={() =>
                  router.push(
                    item.type === 'artist'
                      ? `/artist/${item.id}`
                      : 'album' in item
                        ? `/release/${item.album?.id}`
                        : `/release/${item.id}`,
                  )
                }
                image={
                  'album' in item
                    ? item.album.images[0].url
                    : item.images[0].url
                }
              >
                <div className='flex items-center gap-x-4 px-4 text-left'>
                  <h4 className='subtitle text-brand-primary text-xl md:text-base lg:text-xl'>
                    {index + 1}
                  </h4>
                  <div>
                    <h4 className='text-light font-normal text-2xl md:text-xl lg:text-2xl xl:text-3xl line-clamp-1'>
                      {item.name}
                    </h4>
                    {'artists' in item && (
                      <p className='subtitle text-light/80 text-xs lg:text-sm line-clamp-1'>
                        {formatArtists(item.artists)}
                      </p>
                    )}
                  </div>
                </div>
              </HeaderItem>
            ) : (
              <li
                key={index}
                className={cn(
                  'border border-dark/60 dark:border-light/60 rounded-md py-4 px-2 overflow-hidden cursor-pointer hover:opacity-75 transition',
                )}
              >
                {item.type === 'artist' ? (
                  <Link href={`/artist/${item.id}`}>
                    <div className='flex items-start gap-x-2'>
                      <h4 className='text-brand-dark subtitle'>{index + 1}</h4>
                      <h4 className='text-dark dark:text-light font-normal text-base md:text-sm lg:text-lg line-clamp-1'>
                        {item.name}
                      </h4>
                    </div>
                  </Link>
                ) : 'album' in item ? (
                  <Link href={`/release/${item.album?.id}`}>
                    <div className='flex items-start gap-x-2'>
                      <h4 className='text-brand-dark subtitle'>{index + 1}</h4>
                      <div>
                        <h4 className='text-dark dark:text-light subtitle font-normal text-base md:text-sm lg:text-lg line-clamp-1'>
                          {item.name}
                        </h4>
                        {'artists' in item && (
                          <p className='text-dark/80 dark:text-light/80 subtitle text-xs lg:text-sm line-clamp-1'>
                            {formatArtists(item.artists)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link href={`/release/${item?.id}`}>
                    <div className='flex items-center gap-x-2'>
                      <h4 className='text-brand-dark subtitle'>{index + 1}</h4>
                      <h4 className='font-normal'>{item.name} </h4>
                    </div>
                    {'artists' in item && (
                      <p className='text-neutral-400 subtitle pl-6 line-clamp-1'>
                        {item.artists && formatArtists(item.artists)}
                      </p>
                    )}
                  </Link>
                )}
              </li>
            ),
          )}
        </ol>
      )}
    </div>
  );
};

const TopItems: React.FC<{
  initExpanded?: boolean;
  artists?: Artist[];
  tracks?: Track[];
  albums?: Album[];
  filterOptions?: FilterOption[];
  selectedFilter?: FilterValue;
  onFilterSelect?: (filterValue?: FilterValue) => void;
  isLoading?: boolean;
}> = ({
  initExpanded = false,
  artists,
  tracks,
  albums,
  filterOptions,
  selectedFilter,
  onFilterSelect,
  isLoading,
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(initExpanded);

  return (
    <div className={cn('w-full h-auto py-6 border-b-2')}>
      {/* HEADER */}
      <div className='flex items-center justify-between text-dark dark:text-light mb-4 cursor-pointer gap-x-1'>
        {/* TITLE */}
        <div className='inline-flex items-center gap-x-2'>
          <h3
            onClick={() => setExpanded(!expanded)}
            className='w-fit text-lg sm:text-xl md:text-2xl'
          >
            Top Music
          </h3>
          <div
            onClick={() => setExpanded(!expanded)}
            className='text-lg md:text-xl'
          >
            {expanded ? <FaMinus /> : <FaPlus />}
          </div>
          <InfoIcon
            tooltipEnabled
            tooltip={{
              content:
                'These are your top artists and tracks over the selected time period. Expand to see your full Top 20 for each category. Adjust the time filter to see more. Top Albums and Genres coming soon.',
            }}
          />
        </div>

        {/* TOP ITEMS FILTER OPTIONS */}
        {filterOptions && (artists || albums || tracks) && (
          <div className='inline-flex items-center gap-x-4'>
            <FilterOptions
              filterOptions={filterOptions}
              selectedFilter={selectedFilter}
              onFilterSelect={onFilterSelect as () => void}
              tooltipsEnabled
            />
          </div>
        )}
      </div>

      {/* CONTAINER */}
      <div className='flex flex-col items-center'>
        {/* TOP ITEMS */}
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <div className={cn('flex w-full flex-col md:flex-row gap-4')}>
            {/* TOP ARTISTS */}
            <div className='w-full flex-1'>
              {artists &&
                (!expanded ? (
                  <HeaderItem
                    title='Top Artist'
                    name={artists[0].name}
                    icon={TbUserHeart}
                    image={artists[0].images[0].url}
                    onClick={() => router.push(`/artist/${artists[0].id}`)}
                  />
                ) : (
                  <ExpandedTopItem
                    title='Top Artists'
                    items={artists}
                    icon={TbUserHeart}
                  />
                ))}
            </div>

            {/* TOP TRACKS */}
            <div className='w-full flex-1'>
              {tracks &&
                (!expanded ? (
                  <HeaderItem
                    title='Top Track'
                    name={tracks[0].name}
                    icon={TbMusicHeart}
                    image={tracks[0].album.images[0].url}
                    onClick={() =>
                      router.push(`/release/${tracks[0].album.id}`)
                    }
                  />
                ) : (
                  <ExpandedTopItem
                    title='Top Tracks'
                    items={tracks}
                    icon={TbMusicHeart}
                  />
                ))}
            </div>

            {/* TOP ALBUMS */}
            <div className='w-full flex-1'>
              {albums &&
                (!expanded ? (
                  <HeaderItem
                    title='Top Album'
                    name='Coming Soon'
                    icon={BiAlbum}
                    disabled
                  />
                ) : (
                  <ExpandedTopItem
                    title='Top Albums'
                    items={albums}
                    icon={BiAlbum}
                  />
                ))}
            </div>
          </div>
        )}

        {/* SHOW MORE BUTTON */}
        {!isLoading && expanded && (artists || albums || tracks) && (
          <FaChevronUp
            onClick={() => setExpanded(!expanded)}
            size={24}
            className='my-4 text-neutral-500 hover:text-dark dark:hover:text-light cursor-pointer transition'
          />
        )}
      </div>
    </div>
  );
};

export default TopItems;
