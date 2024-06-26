import { Avatar, Divider, Tooltip } from '@nextui-org/react';
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { MdCancel } from 'react-icons/md';

import { cn } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';

import { Reaction } from '../constant/types';

type ReactionsProps = {
  image?: string;
  reviewOptions?: Reaction[];
  reactionOptions?: Reaction[];
  defaultReaction?: Reaction;
  onReactionSelect?: (option: Reaction) => void;
  onReviewSelect?: (option: Reaction) => void;
};

const Reactions: React.FC<ReactionsProps> = ({
  image,
  reviewOptions,
  reactionOptions,
  defaultReaction,
  onReactionSelect,
  onReviewSelect,
}) => {
  // const reactionOptions = ReactionOptions.filter((o) => o.type === 'reaction');
  // const reviewOptions = ReactionOptions.filter((o) => o.type === 'review');
  const [reviewEnabled, setReviewEnabled] = useState(false);
  const [showAllReactions, setShowAllReactions] = useState(false);

  const [selectedReaction, setSelectedReaction] = useState<
    Reaction | undefined
  >(defaultReaction);

  const handleReviewClick = (option: Reaction) => {
    console.log('reaction :: ', option);
    setReviewEnabled(!reviewEnabled);
    if (onReviewSelect) {
      onReviewSelect(option);
    }
  };

  const handleReactionClick = (option: Reaction) => {
    console.log('reaction :: ', option);
    setSelectedReaction(option);
    if (onReactionSelect) {
      onReactionSelect(option);
    }
  };

  return (
    <div className='inline-flex items-center p-1 space-x-1 overflow-hidden self-end'>
      {image && <Avatar src={image} size='sm' />}
      {reviewOptions &&
        reviewOptions.map((option) => (
          <Tooltip
            key={option.id}
            placement='top'
            showArrow
            content={reviewEnabled ? 'Cancel' : option.label}
            classNames={{ content: 'text dark dark:text-light' }}
          >
            <IconButton
              key={option.id}
              variant='ghost'
              icon={reviewEnabled ? MdCancel : option.icon}
              onClick={() => handleReviewClick(option)}
              disabled={option.disabled}
              className={cn('rounded-full')}
            />
          </Tooltip>
        ))}
      <Divider orientation='vertical' />
      <div className='flex-grow'>
        {!showAllReactions
          ? reactionOptions?.slice(0, 3).map((option) => (
              <IconButton
                key={option.id}
                variant='ghost'
                icon={option.icon}
                onClick={() => handleReactionClick(option)}
                disabled={option.disabled}
                classNames={{
                  icon: cn(
                    selectedReaction?.id === option.id && 'text-brand-primary',
                  ),
                }}
              />
            ))
          : reactionOptions &&
            reactionOptions.length > 3 &&
            reactionOptions.map((option) => (
              <IconButton
                key={option.id}
                variant='ghost'
                icon={option.icon}
                onClick={() => handleReactionClick(option)}
                disabled={option.disabled}
                classNames={{
                  icon: cn(
                    selectedReaction?.id === option.id && 'text-brand-primary',
                  ),
                }}
              />
            ))}
        <Tooltip
          placement='top'
          content='See more'
          classNames={{ content: 'text dark dark:text-light' }}
        >
          <IconButton
            variant='ghost'
            icon={showAllReactions ? FaChevronLeft : FaChevronRight}
            onClick={() => setShowAllReactions(!showAllReactions)}
            classNames={{ icon: 'text-dark/30 dark:text-light/30' }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Reactions;
