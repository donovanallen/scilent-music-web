'use client';

import { Badge, Image, Tab, Tabs, Textarea } from '@nextui-org/react';
import { Album, Track } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IconType } from 'react-icons';
import { BiAlbum } from 'react-icons/bi';
import {
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaMusic,
  FaRegEye,
  FaRegEyeSlash,
} from 'react-icons/fa6';

import { cn, formatArtists } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';

import {
  Reaction,
  ReactionOptions,
  ReviewSubjectTypes,
} from '@/constant/types';

type ReviewCreateMinProps = {
  subject: Album | Track;
  content?: string;
  defaultReaction?: Reaction;
  timestamp?: Date;
  hidden?: boolean;
  // source?: string;
  // type: string;
};

const ReviewCreateMin: React.FC<ReviewCreateMinProps> = ({
  subject,
  content,
  defaultReaction,
  timestamp = new Date(),
  hidden = false,
}) => {
  const router = useRouter();
  const album = subject && 'album' in subject ? subject.album : undefined;
  const image = album ? album.images[0].url : undefined;

  const validReviewTypes: { type: ReviewSubjectTypes; icon: IconType }[] = [
    { type: 'album', icon: BiAlbum },
    { type: 'track', icon: FaMusic },
  ];
  const [selectedReaction, setSelectedReaction] = useState<
    Reaction | undefined
  >(defaultReaction);
  const [reviewText, setReviewText] = useState<string | undefined>(content);
  const [isReactionPrivate, setIsReactionPrivate] = useState(false);
  const [reactionText, setReactionText] = useState<string>();
  const [reviewSubjectType, setReviewSubjectType] = useState<
    'album' | 'track' | string
  >('track');
  const reactionOptions = ReactionOptions.filter((o) => o.type === 'reaction');
  const handleReactionClick = (option: any) => {
    console.log('reaction :: ', option);

    if (option.onClick) {
      option.onClick();
    }

    if (option.type === 'reaction') {
      setSelectedReaction(option);
      if (option.success) {
        toast(option.success(subject?.name), { icon: option.icon });
      }
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
      selectedReaction ? serializeObjectToString(selectedReaction) : '',
    );

    console.log(queryString.toString());

    router.push(`/reviews/new?${queryString}`);
  };

  return (
    <Textarea
      label={`${subject?.name} by ${formatArtists(subject?.artists)}`}
      placeholder='Enter text here...'
      description={`Reviewing ${reviewSubjectType}`}
      labelPlacement='outside'
      value={reviewText}
      onValueChange={setReviewText}
      variant='faded'
      size='sm'
      startContent={
        album && (
          <div className='flex flex-col items-center gap-y-1'>
            <Badge
              isOneChar
              content={<>{selectedReaction?.icon}</>}
              shape='circle'
              placement='bottom-right'
              size='lg'
              isInvisible={!selectedReaction}
            >
              {image ? (
                // <AlbumCard
                //   name={subject?.name}
                //   artistName={formatArtists(album.artists) as string}
                //   image={image}
                //   isDisabled
                //   className='w-[180px]'
                // />
                <Image
                  className='aspect-square rounded-md w-[100px]'
                  src={image}
                />
              ) : (
                <BiAlbum
                  size={64}
                  className='m-auto h-full text-dark aspect-square'
                />
              )}
            </Badge>
            <Tabs
              keyboardActivation='manual'
              selectedKey={reviewSubjectType}
              onSelectionChange={(key) =>
                setReviewSubjectType(key.toString() as ReviewSubjectTypes)
              }
              size='sm'
              radius='md'
              aria-label='Review Subject Type'
            >
              {validReviewTypes.length &&
                validReviewTypes.map((t) => (
                  <Tab key={t.type} title={t.type}></Tab>
                ))}
            </Tabs>
          </div>
        )
      }
      endContent={
        <div className='flex flex-col items-center justify-between h-full'>
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
                reactionText
                  ? 'text-brand-dark dark:text-brand-primary'
                  : 'text-brand-dark/20 dark:text-brand-primary/20',
              ),
            }}
            disabled={!reactionText}
          />
        </div>
      }
      className={cn(hidden ? 'hidden' : 'inline-flex items-start')}
      classNames={{
        base: 'm-2 p-1 self-center',
        inputWrapper: 'min-w-[280px]',
        innerWrapper: 'gap-x-4',
        label: 'h2 text-dark dark:text-light truncate',
        input:
          'text-dark dark:text-light placeholder:text-opacity-50 caret-brand-dark dark:caret-brand-primary',
        description: 'text-dark/50 dark:text-light/50',
      }}
      onClear={() => setReactionText('')}
    />
  );
};

export default ReviewCreateMin;
