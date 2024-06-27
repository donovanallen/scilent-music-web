import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Skeleton } from '@nextui-org/react';
import { Album, Track } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';

import { cn } from '@/lib/utils';
import { useTopMusic } from '@/hooks/useTopMusic';

import Button from '@/components/buttons/Button';
import HeaderItem from '@/components/HeaderItem';
import InfoIcon from '@/components/InfoIcon';
import LoadingIndicator from '@/components/LoadingIndicator';

type Props = {
  initExpanded?: boolean;
  onSubjectSelect?: (subject: Track | Album) => void;
};

const SuggestedReviewSubjects: React.FC<Props> = ({
  initExpanded = true,
  onSubjectSelect,
}) => {
  const { tracks: topTracks, isLoading } = useTopMusic('short_term');
  const [expanded, setExpanded] = useState(initExpanded);
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  return (
    <div ref={parent} className='w-full'>
      <div className='inline-flex items-center'>
        <Button
          onClick={() => setExpanded(!expanded)}
          variant='ghost'
          rightIcon={expanded ? FaMinus : FaPlus}
          className='text-dark/60 dark:text-light/60'
        >
          <h4>Suggested Review Subjects</h4>
        </Button>
        <InfoIcon
          tooltipEnabled
          tooltip={{
            content: 'Get started with some of your recent favorites.',
          }}
        />
      </div>
      {isLoading && <LoadingIndicator />}
      {topTracks && (
        <div
          className={cn(
            expanded ? 'grid grid-flow-row gap-6 grid-cols-3' : 'hidden',
          )}
        >
          {topTracks.slice(0, 3).map((track, i) => (
            <Skeleton
              className='rounded-md bg-neutral-500'
              isLoaded={!!topTracks}
              key={track.id}
            >
              <HeaderItem
                key={track.id}
                title={`#${i + 1}`}
                name={track.name}
                image={track.album.images[0].url}
                onClick={() => {
                  onSubjectSelect && onSubjectSelect(track);
                  setExpanded(false);
                }}
              />
            </Skeleton>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedReviewSubjects;
