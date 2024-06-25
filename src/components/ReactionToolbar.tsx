'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  Avatar,
  Badge,
  Divider,
  Image,
  Tab,
  Tabs,
  Textarea,
  Tooltip,
} from '@nextui-org/react';
import { Album, Track, TrackItem } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IconType } from 'react-icons';
import { BiAlbum } from 'react-icons/bi';
import {
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaChevronLeft,
  FaChevronRight,
  FaMusic,
  FaRegEye,
  FaRegEyeSlash,
} from 'react-icons/fa6';
import { MdCancel } from 'react-icons/md';

import { cn, formatArtists } from '@/lib/utils';

import { Reaction, ReactionOptions } from '@/constant/types';

import IconButton from './buttons/IconButton';
interface ReactionToolbarProps {
  id: string;
  type: string;
  name: string;
  subject?: Track | Album | TrackItem;
}

const ReactionToolbar: React.FC<ReactionToolbarProps> = ({
  id,
  type,
  name,
  subject,
}) => {
  console.log('Reaction subject :: ', subject);

  const album = subject && 'album' in subject ? subject.album : undefined;
  const image = album ? album.images[0].url : undefined;
  const validReviewTypes: { type: string; icon: IconType }[] =
    subject && 'album' in subject
      ? [
          { type: 'album', icon: BiAlbum },
          { type: 'track', icon: FaMusic },
        ]
      : [{ type: 'track', icon: FaMusic }];

  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const handleReactionClick = (option: any) => {
    console.log('reaction :: ', option);

    if (option.onClick) {
      option.onClick();
    }

    if (option.type === 'reaction') {
      setSelectedReaction(option);
      if (option.success) {
        toast(option.success(name), { icon: option.icon });
      }
    }
  };

  const reactionOptions = ReactionOptions.filter((o) => o.type === 'reaction');
  const reviewOptions = ReactionOptions.filter((o) => o.type === 'review');
  const [showAllReactions, setShowAllReactions] = useState(false);
  const [showTextArea, setShowTextArea] = useState(false);
  const [isReactionPrivate, setIsReactionPrivate] = useState(false);
  const [reactionText, setReactionText] = useState<string>();
  const [reviewSubjectType, setReviewSubjectType] = useState<
    'album' | 'track' | string
  >('track');
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>();
  // const router = useRouter();
  // const Icon = selectedReaction?.icon;

  // const openNewReview = () => {
  //   router &&
  //     router.push({
  //       pathname: '/reviews/new',
  //       query: {
  //         id: subject?.id,
  //         subject: JSON.stringify(subject),
  //         text: reactionText,
  //       },
  //     });
  // };

  return (
    <>
      <div ref={parent} className='flex flex-col'>
        {/* QUICK POST */}
        <Textarea
          label={`${subject?.name} by ${formatArtists(album?.artists)}`}
          placeholder='Enter text here...'
          description={`Reviewing ${reviewSubjectType}`}
          labelPlacement='outside'
          value={reactionText}
          onValueChange={setReactionText}
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
                    setReviewSubjectType(key.toString())
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
                // onClick={() => openNewReview()}
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
          className={cn(!showTextArea ? 'hidden' : 'inline-flex items-start')}
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

        {/* TOOLBAR */}
        <div className='inline-flex items-center p-1 space-x-1 overflow-hidden self-end'>
          {image && <Avatar src={image} size='sm' isDisabled={showTextArea} />}
          {reviewOptions.map((option) => (
            <Tooltip
              key={option.id}
              placement='top'
              showArrow
              content={showTextArea ? 'Cancel' : option.label}
              classNames={{ content: 'text dark dark:text-light' }}
            >
              <IconButton
                key={option.id}
                variant='ghost'
                icon={showTextArea ? MdCancel : option.icon}
                onClick={() => setShowTextArea(!showTextArea)}
                disabled={option.disabled}
                className={cn('rounded-full')}
              />
            </Tooltip>
          ))}
          <Divider orientation='vertical' />
          <div className='flex-grow'>
            {!showAllReactions
              ? reactionOptions.slice(0, 3).map((option) => (
                  <IconButton
                    key={option.id}
                    variant='ghost'
                    icon={option.icon}
                    onClick={() => handleReactionClick(option)}
                    disabled={option.disabled}
                    classNames={{
                      icon: cn(
                        selectedReaction?.id === option.id &&
                          'text-brand-primary',
                      ),
                    }}
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
                    classNames={{
                      icon: cn(
                        selectedReaction?.id === option.id &&
                          'text-brand-primary',
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
      </div>
    </>
  );
};

export default ReactionToolbar;
