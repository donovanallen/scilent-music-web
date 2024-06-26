import { Tab, Tabs, Textarea } from '@nextui-org/react';
import { Album, SimplifiedAlbum, Track } from '@spotify/web-api-ts-sdk';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { IconType } from 'react-icons';
import { BiAlbum } from 'react-icons/bi';
import { FaMusic, FaSpotify } from 'react-icons/fa6';

import { cn, formatArtists } from '@/lib/utils';

import AlbumCard from '@/components/AlbumCard';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import NextPill from '@/components/Pill';

import {
  Reaction,
  ReactionOptions,
  ReviewSubjectTypes,
} from '@/constant/types';

type ReviewCreateProps = {
  subject: Album | Track;
  content?: string;
  defaultReaction?: Reaction;
  timestamp?: Date;
  // source?: string;
  type: ReviewSubjectTypes;
};

const ReviewCreate: React.FC<ReviewCreateProps> = ({
  subject,
  content,
  defaultReaction,
  timestamp = new Date(),
  type,
}) => {
  const reactionOptions = ReactionOptions.filter((o) => o.type === 'reaction');
  const validReviewTypes: { type: ReviewSubjectTypes; icon: IconType }[] = [
    { type: 'album', icon: BiAlbum },
    { type: 'track', icon: FaMusic },
  ];
  const [selectedReaction, setSelectedReaction] = useState<
    Reaction | undefined
  >(defaultReaction);
  const [reviewText, setReviewText] = useState<string | undefined>(content);
  const [reviewSubject, setReviewSubject] = useState<
    Album | Track | SimplifiedAlbum
  >(subject);
  const [reviewSubjectType, setReviewSubjectType] =
    useState<ReviewSubjectTypes>(reviewSubject.type as ReviewSubjectTypes);

  const subjectImage = useMemo(() => {
    return 'album' in subject
      ? subject.album.images[0].url
      : 'images' in subject
        ? subject.images[0].url
        : undefined;
  }, [subject]);

  const handleReviewSubmit = () => {
    console.log('Submitting review', reviewText);
    toast.success('Submitting review');
  };

  const handleReviewPreview = () => {
    console.log('Previewing review', reviewText);
    toast.success('Previewing review');
  };

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

  return (
    <div className='flex flex-col w-full'>
      {/* TEXTAREA / CONTENT */}
      <Textarea
        classNames={{
          base: 'py-12',
          label: 'text-lg',
          input: 'p-2',
          inputWrapper: 'flex w-full',
          innerWrapper: 'flex gap-x-4 p-2',
        }}
        label={
          <div
            className={cn(
              'inline-flex w-full items-end justify-between',
              // ' mb-2 px-2 gap-x-2',
            )}
          >
            <div
              className={cn(
                'flex flex-col',
                // 'flex-grow'
              )}
            >
              <h4 className='subtitle text-xs'>Let's talk about</h4>
              <h4 className='text-brand-dark dark:text-brand-primary line-clamp-2'>{`${reviewSubject.name}`}</h4>
              <h4 className='opacity-50 subtitle line-clamp-1'>
                {`${formatArtists(reviewSubject.artists)}`}
              </h4>
            </div>
            <div className='inline-flex items-center gap-x-2'>
              <NextPill variant='flat' text={reviewSubjectType} />
              <IconButton
                variant='ghost'
                icon={FaSpotify}
                // onClick={() => 'album' in subject ? subject.album.type : subject.type} //TODO update to external_url
              />
            </div>
          </div>
        }
        placeholder='Enter your review here'
        description={
          <div className='inline-flex w-full items-start justify-between px-2 gap-x-2'>
            <span className='line-clamp-1'>{`Reviewing ${reviewSubjectType}: ${reviewSubject.name}`}</span>
            {/* useHook for live(debounced) updates  ? */}
            {/* <span className='line-clamp-1'>{`${getTimestampText(timestamp.toLocaleString())}`}</span> */}
          </div>
        }
        labelPlacement='outside'
        value={content || reviewText}
        onValueChange={setReviewText}
        variant='bordered'
        size='lg'
        minRows={5}
        maxRows={15}
        radius='md'
        // isRequired
        endContent={
          <div
            className={cn(
              'flex flex-col items-end gap-y-4',
              // 'border border-yellow-400',
              // 'flex-1',
              // 'flex-grow',
            )}
          >
            {'album' in reviewSubject && (
              <AlbumCard
                name={reviewSubject.name}
                artistName={formatArtists(reviewSubject.artists) as string}
                image={subjectImage}
                type={reviewSubjectType}
              />
            )}
            {validReviewTypes && (
              <Tabs
                keyboardActivation='manual'
                selectedKey={reviewSubject.type}
                onSelectionChange={(key) => {
                  setReviewSubjectType(key as ReviewSubjectTypes);
                  key === 'album' && 'album' in subject
                    ? setReviewSubject(subject.album)
                    : setReviewSubject(subject);
                }}
                size='sm'
                radius='md'
                aria-label='Review Subject Type'
              >
                {validReviewTypes.map((t) => (
                  <Tab
                    key={t.type}
                    title={
                      <div className='flex items-center space-x-2'>
                        <>{t.icon}</>
                        <span>{t.type}</span>
                      </div>
                    }
                  ></Tab>
                ))}
              </Tabs>
            )}
          </div>
        }
      />

      <div className='inline-flex items-center justify-end'>
        {reactionOptions.map((option) => (
          <IconButton
            key={option.id}
            variant='ghost'
            icon={option.icon}
            onClick={() => handleReactionClick(option)}
            disabled={option.disabled}
            classNames={{
              icon: cn(
                'text-lg md:text-xl',
                selectedReaction?.id === option.id && 'text-brand-primary',
              ),
            }}
          />
        ))}
      </div>

      {/* PREVIEW / SUBMIT */}
      <div
        className={cn(
          'w-full inline-flex items-center justify-end',
          'gap-x-4',
          // 'mt-6'
        )}
      >
        <Button variant='ghost' onClick={handleReviewPreview} disabled>
          Preview
        </Button>
        <Button variant='primary' onClick={handleReviewSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ReviewCreate;
