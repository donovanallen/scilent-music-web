'use client';

import { ScrollShadow, Tooltip } from '@nextui-org/react';
import { Album, Artist, SimplifiedAlbum, Track } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import numbro from 'numbro';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaPlus, FaUser } from 'react-icons/fa6';
import { TbMusicHeart } from 'react-icons/tb';

import sdk from '@/lib/spotify-sdk/ClientInstance';

// import { getUpcomingReleases } from '@/lib/utils';
import Box from '@/components/Box';
import IconButton from '@/components/buttons/IconButton';
import ExternalLinks from '@/components/ExternalLinks';
import FilterOptions from '@/components/FilterOptions';
import Header from '@/components/Header';
import HeaderImage from '@/components/HeaderImage';
import HeaderItem from '@/components/HeaderItem';
import InfoIcon from '@/components/InfoIcon';
import PageContent from '@/components/PageContent';
import NextPill from '@/components/Pill';

import { getArtistDiscography } from '@/actions/getArtistDiscography';
import {
  ReleaseFilters,
  ReleaseTypes,
  ScilentExternalLink,
} from '@/constant/types';

// TODO: style header and metadata
// TODO: add MB fetch for credits, etc

const ArtistPage = ({ params }: { params: { id: string } }) => {
  const [metadata, setMetadata] = useState<Artist>();
  const [relatedArtists, setRelatedArtists] = useState<Artist[]>();
  const [releases, setReleases] = useState<SimplifiedAlbum[] | Album[]>();
  const [topItems, setTopItems] = useState<Track[]>();
  const [links, setLinks] = useState<ScilentExternalLink[] | undefined>();
  const [selectedReleaseFilter, setSelectedReleaseFilter] = useState<
    ReleaseTypes | undefined
  >();
  // const [credits, setCredits] = useState();

  const [userFollows, setUserFollows] = useState<boolean>();

  const session = useSession();
  const router = useRouter();

  // SPOTIFY ARTIST DATA
  useEffect(() => {
    if (session) {
      (async () => {
        const [artist, artistTopTracks, artistAlbums, relatedArtists] =
          await getArtistDiscography(params.id);
        setTopItems(() => artistTopTracks.tracks);
        setMetadata(() => artist);
        setReleases(() => artistAlbums.items);
        setRelatedArtists(() => relatedArtists.artists);
      })();
    }
  }, [session, params.id]);

  // SPOTIFY ARTIST/USER FOLLOW
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

  // UPCOMING RELEASES
  // useEffect(() => {
  //   if (releases) {
  //     (async () => {
  //       const upcoming = await getUpcomingReleases(releases as Album[]);
  //       console.log('Upcoming Releases', upcoming);
  //     })();
  //   }
  // }, [releases]);

  // SCILENT ARTIST DATA
  useEffect(() => {
    if (metadata) {
      const link: ScilentExternalLink = {
        type: Object.keys(metadata.external_urls)[0],
        url: {
          resource: metadata.external_urls.spotify,
        },
      };
      setLinks(() => [link]);

      // (async () => {
      //   const results = await sdk.artists.albums(metadata.id);
      //   if (results) {
      //     setReleases(() => results.items);
      //   }

      // })();
      // const apiEnabled = await getAPIStatus();
      // if (apiEnabled) {
      //   const results = await getArtistData(metadata.name);
      //   if (results) {
      //     setLinks(() => results.externalLinks);
      //     setReleases(() => results.releases);
      //   }
      // }
    }
  }, [metadata]);

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

  return (
    <Box className='bg-dark rounded-md h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        {/* ARTIST METADATA */}
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center text-neutral-500'>
            <h4>{metadata?.type}</h4>

            <Tooltip
              shadow='md'
              size='sm'
              content={userFollows ? 'Artist followed' : 'Follow artist'}
              classNames={{
                content: 'text-dark bg-light',
                base: 'max-w-xs',
              }}
              delay={1000}
              showArrow
            >
              <IconButton
                onClick={() => followArtist(params.id)}
                icon={userFollows ? FaCheck : FaPlus}
                variant='ghost'
                disabled={userFollows}
                classNames={{ icon: userFollows ? 'text-brand-dark' : '' }}
              />
            </Tooltip>
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
              <div className='inline-flex items-center'>
                <p className='subtitle text-neutral-500'>
                  Popularity Score: {metadata?.popularity}
                </p>
                <InfoIcon
                  tooltipEnabled
                  tooltip={{
                    content:
                      "The popularity of the artist. The value will be between 0 and 100, with 100 being the most popular. The artist's popularity is calculated from the popularity of all the artist's tracks.",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ARTIST GENRES */}
        {metadata?.genres && metadata?.genres.length > 0 && (
          <ScrollShadow
            hideScrollBar
            orientation='horizontal'
            className='w-full'
          >
            <div className='w-fit flex gap-x-2 mt-2 pr-4 items-center'>
              <span className='subtitle text-xs font-medium'>Genres</span>
              {metadata.genres.map((genre) => (
                <NextPill
                  text={genre}
                  variant='bordered'
                  size='sm'
                  radius='sm'
                  key={genre}
                />
              ))}
            </div>
          </ScrollShadow>
        )}
      </Header>

      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden px-6 no-scrollbar'>
          {/* ARTIST TOP ITEMS */}
          {topItems && (
            <div className='flex flex-col my-4 gap-y-4'>
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
          <div className='mt-2 mb-7'>
            <div className='w-full flex items-center gap-x-2'>
              <h3 className='text-neutral-500'>Releases</h3>
              <FilterOptions
                filterOptions={ReleaseFilters}
                onFilterSelect={setSelectedReleaseFilter as () => void}
                selectedFilter={selectedReleaseFilter}
                tooltipsEnabled
                isNullable
              />
            </div>
            <PageContent
              albums={
                selectedReleaseFilter
                  ? (releases?.filter(
                      (r) => r.album_type === selectedReleaseFilter,
                    ) as SimplifiedAlbum[])
                  : releases
              }
            />
          </div>

          {/* RELATED ARTISTS */}
          <div className='mt-2 mb-7'>
            <div className='w-full flex items-center gap-x-2'>
              <h3 className='text-neutral-500'>Related Artists</h3>
            </div>
            <PageContent artists={relatedArtists} />
          </div>

          {/* Credits */}
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default ArtistPage;
