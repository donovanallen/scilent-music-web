import { SimplifiedTrack, Track } from '@spotify/web-api-ts-sdk';
import Link from 'next/link';
import React from 'react';
import { FaMusic } from 'react-icons/fa6';
import { GiBackwardTime } from 'react-icons/gi';

import NextImage from '@/components/NextImage';

import {
  cn,
  formatArtists,
  getDurationText,
  getTimestampText,
} from '../lib/utils';

interface TrackItemProps {
  track: Track | SimplifiedTrack;
  timestamp?: Date;
  className?: string;
  numbered?: boolean;
  disabled?: boolean;
}

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  timestamp,
  className,
  numbered = false,
  disabled = false,
}) => {
  const getReleaseId = (track: Track) => {
    return track.id;
  };

  return (
    <Link
      href={!disabled ? `/release/${getReleaseId(track as Track)}` : ''}
      aria-disabled={disabled}
      className={disabled ? 'cursor-default' : 'cursor-pointer'}
    >
      <div
        className={cn(
          'w-full items-center px-4 py-2 flex gap-x-4 h-fit rounded-md overflow-hidden ',
          !disabled
            ? 'hover:bg-neutral-800/40 hover:text-brand-dark transition'
            : 'hover:bg-neutral-800/40 transition',
          className,
        )}
      >
        {numbered ? (
          <div className='mr-2'>
            <h4 className='subtitle'>{track.track_number}</h4>
          </div>
        ) : (
          <div className='relative min-h-[64px] min-w-[64px] rounded-md overflow-hidden bg-neutral-700'>
            {'album' in track ? (
              <NextImage
                src={track.album.images[0].url}
                alt={track.album.name + ' image'}
                fill
                useSkeleton
                className='object-cover aspect-square'
              />
            ) : (
              <FaMusic size={36} className='m-auto h-full text-dark' />
            )}
          </div>
        )}
        <div className='flex flex-col h-full items-start justify-between flex-1'>
          <div className='w-full overflow-clip'>
            <h4 className='font-normal truncate'>{track.name}</h4>
            <p className='subtitle font-normal text-neutral-500 truncate'>
              {formatArtists(track.artists)}
            </p>
          </div>
          {timestamp && (
            <div className='flex gap-x-1 items-center text-neutral-500'>
              <GiBackwardTime />
              <span className='subtitle'>
                {getTimestampText(timestamp.toString())}
              </span>
            </div>
          )}
        </div>
        <div>
          <h4 className='subtitle text-neutral-500'>
            {getDurationText(track.duration_ms)}
          </h4>
        </div>
      </div>
    </Link>
  );
};

export default TrackItem;
