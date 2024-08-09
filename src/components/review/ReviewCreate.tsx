import { Tab, Tabs, Textarea } from '@nextui-org/react';
import {
  Album,
  SimplifiedAlbum,
  SimplifiedTrack,
  Track,
} from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { IconType } from 'react-icons';
import { BiAlbum } from 'react-icons/bi';
import { FaMusic, FaSpotify } from 'react-icons/fa6';

import { cn, formatArtists } from '@/lib/utils';

import AlbumCard from '@/components/AlbumCard';
import ArtistFollowIcon from '@/components/ArtistFollowIcon';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import NextPill from '@/components/Pill';

import { Reaction, ReviewSubject } from '@/constant/types';

type ReviewCreateProps = {
  subject: Track | Album | SimplifiedAlbum | SimplifiedTrack;
  content?: string;
  defaultReaction?: Reaction;
  timestamp?: Date;
  // source?: string;
  type: ReviewSubject;
};

const ReviewCreate: React.FC<ReviewCreateProps> = ({
  subject,
  content,
  // defaultReaction,
  // timestamp = new Date(),
  // type,
}) => {
  const router = useRouter();
  const validReviewTypes: { type: ReviewSubject; icon: IconType }[] = [
    { type: 'album', icon: BiAlbum },
    { type: 'track', icon: FaMusic },
  ];
  const [reviewText, setReviewText] = useState<string | undefined>(content);
  const [reviewSubject, setReviewSubject] = useState<
    Track | Album | SimplifiedAlbum | SimplifiedTrack
  >(subject);
  const [reviewSubjectType, setReviewSubjectType] = useState<ReviewSubject>(
    reviewSubject.type as ReviewSubject,
  );

  const subjectImage = useMemo(() => {
    return 'album' in subject
      ? subject.album.images[0].url
      : 'images' in subject
        ? subject.images[0].url
        : undefined;
  }, [subject]);

  const handleReviewSubmit = () => {
    // console.log('Submitting review', reviewText);
    toast.success('Submitting review');
  };

  const handleReviewPreview = () => {
    // console.log('Previewing review', reviewText);
    toast.success('Previewing review');
  };

  const ReviewLabel = () => (
    <div className={cn('inline-flex w-full items-end justify-between')}>
      <div className={cn('flex flex-col')}>
        <h4 className='subtitle text-xs'>Let's talk about</h4>
        <h3 className='text-brand-dark dark:text-brand-primary line-clamp-2'>{`${reviewSubject.name}`}</h3>

        <div className='flex items-center text-dark/80 dark:text-light/80 subtitle'>
          <h4 className='opacity-50 line-clamp-1'>
            {`${formatArtists(reviewSubject.artists)}`}
          </h4>
          <ArtistFollowIcon
            id={reviewSubject.artists[0].id}
            followEnabled={false}
          />
        </div>
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
  );

  const ReviewDescription = () => (
    <div className='inline-flex w-full items-start justify-between gap-x-2'>
      <span className='line-clamp-1'>{`Reviewing ${reviewSubjectType}: ${reviewSubject.name}`}</span>
      <span className='line-clamp-1'>User | Easy Rider | Example insight</span>
    </div>
  );

  const ReviewSubject = () => (
    <div className={cn('flex flex-col items-end gap-y-4 justify-center')}>
      {reviewSubject && (
        <AlbumCard
          name={reviewSubject.name}
          artistName={formatArtists(reviewSubject.artists) as string}
          image={subjectImage}
          type={reviewSubjectType}
          onClick={() =>
            router.push(
              `/release/${'album' in reviewSubject ? reviewSubject.album.id : reviewSubject.id}`,
            )
          }
        />
      )}
      {validReviewTypes && (
        <Tabs
          keyboardActivation='manual'
          selectedKey={reviewSubject.type}
          onSelectionChange={(key) => {
            setReviewSubjectType(key as ReviewSubject);
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
                  <t.icon />
                  <span>{t.type}</span>
                </div>
              }
            ></Tab>
          ))}
        </Tabs>
      )}
    </div>
  );

  return (
    <div className='flex flex-col w-full p-6 gap-y-6'>
      {/* TEXTAREA / CONTENT */}
      <Textarea
        classNames={{
          base: '',
          label: 'text-lg',
          input: 'p-1',
          inputWrapper: 'flex w-full',
          innerWrapper: 'flex gap-x-4 p-2',
        }}
        variant='bordered'
        size='lg'
        minRows={5}
        maxRows={15}
        radius='md'
        labelPlacement='outside'
        label={<ReviewLabel />}
        description={<ReviewDescription />}
        endContent={useMemo(
          () => (
            <ReviewSubject />
          ),
          [ReviewSubject, reviewSubject],
        )} // TODO: fix re-rendering
        value={reviewText}
        onValueChange={setReviewText}
        placeholder='Enter your review here'
      />

      {/* PREVIEW / SUBMIT */}
      <div
        className={cn('w-full inline-flex items-center justify-end', 'gap-x-4')}
      >
        <Button
          variant='ghost'
          onClick={handleReviewPreview}
          disabled={!reviewText}
        >
          Preview
        </Button>
        <Button
          variant='primary'
          onClick={handleReviewSubmit}
          disabled={!reviewText}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ReviewCreate;
