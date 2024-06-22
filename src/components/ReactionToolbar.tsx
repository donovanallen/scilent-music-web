import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Divider, Tooltip } from '@nextui-org/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaChevronLeft,
  FaChevronRight,
  FaFireFlameCurved,
  FaRegFaceLaugh,
  FaRegFaceMeh,
  FaRegFaceSadCry,
  FaRegFaceSurprise,
  FaRegHeart,
  FaRegThumbsDown,
  FaTrophy,
} from 'react-icons/fa6';
import { MdOutlinePostAdd, MdOutlineRateReview } from 'react-icons/md';

import IconButton from './buttons/IconButton';

interface ReactionToolbarProps {
  id: string;
  type: string;
  name: string;
}

const ReactionToolbar: React.FC<ReactionToolbarProps> = ({
  id,
  type,
  name,
}) => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const options = [
    {
      id: 'post',
      type: 'review',
      icon: MdOutlinePostAdd,
      label: 'Quick Post',
      disabled: false,
    },
    {
      id: 'review',
      type: 'review',
      icon: MdOutlineRateReview,
      label: 'Review',
      disabled: false,
    },
    {
      id: 'heart',
      type: 'reaction',
      icon: FaRegHeart,
      label: 'Love',
      disabled: false,
      success: (subject: string) => `Loving ${subject}`,
    },
    {
      id: 'thumbsDown',
      type: 'reaction',
      icon: FaRegThumbsDown,
      label: 'Dislike',
      disabled: false,
      success: (subject: string) => `Not feeling ${subject}`,
    },
    {
      id: 'fire',
      type: 'reaction',
      icon: FaFireFlameCurved,
      label: 'Fire',
      disabled: false,
      success: (subject: string) => `${subject} is FIREEEE!`,
    },
    {
      id: 'trophy',
      type: 'reaction',
      icon: FaTrophy,
      label: 'Classic',
      disabled: false,
      success: (subject: string) => `${subject} is a certified classic`,
    },
    {
      id: 'laugh',
      type: 'reaction',
      icon: FaRegFaceLaugh,
      label: 'Funny',
      disabled: false,
      success: (subject: string) => `LMAO @ ${subject}`,
    },
    {
      id: 'sad',
      type: 'reaction',
      icon: FaRegFaceSadCry,
      label: 'Sad',
      disabled: false,
      success: (subject: string) => `${subject}, tissues please?`,
    },
    {
      id: 'surprise',
      type: 'reaction',
      icon: FaRegFaceSurprise,
      label: 'Shocked',
      disabled: false,
      success: (subject: string) => `!!!!! ${subject}`,
    },
    {
      id: 'meh',
      type: 'reaction',
      icon: FaRegFaceMeh,
      label: 'Meh',
      disabled: false,
      success: (subject: string) => `ZZZzzzzz ${subject}`,
    },
  ];

  const handleReactionClick = (option: any) => {
    console.log(option);
    if (option.success) {
      toast(option.success(name), { icon: option.icon });
    }
  };

  const reactionOptions = options.filter((o) => o.type === 'reaction');
  const reviewOptions = options.filter((o) => o.type === 'review');
  const [showAllReactions, setShowAllReactions] = useState(false);

  return (
    <div
      ref={parent}
      className='inline-flex items-center p-1 space-x-1 overflow-hidden'
    >
      {reviewOptions.map((option) => (
        <Tooltip
          key={option.id}
          placement='top'
          showArrow
          content={option.label}
        >
          <IconButton
            key={option.id}
            variant='primary'
            icon={option.icon}
            onClick={() => handleReactionClick(option)}
            disabled={option.disabled}
            className='rounded-full'
          />
        </Tooltip>
      ))}
      <Divider orientation='vertical' />
      <div className='flex-grow'>
        {!showAllReactions
          ? reactionOptions
              .slice(0, 3)
              .map((option) => (
                <IconButton
                  key={option.id}
                  variant='ghost'
                  icon={option.icon}
                  onClick={() => handleReactionClick(option)}
                  disabled={option.disabled}
                />
              ))
          : reactionOptions.length > 3 &&
            reactionOptions.map((option) => (
              <IconButton
                key={option.id}
                variant='ghost'
                icon={option.icon}
                onClick={() => handleReactionClick(option)}
                disabled={option.disabled}
              />
            ))}
        <Tooltip placement='top' content='See more'>
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

export default ReactionToolbar;
