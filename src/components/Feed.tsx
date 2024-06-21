'use client';

import { ScrollShadow } from '@nextui-org/react';
import { PlayHistory, Track } from '@spotify/web-api-ts-sdk';
import React from 'react';
import { GiBackwardTime } from 'react-icons/gi';
import { TbPlaylist } from 'react-icons/tb';

import { cn } from '@/lib/utils';

import Box from '@/components/Box';
import CurrentlyPlaying from '@/components/CurrentlyPlaying';
import FeedItem from '@/components/FeedItem';
import InfoIcon from '@/components/InfoIcon';

interface FeedProps {
  title?: string;
  cpTrack?: Track;
  history?: PlayHistory[];
  className?: string;
}

const Feed: React.FC<FeedProps> = ({ title, cpTrack, history, className }) => {
  return (
    <Box className={cn('flex flex-col px-6 py-6 relative', className)}>
      <div className='sticky top-0 bg-light dark:bg-dark z-10'>
        {/* HEADING/TITLE */}
        {title && (
          <div className='inline-flex items-center w-full justify-between'>
            <div className='inline-flex items-center gap-x-2'>
              <TbPlaylist className='text-dark/50 dark:text-light/50' />
              <h3 className='text-dark/80 dark:text-light/80'>{title}</h3>
              <InfoIcon
                tooltipEnabled
                tooltip={{
                  content:
                    "This is your Live Mix. Here you'll find your recent activity and your currently playing track. In future versions, this will be home to much more including live aura updates, friend activity, and recent releases.",
                }}
              />
            </div>
          </div>
        )}

        {/* LIVE/CP TRACK */}
        <>{cpTrack && <CurrentlyPlaying />}</>
      </div>

      {/* LISTEN HISTORY */}
      {history && (
        <ScrollShadow hideScrollBar className='py-2'>
          <div className='flex items-center gap-x-1 text-dark/50 mb-2'>
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
