import { Divider, Textarea, Tooltip } from '@nextui-org/react';
import { Album, Track } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaRegEye,
  FaRegEyeSlash,
} from 'react-icons/fa6';

import { cn, serializeObjectToString } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';

import { Reaction } from '@/constant/types';

type ReviewInlineProps = {
  enabled: boolean;
  subject: Album | Track;
  defaultReaction?: Reaction;
};

const ReviewInline: React.FC<ReviewInlineProps> = ({
  enabled,
  subject,
  defaultReaction,
}) => {
  const router = useRouter();

  const [reviewText, setReviewText] = useState<string | undefined>();
  const [isReactionPrivate, setIsReactionPrivate] = useState(false);

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
    <>
      <Textarea
        placeholder='Enter text here...'
        labelPlacement='outside'
        value={reviewText}
        onValueChange={setReviewText}
        variant='underlined'
        minRows={1}
        maxRows={2}
        size='sm'
        className={cn(enabled ? 'inline-flex items-start' : 'hidden')}
        classNames={{
          base: 'self-center',
          inputWrapper: 'min-w-[50px] p-0 items-center',
          input:
            'text-dark dark:text-light placeholder:text-opacity-50 caret-brand-dark dark:caret-brand-primary',
        }}
        onClear={() => setReviewText('')}
        endContent={
          <div className='inline-flex items-center gap-x-1'>
            <Tooltip content='Open Full View'>
              <IconButton
                icon={FaArrowUpRightFromSquare}
                variant='ghost'
                classNames={{ icon: 'text-dark/50 dark:text-light/50' }}
                onClick={() => openNewReview()}
              />
            </Tooltip>
            <Tooltip content='Set Visibility'>
              <IconButton
                icon={isReactionPrivate ? FaRegEyeSlash : FaRegEye}
                variant='ghost'
                classNames={{ icon: 'text-dark/50 dark:text-light/50' }}
                onClick={() => setIsReactionPrivate(!isReactionPrivate)}
              />
            </Tooltip>
            <Tooltip content='Submit' isDisabled={!reviewText}>
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
            </Tooltip>
          </div>
        }
      />
      <Divider
        orientation='vertical'
        className='border-brand-dark text-brand-dark'
      />
    </>
  );
};

export default ReviewInline;
