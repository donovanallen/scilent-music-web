'use client';

import { Artist, SimplifiedAlbum, Track } from '@spotify/web-api-ts-sdk';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import numbro from 'numbro';
import React, { useEffect, useState } from 'react';
import { FaCheck, FaUser } from 'react-icons/fa6';
import { TbMusicHeart } from 'react-icons/tb';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { cn } from '@/lib/utils';

import Box from '@/components/Box';
import Button from '@/components/Button';
import ExternalLinks from '@/components/ExternalLinks';
import Header from '@/components/Header';
import HeaderImage from '@/components/HeaderImage';
import HeaderItem from '@/components/HeaderItem';
import PageContent from '@/components/PageContent';
import Pill from '@/components/Pill';

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
  const [releases, setReleases] = useState<
    ScilentAlbum[] | SimplifiedAlbum[]
  >();
  const [topItems, setTopItems] = useState<Track[]>();
  const [links, setLinks] = useState<ScilentExternalLink[] | undefined>();
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
  }, [session, params.id]);

  useEffect(() => {
    if (session) {
      (async () => {
        const { tracks } = await sdk.artists.topTracks(params.id, 'US');
        setTopItems(() => tracks);
      })();
    }
  }, [session, params.id]);

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
  }, [session, params.id]);

  useEffect(() => {
    if (metadata) {
      const link: ScilentExternalLink = {
        type: Object.keys(metadata.external_urls)[0],
        url: {
          resource: metadata.external_urls.spotify,
        },
      };
      setLinks(() => [link]);

      (async () => {
        const results = await sdk.artists.albums(metadata.id);
        if (results) {
          setReleases(() => results.items);
        }

        // const apiEnabled = await getAPIStatus();
        // if (apiEnabled) {
        //   const results = await getArtistData(metadata.name);
        //   if (results) {
        //     setLinks(() => results.externalLinks);
        //     setReleases(() => results.releases);
        //   }
        // }
      })();
    }
  }, [metadata]);

  return (
    <Box className='h-full overflow-hidden overflow-y-auto'>
      <Header className='flex flex-col gap-y-6 w-full overflow-hidden'>
        {/* ARTIST METADATA */}
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-x-2 text-neutral-500'>
            <h4>{metadata?.type}</h4>
            {userFollows && <FaCheck />}
          </div>
          <ExternalLinks links={links} />
        </div>

        <div className='flex gap-x-4 w-full items-start'>
          <HeaderImage
            imageUrl={metadata?.images[0].url}
            alt={`Artist image ${metadata?.name}`}
            fallbackIcon={FaUser}
          />

          <div className='flex-1'>
            <h1 className='text-brand-primary truncate'>{metadata?.name}</h1>
            {metadata?.followers.total && (
              <p className='subtitle text-neutral-500'>
                {numbro(metadata?.followers.total).format({
                  spaceSeparated: false,
                  average: true,
                  optionalMantissa: true,
                })}{' '}
                followers
              </p>
            )}
            {metadata?.popularity && metadata.popularity > 0 && (
              <p className='subtitle text-neutral-500'>
                Popularity Score: {metadata?.popularity}
              </p>
            )}
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
            icon={TbMusicHeart}
            image={topItems[0].album.images[0].url}
            onClick={() => router.push(`/release/${topItems[0].album.id}`)}
            className='self-center'
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
