'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Album, Track } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';

import Reactions from '@/components/Reactions';
import ReviewCreateMin from '@/components/review/ReviewCreateMin';

import { Reaction, ReactionOptions } from '@/constant/types';

interface ReactionToolbarProps {
  subject: Track | Album;
}

const ReactionToolbar: React.FC<ReactionToolbarProps> = ({ subject }) => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const reactionOptions = ReactionOptions.filter((o) => o.type === 'reaction');
  const reviewOptions = ReactionOptions.filter((o) => o.type === 'review');
  const [showTextArea, setShowTextArea] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<
    Reaction | undefined
  >();

  return (
    <>
      <div ref={parent} className='flex flex-col'>
        {/* QUICK POST */}
        <ReviewCreateMin
          subject={subject}
          hidden={!showTextArea}
          defaultReaction={selectedReaction}
        />

        {/* TOOLBAR */}
        <Reactions
          subject={subject}
          reviewOptions={reviewOptions}
          reactionOptions={reactionOptions}
          onReviewSelect={() => setShowTextArea(!showTextArea)}
          onReactionSelect={setSelectedReaction}
          defaultReaction={selectedReaction}
        />
      </div>
    </>
  );
};

export default ReactionToolbar;
