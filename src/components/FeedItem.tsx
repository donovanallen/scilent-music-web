'use client';

import { Skeleton } from '@nextui-org/react';
import { TrackItem } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';
import { BiAlbum, BiMicrophone } from 'react-icons/bi';
import { GiBackwardTime } from 'react-icons/gi';

import { cn, formatArtists, getTimestampText } from '@/lib/utils';

import NextImage from '@/components/NextImage';

interface FeedItemProps {
  data: TrackItem;
  timestamp?: Date;
  onClick?: (id: string) => void;
  className?: string;
}

const FeedItem: React.FC<FeedItemProps> = ({
  data,
  timestamp,
  onClick,
  className,
}) => {
  const [isItemLoaded, setIsItemLoaded] = useState(false);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
  };

  const image =
    'album' in data
      ? data.album?.images[0].url
      : data.type === 'episode'
        ? data.images[0].url
        : null;
  const artists =
    'artists' in data
      ? formatArtists(data.artists)
      : 'show' in data
        ? `${data.show.name} - ${data.show.publisher}`
        : null;

  return (
    <Skeleton className='rounded-md bg-neutral-500' isLoaded={isItemLoaded}>
      <div
        onLoad={() => setIsItemLoaded(true)}
        onClick={handleClick}
        className={cn(
          'flex items-start gap-x-2 cursor-pointer w-full rounded-md hover:bg-neutral-800/50',
          className,
        )}
      >
        <div className='relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden aspect-square m-1 bg-neutral-700'>
          {image ? (
            <NextImage
              src={image}
              alt={`Currently playing artwork: ${data.name}`}
              fill
              className='aspect-square object-cover'
              useSkeleton
            />
          ) : data.type === 'episode' ? (
            <BiMicrophone size={24} className='m-auto h-full text-dark' />
          ) : (
            <BiAlbum size={24} className='m-auto h-full text-dark' />
          )}
        </div>
        <div className='flex flex-col overflow-hidden'>
          <p className='text-light truncate'>{data.name}</p>

          {artists && (
            <p className='text-neutral-400 subtitle truncate'>{artists}</p>
          )}

          {timestamp && (
            <div className='inline-flex gap-x-1 items-center text-neutral-500 truncate'>
              <GiBackwardTime fontSize='small' />
              <span className='subtitle text-xs'>
                {getTimestampText(timestamp.toString())}
              </span>
            </div>
          )}
        </div>
      </div>
    </Skeleton>
  );
};

export default FeedItem;
