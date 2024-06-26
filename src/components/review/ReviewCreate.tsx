import { Tab, Tabs, Textarea } from '@nextui-org/react';
import { Album, Track } from '@spotify/web-api-ts-sdk';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IconType } from 'react-icons';
import { BiAlbum } from 'react-icons/bi';
import { FaMusic, FaSpotify } from 'react-icons/fa6';

import { cn, formatArtists, getTimestampText } from '@/lib/utils';

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
  // type: string;
};

const ReviewCreate: React.FC<ReviewCreateProps> = ({
  subject,
  content,
  defaultReaction,
  timestamp = new Date(),
}) => {
  const validReviewTypes: { type: ReviewSubjectTypes; icon: IconType }[] = [
    { type: 'album', icon: BiAlbum },
    { type: 'track', icon: FaMusic },
  ];
  const [selectedReaction, setSelectedReaction] = useState<
    Reaction | undefined
  >(defaultReaction);
  const [reviewText, setReviewText] = useState<string | undefined>(content);

  const [reviewSubjectType, setReviewSubjectType] =
    useState<ReviewSubjectTypes | null>();
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

  return (
    <div className='flex flex-col flex-auto gap-y-6'>
      {/* TEXTAREA / CONTENT */}
      <Textarea
        label={
          <div className='inline-flex w-full items-end justify-between gap-x-12 mb-2 px-2'>
            <div className='flex-auto'>
              <h3 className='truncate'>{`${subject.name}`}</h3>
              <h4 className='text-dark/70 dark:text-light/70 subtitle truncate'>
                {`${formatArtists(subject.artists)}`}
              </h4>
            </div>
            <div className='inline-flex items-center gap-x-2'>
              <NextPill
                variant='shadow'
                text={'album' in subject ? subject.album.type : subject.type}
              />
              <IconButton variant='ghost' icon={FaSpotify} />
            </div>
          </div>
        }
        placeholder='Enter your review here'
        description={
          <div className='inline-flex w-full items-end justify-between px-2'>
            <span>{`Reviewing ${reviewSubjectType}: ${subject.name}`}</span>
            <span>{`${getTimestampText(timestamp.toLocaleString())}`}</span>
          </div>
        }
        labelPlacement='outside'
        value={content || reviewText}
        onValueChange={setReviewText}
        variant='bordered'
        size='lg'
        minRows={10}
        radius='md'
        // isRequired
        endContent={
          <div className='flex flex-col items-end max-w-1/3 gap-y-4'>
            {'album' in subject && (
              <AlbumCard
                name={subject.name}
                artistName={formatArtists(subject.artists) as string}
                image={subject.album.images[0].url}
              />
            )}
            {validReviewTypes && (
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
        classNames={{
          base: '',
          label: 'text-lg',
        }}
      />

      <div className='flex-grow inline-flex items-center justify-end'>
        {reactionOptions.map((option) => (
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
      </div>

      {/* PREVIEW / SUBMIT */}
      <div className='w-full  inline-flex items-center justify-end gap-x-6 mt-12'>
        <Button variant='ghost' disabled>
          Preview
        </Button>
        <Button variant='primary'>Submit</Button>
      </div>
    </div>
  );
};

export default ReviewCreate;
