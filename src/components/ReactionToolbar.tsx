import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  Badge,
  Divider,
  Image,
  Textarea,
  Tooltip,
  Tabs,
  Tab,
  Avatar,
} from '@nextui-org/react';
import React, { ReactNode, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaArrowRight,
  FaArrowTrendUp,
  FaArrowUpRightFromSquare,
  FaChevronLeft,
  FaChevronRight,
  FaFireFlameCurved,
  FaMusic,
  FaRegEye,
  FaRegEyeSlash,
  FaRegFaceLaugh,
  FaRegFaceMeh,
  FaRegFaceSadCry,
  FaRegFaceSurprise,
  FaRegHeart,
  FaRegThumbsDown,
  FaTrophy,
} from 'react-icons/fa6';
import { MdCancel, MdOutlinePostAdd } from 'react-icons/md';

import { cn, formatArtists } from '@/lib/utils';

import AlbumCard from '@/components/AlbumCard';

import IconButton from './buttons/IconButton';
import ReviewModal from '@/components/modals/ReviewModal';
import { Album, Track, TrackItem } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import { FaRegCommentAlt } from 'react-icons/fa';
import { BiAlbum } from 'react-icons/bi';
import { IconType } from 'react-icons';

type Reaction = {
  id: string;
  type: 'reaction' | 'review';
  icon: IconType;
  label: string;
  disabled: boolean;
  success?: (subject: string) => string;
  onClick?: () => void;
};
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
  const options: Reaction[] = [
    {
      id: 'post',
      type: 'review',
      icon: FaRegCommentAlt,
      label: 'Quick Post',
      disabled: false,
      onClick: () => {
        console.log('quick post onclick');
      },
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

  const reactionOptions = options.filter((o) => o.type === 'reaction');
  const reviewOptions = options.filter((o) => o.type === 'review');
  const [showAllReactions, setShowAllReactions] = useState(false);
  const [showTextArea, setShowTextArea] = useState(false);
  const [isReactionPrivate, setIsReactionPrivate] = useState(false);
  const [reactionText, setReactionText] = useState<string>();
  const [reviewSubjectType, setReviewSubjectType] = useState<
    'album' | 'track' | string
  >('track');
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>();
  const router = useRouter();
  // const [modalOpen, setModalOpen] = useState(false);
  // const Icon = selectedReaction?.icon;

  // const openReviewModal = (subject: {
  //   id: string;
  //   type: string;
  //   name: string;
  // }) => {
  //   console.log(subject);

  //   return (
  //     <ReviewModal
  //       isOpen
  //       onClose={() => setModalOpen(false)}
  //       subject={subject as Track}
  //     ></ReviewModal>
  //   );
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
                onClick={() => router.push('/reviews/new')} // TODO update w/ params (reactionText, subject, etc)
                // onClick={() => setModalOpen(true)}
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
