'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Album, Track } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';

import Reactions from '@/components/Reactions';

import { Reaction, ReactionOptions } from '@/constant/types';

interface ReactionToolbarProps {
  subject: Track | Album;
  showArtwork?: boolean;
}

const ReactionToolbar: React.FC<ReactionToolbarProps> = ({
  subject,
  showArtwork = true,
}) => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const reactionOptions = ReactionOptions.filter((o) => o.type === 'reaction');
  const reviewOptions = ReactionOptions.filter((o) => o.type === 'review');
  const [showTextArea, setShowTextArea] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<
    Reaction | undefined
  >();

  return (
    <div ref={parent} className='flex flex-col'>
      {/* TOOLBAR */}
      <Reactions
        subject={subject}
        reviewOptions={reviewOptions}
        reactionOptions={reactionOptions}
        onReviewSelect={() => setShowTextArea(!showTextArea)}
        onReactionSelect={(r) => setSelectedReaction(r)}
        defaultReaction={selectedReaction}
        showImage={showArtwork}
      />
    </div>
  );
};

export default ReactionToolbar;
