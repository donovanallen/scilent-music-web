'use client';

import { Track } from '@spotify/web-api-ts-sdk';
import React from 'react';
import { BiAlbum } from 'react-icons/bi';
import { GiBackwardTime } from 'react-icons/gi';

import { cn, formatArtists, getTimestampText } from '@/lib/utils';

import NextImage from '@/components/NextImage';

interface FeedItemProps {
  data: Track;
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
  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start gap-x-2 cursor-pointer w-full rounded-md hover:bg-neutral-800/50',
        className,
      )}
    >
      <div className='relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden aspect-square m-1 bg-neutral-700'>
        {data.album?.images ? (
          <NextImage
            src={data.album?.images[0].url}
            alt={`Album image: ${data.name}`}
            layout='fill'
            className='aspect-square object-cover'
            useSkeleton
          />
        ) : (
          <BiAlbum size={24} className='m-auto h-full text-dark' />
        )}
      </div>
      <div className='flex flex-col overflow-hidden'>
        <p className='text-light truncate'>{data.name}</p>

        {data.artists && (
          <p className='text-neutral-400 subtitle truncate'>
            {formatArtists(data.artists)}
          </p>
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
  );
};

export default FeedItem;
