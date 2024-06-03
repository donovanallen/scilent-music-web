'use client';

import { ScrollShadow, Tooltip } from '@nextui-org/react';
import { Album, SimplifiedTrack } from '@spotify/web-api-ts-sdk';
import {
  formatDuration,
  millisecondsToHours,
  millisecondsToMinutes,
  millisecondsToSeconds,
} from 'date-fns';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiAlbum } from 'react-icons/bi';
import { FaCheck, FaPlus } from 'react-icons/fa6';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { cn, formatArtists, getReleaseDate, getSourceIcon } from '@/lib/utils';

import ArtistLink from '@/components/ArtistLink';
import Box from '@/components/Box';
import IconButton from '@/components/buttons/IconButton';
import Header from '@/components/Header';
import IconLink from '@/components/links/IconLink';
import NextImage from '@/components/NextImage';
import PageContent from '@/components/PageContent';
import NextPill from '@/components/Pill';

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
  const [userFollows, setUserFollows] = useState<boolean>();

  const followArtist = async (id: string) => {
    return await sdk.currentUser
      .followArtistsOrUsers([id], 'artist')
      .catch((e) => {
        toast.error('Error following artist: ', e);
      })
      .then(() => {
        setUserFollows(true);
      })
      .finally(() => {
        toast.success('Artist followed');
      });
  };

  useEffect(() => {
    (async () => {
      if (albumDetails) {
        const artistId = albumDetails.artists[0].id;
        const follows = await sdk.currentUser.followsArtistsOrUsers(
          [artistId],
          'artist',
        );
        setUserFollows(() => follows[0]);
      }
    })();
  }, [albumDetails]);

  // * SPOTIFY ALBUM DATA
  useEffect(() => {
    (async () => {
      const result = await sdk.albums.get(params.id);
      setAlbumDetails(() => result);
    })();
  }, [params.id]);

  const image = albumDetails?.images[0].url;

  return (
    <Box className='bg-dark rounded-md h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header
        className={cn(
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
          <div className='flex w-full items-center justify-between mb-4'>
            <h4 className='text-brand-light'>{albumDetails?.album_type}</h4>
            <IconLink
              href={albumDetails?.external_urls.spotify || ''}
              target='_blank'
              rel='noopener noreferrer'
              icon={getSourceIcon('spotify')}
              variant='ghost'
            />
          </div>
          <div className='flex w-full justify-between'>
            {/* text */}
            <div className='flex flex-col'>
              <div className='flex flex-col w-fit'>
                <h1 className='text-brand-primary font-medium line-clamp-1 text-lg sm:text-xl md:text-2xl lg:text-4xl'>
                  {albumDetails?.name}
                </h1>
                {albumDetails?.artists && (
                  <div className='flex items-center text-neutral-500'>
                    {albumDetails &&
                      albumDetails?.artists &&
                      albumDetails?.artists.map((artist, i, arr) => (
                        <>
                          <ArtistLink key={artist.id} artist={artist}>
                            <h3 className='text-neutral-300 line-clamp-2 text-sm sm:text-base md:text-lg font-medium hover:text-dark active:text-brand-light transition'>
                              {formatArtists(artist)}
                            </h3>
                          </ArtistLink>
                          <span className='text-neutral-300 line-clamp-2 text-sm sm:text-base md:text-lg font-medium'>
                            {`${i < arr.length - 1 ? ', ' : ' '}`}
                          </span>
                        </>
                      ))}

                    <Tooltip
                      shadow='md'
                      size='sm'
                      content={
                        userFollows
                          ? 'Following'
                          : `Follow ${formatArtists(albumDetails?.artists[0])}`
                      }
                      classNames={{
                        content: 'text-dark bg-light',
                        base: 'max-w-xs',
                      }}
                      delay={1200}
                      showArrow
                    >
                      <IconButton
                        onClick={() => followArtist(params.id)}
                        icon={userFollows ? FaCheck : FaPlus}
                        variant='ghost'
                        className='bg-transparent hover:bg-transparent'
                        classNames={{
                          icon: userFollows ? 'text-brand-dark' : '',
                        }}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>
              <div className='w-fit'>
                {/* RELEASE DATA */}
                {albumDetails?.tracks && albumDetails.tracks.total > 1 && (
                  <h4 className='subtitle text-light my-4 font-normal'>
                    {`${albumDetails.tracks.total} tracks - ${getAlbumDuration(albumDetails)}`}
                  </h4>
                )}
                {albumDetails?.release_date && (
                  <h4 className='w-full subtitle text-neutral-500 font-normal line-clamp-1 mt-1'>
                    {`Released: ${getReleaseDate(albumDetails?.release_date)}`}
                  </h4>
                )}
                {albumDetails?.label && (
                  <h4 className='w-full subtitle text-neutral-500 font-normal line-clamp-1 mt-1'>{`Label: ${albumDetails?.label}`}</h4>
                )}
              </div>
            </div>
            {/* image */}
            <div className='border self-end relative aspect-square h-full min-w-20 sm:min-w-28 lg:min-w-40 xl:min-w-48 rounded-md overflow-hidden bg-neutral-700 m-1 ring-1 ring-black/5'>
              {image ? (
                <NextImage
                  src={image || ''}
                  alt='release image'
                  fill
                  priority
                  useSkeleton
                  className='aspect-square object-cover'
                />
              ) : (
                <BiAlbum size={36} className='m-auto h-full text-dark' />
              )}
            </div>
          </div>

          {/* ARTIST GENRES */}
          {albumDetails?.genres && albumDetails?.genres.length > 0 && (
            <div className='w-full flex gap-x-2 mt-4'>
              {albumDetails?.genres.map((genre) => (
                <NextPill text={genre} variant='solid' size='sm' key={genre} />
              ))}
            </div>
          )}
        </div>
      </Header>
      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden no-scrollbar px-6'>
          {albumDetails?.tracks && (
            <>
              <h3 className='text-neutral-400 my-4'>Tracklist </h3>
              <PageContent
                tracks={albumDetails.tracks.items as SimplifiedTrack[]}
                tracksNumbered
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
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Release;
