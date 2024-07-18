import { PlayHistory } from '@spotify/web-api-ts-sdk';
import React from 'react';

import LoadingIndicator from '@/components/LoadingIndicator';
import TrackItem from '@/components/TrackItem';

interface PageContentProps {
  history?: PlayHistory[];
  loading?: boolean;
}

const PageContent: React.FC<PageContentProps> = ({
  history,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <LoadingIndicator className='self-center w-full' />
      </div>
    );
  } else {
    if (history) {
      return history?.length !== 0 ? (
        <div className='flex flex-col w-full overflow-y-scroll no-scrollbar'>
          {history &&
            history.map((h, i) => (
              <TrackItem
                key={i}
                track={h.track}
                timestamp={new Date(h.played_at)}
              />
            ))}
        </div>
      ) : (
        <div className='mt-4 text-neutral-400'>No recent listens</div>
      );
    }
  }
};

export default PageContent;
