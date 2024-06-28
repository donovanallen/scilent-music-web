import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Avatar, Divider, Textarea, Tooltip } from '@nextui-org/react';
import { Album, Track } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaChevronLeft,
  FaChevronRight,
  FaRegEye,
  FaRegEyeSlash,
} from 'react-icons/fa6';
import { MdCancel } from 'react-icons/md';

import { cn } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';

import { Reaction } from '../constant/types';

type ReactionsProps = {
  subject: Album | Track;
  reviewOptions?: Reaction[];
  reactionOptions?: Reaction[];
  defaultReaction?: Reaction;
  onReactionSelect?: (option: Reaction) => void;
  onReviewSelect?: (option: Reaction) => void;
};

const Reactions: React.FC<ReactionsProps> = ({
  subject,
  reviewOptions,
  reactionOptions,
  defaultReaction,
  onReactionSelect,
  onReviewSelect,
}) => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  const router = useRouter();

  const [isReactionPrivate, setIsReactionPrivate] = useState(false);
  const [reviewEnabled, setReviewEnabled] = useState(false);
  const [showAllReactions, setShowAllReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<
    Reaction | undefined
  >(defaultReaction);
  const [reviewText, setReviewText] = useState<string | undefined>();

  const album = subject && 'album' in subject ? subject.album : undefined;
  const image =
    'album' in subject
      ? subject.album.images[0].url
      : 'images' in subject
        ? subject.images[0].url
        : undefined;

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
  // Function to serialize the object into a query string
  const serializeObjectToString = (obj: any) => {
    return encodeURIComponent(JSON.stringify(obj));
  };

  const openNewReview = () => {
    const queryString = new URLSearchParams();
    // const queryString = new URLSearchParams(
    //   `subject=${serializeObjectToString(subject)}` +
    //     `&content=${encodeURIComponent(reviewText ? reviewText : '')}` +
    //     `&reaction=${selectedReaction ? serializeObjectToString(selectedReaction) : ''}`,
    // );
    queryString.append('subjectId', subject.id);
    queryString.append('subjectType', subject.type);
    queryString.append(
      'content',
      encodeURIComponent(reviewText ? reviewText : ''),
    );
    queryString.append(
      'reaction',
      defaultReaction ? serializeObjectToString(defaultReaction) : '',
    );

    console.log(queryString.toString());

    router.push(`/reviews/new?${queryString}`);
  };

  return (
    <div
      ref={parent}
      className='inline-flex items-center p-1 overflow-hidden self-end'
    >
      {image && (
        <Avatar
          src={image}
          size='sm'
          classNames={{ base: 'min-w-fit flex-shrink-0' }}
        />
      )}

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

      <Textarea
        placeholder='Enter text here...'
        labelPlacement='outside'
        value={reviewText}
        onValueChange={setReviewText}
        variant='underlined'
        minRows={1}
        maxRows={2}
        size='sm'
        className={cn(reviewEnabled ? 'inline-flex items-start' : 'hidden')}
        classNames={{
          base: 'm-2 p-1 self-center',
          inputWrapper: 'min-w-[50px]',
          input:
            'text-dark dark:text-light placeholder:text-opacity-50 caret-brand-dark dark:caret-brand-primary',
        }}
        onClear={() => setReviewText('')}
        endContent={
          <div className='inline-flex items-center gap-x-1'>
            <IconButton
              icon={FaArrowUpRightFromSquare}
              variant='ghost'
              classNames={{ icon: 'text-dark/50 dark:text-light/50' }}
              onClick={() => openNewReview()}
              // onClick={() => router.push('/reviews/new')} // TODO update w/ params (reactionText, subject, etc)
            />
            <IconButton
              icon={isReactionPrivate ? FaRegEyeSlash : FaRegEye}
              variant='ghost'
              classNames={{ icon: 'text-dark/50 dark:text-light/50' }}
              onClick={() => setIsReactionPrivate(!isReactionPrivate)}
            />
            <IconButton
              icon={FaArrowRight}
              variant='ghost'
              classNames={{
                icon: cn(
                  reviewText
                    ? 'text-brand-dark dark:text-brand-primary'
                    : 'text-brand-dark/20 dark:text-brand-primary/20',
                ),
              }}
              disabled={!reviewText}
            />
          </div>
        }
      />

      <Divider orientation='vertical' />
      <div className='min-w-fit'>
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
