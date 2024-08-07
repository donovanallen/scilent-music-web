'use client';

import { Accordion, AccordionItem } from '@nextui-org/react';
import { Album, Artist, Track } from '@spotify/web-api-ts-sdk';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { IconType } from 'react-icons';
import { FaChevronUp, FaMinus, FaPlus } from 'react-icons/fa6';
import { TbMusicHeart, TbUserHeart } from 'react-icons/tb';

import { cn, formatArtists } from '@/lib/utils';
import { useTopMusic } from '@/hooks/useTopMusic';

import TextButton from '@/components/buttons/TextButton';
import HeaderItem from '@/components/HeaderItem';
import Skeleton from '@/components/Skeleton';

import { FilterValue } from '@/constant/types';

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
        <div className='flex gap-x-2 mb-4 text-brand-dark items-center'>
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
                    <h4 className='font-normal text-2xl md:text-xl lg:text-2xl xl:text-3xl line-clamp-1'>
                      {item.name}
                    </h4>
                    {'artists' in item && (
                      <p className='subtitle text-neutral-400 text-xs lg:text-sm line-clamp-1'>
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
                  'border border-neutral-500 rounded-md py-4 px-2 overflow-hidden cursor-pointer hover:opacity-75 transition',
                )}
              >
                {item.type === 'artist' ? (
                  <Link href={`/artist/${item.id}`}>
                    <div className='flex items-start gap-x-2'>
                      <h4 className='text-brand-dark subtitle'>{index + 1}</h4>
                      <h4 className='font-normal text-base md:text-sm lg:text-lg line-clamp-1'>
                        {item.name}
                      </h4>
                    </div>
                  </Link>
                ) : 'album' in item ? (
                  <Link href={`/release/${item.album?.id}`}>
                    <div className='flex items-start gap-x-2'>
                      <h4 className='text-brand-dark subtitle'>{index + 1}</h4>
                      <div>
                        <h4 className='subtitle font-normal text-base md:text-sm lg:text-lg line-clamp-1'>
                          {item.name}
                        </h4>
                        {'artists' in item && (
                          <p className='text-neutral-400 subtitle text-xs lg:text-sm line-clamp-1'>
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

const NextTopItems: React.FC<{ initExpanded?: boolean }> = ({
  initExpanded = false,
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(initExpanded);

  const {
    artists: topArtists,
    tracks: topTracks,
    filterOptions,
    selectedFilter,
    setSelectedFilter,
  } = useTopMusic('short_term');

  return (
    <div className={cn('w-full h-full p-6')}>
      <Accordion variant='light'>
        <AccordionItem
          key={1}
          aria-label='Top Items Accordion'
          title='Top Items'
          indicator={expanded ? <FaMinus /> : <FaPlus />}
          classNames={{
            title: 'h4 text-lg sm:text-xl md:text-2xl',
          }}
        >
          <div className='flex flex-col items-center'>
            {/* TOP ITEMS */}
            <Suspense fallback={<Skeleton />}>
              <div className={cn('flex w-full flex-col md:flex-row gap-4')}>
                {/* TOP ARTISTS */}
                <div className='w-full flex-1'>
                  {topArtists &&
                    (!expanded ? (
                      <>
                        <HeaderItem
                          title='Top Artist'
                          name={topArtists[0].name}
                          icon={TbUserHeart}
                          image={topArtists[0].images[0].url}
                          onClick={() =>
                            router.push(`/artist/${topArtists[0].id}`)
                          }
                        />
                      </>
                    ) : (
                      <ExpandedTopItem
                        title='Top Artists'
                        items={topArtists}
                        icon={TbUserHeart}
                      />
                    ))}
                </div>

                {/* TOP TRACKS */}
                <div className='w-full flex-1'>
                  {topTracks &&
                    (!expanded ? (
                      <HeaderItem
                        title='Top Track'
                        name={topTracks[0].name}
                        icon={TbMusicHeart}
                        image={topTracks[0].album.images[0].url}
                        onClick={() =>
                          router.push(`/release/${topTracks[0].album.id}`)
                        }
                      />
                    ) : (
                      <ExpandedTopItem
                        title='Top Tracks'
                        items={topTracks}
                        icon={TbMusicHeart}
                      />
                    ))}
                </div>
              </div>
            </Suspense>

            {/* TOP ITEMS FILTER OPTIONS */}
            {filterOptions && (topArtists || topTracks) && (
              <div className='flex w-fit items-center justify-evenly self-center my-4'>
                {filterOptions.map((option) => (
                  <TextButton
                    variant='basic'
                    key={option.value}
                    className={cn(
                      'subtitle text-neutral-800 bg-transparent hover:text-brand-dark transition',
                      selectedFilter == option.value
                        ? 'text-brand-primary'
                        : '',
                    )}
                    onClick={() =>
                      setSelectedFilter(option.value as FilterValue)
                    }
                  >
                    {option.label}
                  </TextButton>
                ))}
              </div>
            )}

            {/* SHOW MORE BUTTON */}
            {expanded && (
              <FaChevronUp
                onClick={() => setExpanded(!expanded)}
                size={24}
                className='my-4 text-neutral-500 hover:text-light cursor-pointer transition'
              />
            )}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default NextTopItems;
