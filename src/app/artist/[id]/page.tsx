'use client';

import { Artist, Track } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FaCheck, FaUser } from 'react-icons/fa6';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { cn } from '@/lib/utils';

import Box from '@/components/Box';
import Button from '@/components/Button';
import ExternalLinks from '@/components/ExternalLinks';
import Header from '@/components/Header';
import HeaderItem from '@/components/HeaderItem';
import PageContent from '@/components/PageContent';
import Pill from '@/components/Pill';

import getArtistData from '@/actions/getArtistData';
import {
  ReleaseFilters,
  ReleaseTypes,
  ScilentAlbum,
  ScilentExternalLink,
} from '@/constant/types';

// TODO: style header and metadata
// TODO: add MB fetch for credits, etc

const Artist = ({ params }: { params: { id: string } }) => {
  const [metadata, setMetadata] = useState<Artist>();
  const [releases, setReleases] = useState<ScilentAlbum[]>();
  const [topItems, setTopItems] = useState<Track[]>();
  const [links, setLinks] = useState<ScilentExternalLink[]>();
  const [selectedReleaseFilter, setSelectedReleaseFilter] =
    useState<ReleaseTypes>();
  // const [credits, setCredits] = useState();

  const [userFollows, setUserFollows] = useState<boolean>();

  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      (async () => {
        const artist = await sdk.artists.get(params.id);
        setMetadata(() => artist);
      })();
    }
  }, [session]);
  useEffect(() => {
    if (session) {
      (async () => {
        const { tracks } = await sdk.artists.topTracks(params.id, 'US');
        setTopItems(() => tracks);
      })();
    }
  }, [session]);

  useEffect(() => {
    if (session.status === 'authenticated') {
      (async () => {
        const follows = await sdk.currentUser.followsArtistsOrUsers(
          [params.id],
          'artist',
        );
        setUserFollows(() => follows[0]);
      })();
    }
  }, [session]);

  useEffect(() => {
    if (metadata) {
      (async () => {
        const results = await getArtistData(metadata.name);
        if (results) {
          setLinks(() => results.externalLinks);
          setReleases(() => results.releases);
        }
      })();
    }
  }, [metadata]);

  return (
    <Box className='h-full overflow-hidden overflow-y-auto'>
      <Header className='flex flex-col gap-y-6 w-full overflow-hidden'>
        {/* ARTIST METADATA */}
        <div className='flex w-full items-center justify-between'>
          <h4 className='text-neutral-500'>{metadata?.type}</h4>
          {/* on hover, slide out more supported music links, everything else in modal */}
          <ExternalLinks links={links}>
            {userFollows && <FaCheck />}
          </ExternalLinks>
        </div>
        <div className='flex gap-x-4 w-full items-start'>
          <div className='relative aspect-square w-28 rounded-md overflow-hidden bg-neutral-700'>
            {metadata?.images ? (
              <Image
                src={metadata.images[0].url || ''}
                alt='artist image'
                width={metadata.images[0].width}
                height={metadata.images[0].height}
                priority
                className='aspect-square object-cover'
              />
            ) : (
              <FaUser size={36} className='m-auto h-full text-dark' />
            )}
          </div>

          <div className='flex-1'>
            <h1 className='text-brand-primary truncate'>{metadata?.name}</h1>
            {/* other metadata/bio data here */}
          </div>
        </div>

        {/* ARTIST GENRES */}
        {metadata?.genres && (
          <div className='w-full flex gap-x-2 mt-4'>
            {metadata.genres.map((genre) => (
              <Pill key={genre} text={genre}></Pill>
            ))}
          </div>
        )}
      </Header>

      {/* ARTIST TOP ITEMS */}
      {topItems && (
        <div className='flex flex-col my-4 px-6 gap-y-4'>
          <h3 className='text-neutral-500'>Top Music</h3>
          <HeaderItem
            title='Top Track'
            name={topItems[0].name}
            // icon={TbUserHeart}
            image={topItems[0].album.images[0].url}
            href={`/release/${topItems[0].album.id}`}
            onClick={() => router.push(`/release/${topItems[0].album.id}`)}
            className='self-center px-48'
          />
        </div>
      )}

      {/* ARTIST RELEASES */}
      <div className='mt-2 mb-7 px-6'>
        <div className='w-full flex items-center gap-x-2'>
          <h3 className='text-neutral-500'>Releases</h3>
          {ReleaseFilters.map((option) => (
            <Button
              key={option.value}
              className={cn(
                'subtitle text-neutral-800 bg-transparent hover:text-brand-dark transition',
                selectedReleaseFilter == option.value
                  ? 'text-brand-primary'
                  : '',
              )}
              onClick={() =>
                setSelectedReleaseFilter(
                  selectedReleaseFilter == option.value
                    ? undefined
                    : option.value,
                )
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
        <PageContent albums={releases} />
      </div>

      {/* Credits */}
    </Box>
  );
};

export default Artist;
