'use client';

import { ScrollShadow } from '@nextui-org/react';
import { PlayHistory, Track } from '@spotify/web-api-ts-sdk';
import React from 'react';
import { GiBackwardTime } from 'react-icons/gi';
import { IoPlay } from 'react-icons/io5';
import { TbPlaylist } from 'react-icons/tb';

import Box from '@/components/Box';
import FeedItem from '@/components/FeedItem';

interface FeedProps {
  title?: string;
  cpTrack?: Track;
  history?: PlayHistory[];
}

const Feed: React.FC<FeedProps> = ({ title, cpTrack, history }) => {
  return (
    <Box className='flex flex-col px-6 py-6 relative'>
      <div className='sticky top-0 bg-dark z-10'>
        {/* HEADING/TITLE */}
        {title && (
          <div className='inline-flex items-center gap-x-2'>
            <TbPlaylist className='text-neutral-400' />
            <h3 className='text-neutral-400'>{title}</h3>
          </div>
        )}

        {/* LIVE/CP TRACK */}
        {cpTrack && (
          <div className='p-2 -mx-2 gap-y-2 border-b-2 border-light'>
            <div className='flex items-center gap-x-1 text-brand-primary mb-2'>
              <IoPlay className='text-brand-primary' />
              <h4 className='subtitle'>Currently Playing</h4>
            </div>

            <FeedItem data={cpTrack as Track} />
          </div>
        )}
      </div>

      {/* LISTEN HISTORY */}
      {history && (
        <ScrollShadow hideScrollBar className='py-2'>
          <div className='flex items-center gap-x-1 text-neutral-500 mb-2'>
            <GiBackwardTime />
            <h4 className='subtitle'>History</h4>
          </div>

          <div className='flex flex-col gap-y-4'>
            {history.map((h, i) => (
              <FeedItem
                key={i}
                data={h.track}
                timestamp={new Date(h.played_at)}
              />
            ))}
          </div>
        </ScrollShadow>
      )}
    </Box>
  );
};

export default Feed;
