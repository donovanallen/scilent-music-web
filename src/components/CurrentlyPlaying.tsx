'use client';

import { Track } from '@spotify/web-api-ts-sdk';
import Link from 'next/link';
import { IoPlay } from 'react-icons/io5';

import FeedItem from '@/components/FeedItem';

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
    <Link href={currentTrack.external_urls.spotify}>
      <div className='p-2 -mx-2 gap-y-2 border-b-2 border-light'>
        <div className='flex items-center gap-x-1 text-brand-primary mb-2'>
          <IoPlay className='text-brand-primary' />
          <h4 className='subtitle'>Currently Playing</h4>
        </div>

        <FeedItem data={currentTrack as Track} />
      </div>
    </Link>
  );
}
