import { SimplifiedTrack, Track } from '@spotify/web-api-ts-sdk';
import React from 'react';

import TrackItem from '@/components/TrackItem';

interface TracksCollectionProps {
  tracks?: Track[] | SimplifiedTrack[];
  tracksNumbered?: boolean;
  emptyText?: string;
}

const TracksCollection: React.FC<TracksCollectionProps> = ({
  tracks,
  tracksNumbered,
  emptyText = 'No tracks available',
}) => {
  return tracks?.length !== 0 ? (
    <div className='flex flex-col w-full overflow-y-scroll no-scrollbar'>
      {tracks &&
        tracks.map((track, i) => (
          <TrackItem key={i} track={track} disabled numbered={tracksNumbered} />
        ))}
    </div>
  ) : (
    <div className='mt-4 text-neutral-400'>{emptyText}</div>
  );
};

export default TracksCollection;
