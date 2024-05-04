'use client';

import { Album, SimplifiedTrack } from '@spotify/web-api-ts-sdk';
import {
  formatDuration,
  millisecondsToHours,
  millisecondsToMinutes,
  millisecondsToSeconds,
} from 'date-fns';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BiAlbum } from 'react-icons/bi';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { cn, formatArtists, getReleaseDate } from '@/lib/utils';

import Box from '@/components/Box';
import Header from '@/components/Header';
import PageContent from '@/components/PageContent';
import Pill from '@/components/Pill';

const getAlbumDuration = (album: Album): string => {
  let totalDuration = 0;
  album.tracks?.items.forEach((track) => {
    totalDuration += track.duration_ms || 0;
  });
  const fDuration = formatDuration(
    {
      hours: millisecondsToHours(totalDuration),
      minutes: millisecondsToMinutes(totalDuration),
      seconds: millisecondsToSeconds(totalDuration),
    },
    { format: ['hours', 'minutes'] },
  );
  return fDuration;
};

const Release = ({ params }: { params: { id: string } }) => {
  const [albumDetails, setAlbumDetails] = useState<Album>();

  // * SPOTIFY ALBUM DATA
  useEffect(() => {
    (async () => {
      const result = await sdk.albums.get(params.id);
      setAlbumDetails(() => result);
    })();
  }, []);

  const image = albumDetails?.images[0].url;

  return (
    <Box className='flex flex-col min-h-full'>
      <Header
        className={cn(
          'flex flex-col gap-y-6 w-full overflow-hidden',
          'bg-cover bg-center bg-no-repeat',
          'bg-[image:var(--image-url)]',
        )}
        style={{ '--image-url': `url(${image})` }}
      >
        <div
          className={cn(
            'bg-dark/25',
            'rounded-2xl',
            'bg-clip-padding backdrop-filter backdrop-blur-3xl',
            'shadow-2xl',
            'ring-2 ring-black/5',
            'p-4',
          )}
        >
          {/* RELEASE TYPE */}
          <div className='flex w-full items-center justify-between'>
            <h4 className='text-brand-light'>{albumDetails?.album_type}</h4>
            {/* link to source if available */}
          </div>

          {/* RELEASE METADATA */}
          <div className='flex w-full overflow-hidden items-start mt-4 justify-between'>
            {/* RELEASE DATA */}
            <div className='flex flex-col gap-y-6'>
              <div>
                <h1 className='text-brand-primary truncate font-medium'>
                  {albumDetails?.name}
                </h1>
                {albumDetails?.artists && (
                  <h3>{formatArtists(albumDetails?.artists)}</h3>
                )}
              </div>
            </div>
            {/* RELEASE IMAGE */}
            <div className='relative aspect-square h-full min-w-28 rounded-md overflow-hidden bg-neutral-700 m-1 ring-1 ring-black/5'>
              {albumDetails?.images ? (
                <Image
                  src={albumDetails?.images[0].url || ''}
                  alt='release image'
                  fill
                  className='aspect-square object-cover'
                />
              ) : (
                <BiAlbum size={36} className='m-auto h-full text-dark' />
              )}
            </div>
          </div>

          {/* RELEASE DATA */}
          <div className='w-full flex items-center justify-between mt-4'>
            {albumDetails?.release_date && (
              <h4 className='subtitle text-light'>
                {`Released: ${getReleaseDate(albumDetails?.release_date)}`}
              </h4>
            )}
            {albumDetails?.tracks && albumDetails.tracks.total > 1 && (
              <h4 className='subtitle text-light'>
                {`${albumDetails.tracks.total} tracks - ${getAlbumDuration(albumDetails)}`}
              </h4>
            )}
          </div>
          <div className='w-full flex items-center justify-between mt-4'>
            {albumDetails?.label && (
              <h4 className='subtitle text-light'>{`Label: ${albumDetails?.label}`}</h4>
            )}
          </div>

          {/* ARTIST GENRES */}
          {albumDetails?.genres && albumDetails?.genres.length > 0 && (
            <div className='w-full flex gap-x-2 mt-4'>
              {albumDetails?.genres.map((genre) => (
                <Pill key={genre} text={genre}></Pill>
              ))}
            </div>
          )}
        </div>
      </Header>
      <Box className='px-6'>
        {albumDetails?.tracks && (
          <>
            <h3 className='text-neutral-400 my-6'>Tracklist </h3>
            <PageContent
              tracks={albumDetails.tracks.items as SimplifiedTrack[]}
            />
          </>
        )}
        <div className='flex w-full m-6'>
          {albumDetails?.copyrights && (
            <h4 className='subtitle text-xs font-normal text-neutral-500'>
              Copyright: {albumDetails?.copyrights[0].text}
            </h4>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default Release;
