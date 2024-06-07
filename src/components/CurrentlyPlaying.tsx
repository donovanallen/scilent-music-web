'use client';

import { Tooltip } from '@nextui-org/react';
import { Track } from '@spotify/web-api-ts-sdk';
import { IoPlay } from 'react-icons/io5';

import { getSourceIcon } from '@/lib/utils';

import FeedItem from '@/components/FeedItem';
import IconLink from '@/components/links/IconLink';

import { usePlayer } from '@/providers/TrackPlayerProvider';

export default function CurrentlyPlaying() {
  const {
    // currentTrackAudio,
    // isPlaying,
    // play,
    // pause,
    // togglePlay,
    // duration,
    // currentTime,
    // slider,
    // setSlider,
    // drag,
    // setDrag,
    currentTrack,
  } = usePlayer();

  if (!currentTrack) {
    return null;
  }

  return (
    <div className='py-2 -mx-2 gap-y-2 border-b-2 border-light'>
      <div className='flex items-center text-brand-primary mb-2 w-full justify-between'>
        <div className='flex items-center gap-x-1'>
          <IoPlay className='text-brand-primary' />
          <h4 className='subtitle'>Currently Playing</h4>
        </div>
        {currentTrack.external_urls.spotify && (
          <Tooltip
            content='Open in Spotify'
            delay={1200}
            classNames={{
              content: 'text-dark bg-light py-2',
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
              className='hover:text-spotify-primary transition'
            />
          </Tooltip>
        )}
      </div>

      <FeedItem data={currentTrack as Track} />
    </div>
  );
}
