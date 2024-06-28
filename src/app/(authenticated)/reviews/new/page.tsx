'use client';

import {
  Album,
  SimplifiedAlbum,
  SimplifiedTrack,
  Track,
} from '@spotify/web-api-ts-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
import Header from '@/components/Header';
import ReviewCreate from '@/components/review/ReviewCreate';

import ReviewSubjectSearch from '@/app/(authenticated)/reviews/components/ReviewSubjectSearch';
import SuggestedReviewSubjects from '@/app/(authenticated)/reviews/components/SuggestedReviewSubjects';

const NewReview = () => {
  const params = useSearchParams();
  const [searchParams, setSearchParams] = useState(params);
  const router = useRouter();

  useEffect(() => {
    setSearchParams(params);
  }, [params]);

  const content = searchParams.get('content');
  const subjectId = searchParams.get('subjectId');
  const subjectType = searchParams.get('subjectType');
  const reaction = searchParams.get('reaction');

  console.log('NEW REVIEW PARAMS ::', {
    subjectId,
    subjectType,
    content,
    reaction,
  });

  const [reviewContent, setReviewContent] = useState<string>();
  const [reviewSubject, setReviewSubject] = useState<
    Album | Track | SimplifiedAlbum | SimplifiedTrack | null
  >();

  const getSubject = async (id: string, type: string) => {
    return type === 'track'
      ? await sdk.tracks.get(id)
      : await sdk.albums.get(id);
  };

  useEffect(() => {
    const fetchSubject = async () => {
      if (subjectId && subjectType) {
        const subject = await getSubject(subjectId, subjectType);
        setReviewSubject(subject);
      }

      if (content) {
        setReviewContent(decodeURIComponent(content));
      } else {
        setReviewContent('');
      }
    };

    fetchSubject();
  }, [subjectId, subjectType, content]);

  const handleSubjectSelect = (
    subject: Track | Album | SimplifiedTrack | SimplifiedAlbum,
  ) => {
    // setSearchParams(
    //   () => new URLSearchParams({
    //     subjectId: subject.id,
    //     subjectType: subject.type,
    //   })
    // );

    // setParams(
    //   new URLSearchParams({
    //     subjectId: subject.id,
    //     subjectType: subject.type,
    //   }),
    // );
    router.replace(
      `/reviews/new?subjectId=${subject.id}&subjectType=${subject.type}`,
    );
  };

  return (
    <Box className='h-full flex flex-col'>
      <Header>
        <div className='w-full inline-flex items-center justify-between'>
          <h3>Create Review</h3>
          {reviewSubject && (
            <Button variant='primary' onClick={() => setReviewSubject(null)}>
              New
            </Button>
          )}
        </div>

        {/* SEARCH */}
        {!reviewSubject && (
          <ReviewSubjectSearch
            onSubjectSelect={(s) => handleSubjectSelect(s)}
          />
        )}

        {/* SUGGESTED REVIEW SUBJECTS */}
        <SuggestedReviewSubjects
          initExpanded={!reviewSubject}
          onSubjectSelect={handleSubjectSelect}
        />
      </Header>

      <div className='flex w-2/3 overflow-y-auto overflow-x-hidden self-center py-6'>
        {reviewSubject && (
          <ReviewCreate
            subject={reviewSubject}
            type={'album' in reviewSubject ? 'track' : 'album'}
            content={reviewContent}
          />
        )}
      </div>
    </Box>
  );
};

export default NewReview;
