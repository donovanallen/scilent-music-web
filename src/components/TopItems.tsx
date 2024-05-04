import { Album, Artist, Track } from '@spotify/web-api-ts-sdk';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { BiAlbum } from 'react-icons/bi';
import { FaChevronUp, FaMinus, FaPlus } from 'react-icons/fa6';
import { TbMusicHeart, TbUserHeart } from 'react-icons/tb';

import { cn, formatArtists } from '@/lib/utils';
import { useTopMusic } from '@/hooks/useTopMusic';

import Button from '@/components/Button';
import HeaderItem from '@/components/HeaderItem';

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
  if (!items) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <div className='flex gap-x-2 mb-6 text-brand-dark items-center'>
          {Icon && <Icon />}
          <h4 className='subtitle'>{title}</h4>
        </div>
      )}

      {items.length === 0 ? (
        <div
          className={cn(
            'py-24 border-2 border-neutral-600 rounded-md flex flex-col items-center justify-center gap-y-4 text-neutral-700 text-center',
          )}
        >
          {Icon && <Icon size={64} />}
          <h4 className='font-semibold '>Nothing to show</h4>
        </div>
      ) : (
        <ol className='flex flex-col gap-y-4'>
          {items?.map((item, i) => (
            <li
              key={i}
              className={cn(
                'border border-neutral-500 rounded-md py-4 px-2 overflow-hidden cursor-pointer hover:opacity-75 transition',
              )}
            >
              {item.type === 'artist' ? (
                <Link href={`/artist/${item.id}`}>
                  <div className='flex items-center gap-x-2'>
                    <h4 className='subtitle text-neutral-600'>{i + 1}</h4>
                    <h4 className='font-normal'>{item.name} </h4>
                  </div>
                </Link>
              ) : 'album' in item ? (
                <Link href={`/release/${item.album?.id}`}>
                  <div className='flex items-center gap-x-2'>
                    <h4 className='subtitle text-neutral-600'>{i + 1}</h4>
                    <h4 className='font-normal'>{item.name} </h4>
                  </div>
                  {'artists' in item && (
                    <p className='subtitle text-neutral-600 pl-6'>
                      {formatArtists(item.artists)}
                    </p>
                  )}
                </Link>
              ) : (
                <Link href={`/release/${item?.id}`}>
                  <div className='flex items-center gap-x-2'>
                    <h4 className='subtitle text-neutral-600'>{i + 1}</h4>
                    <h4 className='font-normal'>{item.name} </h4>
                  </div>
                  {'artists' in item && (
                    <p className='subtitle text-neutral-600 pl-6'>
                      {item.artists && formatArtists(item.artists)}
                    </p>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

const TopItems: React.FC<{ initExpanded?: boolean }> = ({
  initExpanded = false,
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(initExpanded);

  const {
    artists: topArtists,
    tracks: topTracks,
    albums: topAlbums,
    filterOptions,
    selectedFilter,
    setSelectedFilter,
  } = useTopMusic('short_term');

  return (
    <div className={cn('w-full h-full p-6')}>
      {/* TITLE */}
      <div
        className='flex items-center gap-x-2 text-light mb-4 cursor-pointer'
        onClick={() => setExpanded(!expanded)}
      >
        <h3>Top Music</h3>
        {/* TOP ITEMS FILTER OPTIONS */}
        {expanded && (
          <>
            {filterOptions && (topArtists || topAlbums || topTracks) && (
              // TODO: Refactor to FilterOptions component
              <div className='flex w-fit items-center justify-evenly self-center my-4'>
                {filterOptions.map((option) => (
                  <Button
                    key={option.value}
                    className={cn(
                      'subtitle text-neutral-800 bg-transparent hover:text-brand-dark transition',
                      selectedFilter == option.value
                        ? 'text-brand-primary'
                        : '',
                    )}
                    onClick={() => setSelectedFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
        {expanded ? <FaMinus /> : <FaPlus />}
      </div>

      {/* CONTAINER */}
      <div className='flex flex-col items-center'>
        {/* TOP ITEMS */}
        <div className={cn('flex w-full gap-x-6', expanded ? '' : '')}>
          {/* TOP ARTISTS */}
          <div className='flex flex-1'>
            {topArtists &&
              (!expanded ? (
                <HeaderItem
                  title='Top Artist'
                  name={topArtists[0].name}
                  icon={TbUserHeart}
                  image={topArtists[0].images[0].url}
                  href={`/artist/${topArtists[0].id}`}
                  onClick={() => router.push(`/artist/${topArtists[0].id}`)}
                  className='flex-1'
                />
              ) : (
                <ExpandedTopItem
                  title='Top Artists'
                  items={topArtists}
                  icon={TbUserHeart}
                />
              ))}
          </div>

          {/* TOP TRACKS */}
          <div className='flex flex-1'>
            {topTracks &&
              (!expanded ? (
                <HeaderItem
                  title='Top Track'
                  name={topTracks[0].name}
                  icon={TbMusicHeart}
                  image={topTracks[0].album.images[0].url}
                  href={`/release/${topTracks[0].album.id}`}
                  onClick={() =>
                    router.push(`/release/${topTracks[0].album.id}`)
                  }
                  className='flex-1'
                />
              ) : (
                <ExpandedTopItem
                  title='Top Tracks'
                  items={topTracks}
                  icon={TbMusicHeart}
                />
              ))}
          </div>

          {/* TOP ALBUMS */}
          <div className='flex flex-1'>
            {topAlbums &&
              (!expanded ? (
                <HeaderItem
                  title='Top Album'
                  name='Coming Soon'
                  icon={BiAlbum}
                  disabled
                  className='flex-1'
                />
              ) : (
                <ExpandedTopItem
                  title='Top Albums'
                  items={topAlbums}
                  icon={BiAlbum}
                />
              ))}
          </div>
        </div>

        {/* TOP ITEMS FILTER OPTIONS */}
        {filterOptions && (topArtists || topAlbums || topTracks) && (
          <div className='flex w-fit items-center justify-evenly self-center my-4'>
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                className={cn(
                  'subtitle text-neutral-800 bg-transparent hover:text-brand-dark transition',
                  selectedFilter == option.value ? 'text-brand-primary' : '',
                )}
                onClick={() => setSelectedFilter(option.value)}
              >
                {option.label}
              </Button>
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
      <hr />
    </div>
  );
};

export default TopItems;
