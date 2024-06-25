'use client';

import { Skeleton } from '@nextui-org/react';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { Track, TrackItem } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';
import { BiAlbum, BiMicrophone } from 'react-icons/bi';
import { FaChevronRight } from 'react-icons/fa6';
import { GiBackwardTime } from 'react-icons/gi';

import { cn, formatArtists, getTimestampText } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';
import NextImage from '@/components/NextImage';
import ReactionToolbar from '@/components/ReactionToolbar';

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
  const [showArrow, setShowArrow] = useState(false);

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
      <Popover placement='bottom-end' triggerType='dialog' isDismissable>
        <PopoverTrigger>
          <div
            onLoad={() => setIsItemLoaded(true)}
            onMouseEnter={() => setShowArrow(true)}
            onMouseLeave={() => setShowArrow(false)}
            className={cn(
              'flex items-start gap-x-2 cursor-pointer w-full rounded-md hover:bg-dark/10 dark:hover:bg-light/10',
              className,
            )}
          >
            <div className='relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden aspect-square m-1 bg-light/50 dark:bg-dark/50'>
              {image ? (
                <NextImage
                  src={image}
                  alt={`Currently playing artwork: ${data.name}`}
                  fill
                  className='aspect-square object-cover'
                  useSkeleton
                />
              ) : data.type === 'episode' ? (
                <BiMicrophone
                  size={24}
                  className='m-auto h-full text-dark dark:text-light'
                />
              ) : (
                <BiAlbum
                  size={24}
                  className='m-auto h-full text-dark dark:text-light'
                />
              )}
            </div>
            <div className='flex flex-col overflow-hidden flex-auto'>
              <p className='text-dark dark:text-light truncate'>{data.name}</p>

              {artists && (
                <p className='text-dark/70 dark:text-light/70 subtitle truncate'>
                  {artists}
                </p>
              )}

              {timestamp && (
                <div className='inline-flex gap-x-1 items-center text-dark/50 dark:text-light/50 truncate'>
                  <GiBackwardTime fontSize='small' />
                  <span className='subtitle text-xs'>
                    {getTimestampText(timestamp.toString())}
                  </span>
                </div>
              )}
            </div>
            {onClick && (
              <IconButton
                className={cn(showArrow ? 'self-center' : 'hidden')}
                variant='ghost'
                icon={FaChevronRight}
                onClick={handleClick}
              />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          {'album' in data && (
            <ReactionToolbar
              subject={data as Track}
              id={data.id}
              type={data.type}
              name={data.name}
            />
          )}
        </PopoverContent>
      </Popover>
    </Skeleton>
  );
};

export default FeedItem;
