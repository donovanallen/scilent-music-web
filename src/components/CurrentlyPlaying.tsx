'use client';

import { Tooltip } from '@nextui-org/react';
import { Track } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';
import { IoPlay } from 'react-icons/io5';

import { getSourceIcon } from '@/lib/utils';

import FeedItem from '@/components/FeedItem';
import IconLink from '@/components/links/IconLink';

import { usePlayer } from '@/providers/TrackPlayerProvider';

export default function CurrentlyPlaying() {
  const { data: session } = useSession();

  const {
    // play,
    // pause,
    // togglePlay,
    // slider,
    // setSlider,
    // drag,
    // setDrag,
    currentTrackAudio,
    duration,
    currentTime,
    isPlaying,
    currentTrack,
  } = usePlayer();

  if (!currentTrack || !session || !isPlaying) {
    return null;
  }

  return (
    <div className='flex flex-col w-full'>
      {/* TITLE */}
      <div className='flex items-center text-dark dark:text-brand-dark mb-2 w-full justify-between'>
        <div className='flex items-center gap-x-1'>
          <IoPlay className='animate-pulse text-brand-dark dark:text-brand-primary' />
          <h4 className='subtitle'>Currently Playing</h4>
        </div>
        {currentTrack.external_urls.spotify && (
          <Tooltip
            content='Open in Spotify'
            delay={1000}
            classNames={{
              content:
                'py-2 text-dark bg-light dark:bg-dark/90 dark:text-light',
              arrow: 'bg-light dark:bg-dark/90',
              base: 'max-w-xs',
            }}
          >
            <IconLink
              href={currentTrack.external_urls.spotify}
              target='_blank'
              rel='noopener noreferrer'
              icon={getSourceIcon('spotify')}
              variant='ghost'
              classNames={{
                icon: 'hover:text-spotify-primary transition',
              }}
            />
          </Tooltip>
        )}
      </div>

      {/* TRACK */}
      <FeedItem data={currentTrack as Track} />
    </div>
  );
}
