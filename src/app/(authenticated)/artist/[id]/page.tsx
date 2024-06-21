'use client';

import { ScrollShadow, Tooltip } from '@nextui-org/react';
import { Album, Artist, SimplifiedAlbum, Track } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import numbro from 'numbro';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaPlus, FaUser } from 'react-icons/fa6';
import { TbMusicHeart, TbMusicStar } from 'react-icons/tb';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { getReleaseDate } from '@/lib/utils';
import { useAPIStatus } from '@/hooks/useAPIStatus';

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

// import getArtistData from '@/actions/getArtistData';
import { getArtistDiscography } from '@/actions/getArtistDiscography';
import { getUpcomingReleases } from '@/actions/getUpcomingReleases';
import {
  ReleaseFilters,
  ReleaseTypes,
  ScilentExternalLink,
} from '@/constant/types';

// TODO: style header and metadata
// TODO: add MB fetch for links, credits, upcoming, etc

const ArtistPage = ({ params }: { params: { id: string; name?: string } }) => {
  const artistId = useMemo(() => params.id, [params]);

  const { apiEnabled } = useAPIStatus();
  const [metadata, setMetadata] = useState<Artist>();
  const [relatedArtists, setRelatedArtists] = useState<Artist[]>();
  const [releases, setReleases] = useState<SimplifiedAlbum[] | Album[]>();
  const [fReleases, setFReleases] = useState<
    any[] | SimplifiedAlbum[] | Album[]
  >();
  const [topItems, setTopItems] = useState<Track[]>();
  const [links, setLinks] = useState<ScilentExternalLink[] | undefined>();
  const [selectedReleaseFilter, setSelectedReleaseFilter] = useState<
    ReleaseTypes | undefined
  >();
  // const [credits, setCredits] = useState();

  const [userFollows, setUserFollows] = useState<boolean>();

  const artistName = useMemo(
    () => params.name || metadata?.name,
    [params, metadata],
  );
  const session = useSession();
  const router = useRouter();

  // SPOTIFY ARTIST DATA
  useEffect(() => {
    if (session) {
      (async () => {
        const [artist, artistTopTracks, artistAlbums, relatedArtists] =
          await getArtistDiscography(artistId);
        setTopItems(() => artistTopTracks.tracks);
        setMetadata(() => artist);
        setReleases(() => artistAlbums.items);
        setRelatedArtists(() => relatedArtists.artists);
      })();
    }
  }, [session, artistId]);

  // SPOTIFY ARTIST/USER FOLLOW
  useEffect(() => {
    if (session.status === 'authenticated') {
      (async () => {
        const follows = await sdk.currentUser.followsArtistsOrUsers(
          [artistId],
          'artist',
        );
        setUserFollows(() => follows[0]);
      })();
    }
  }, [session, artistId]);

  // UPCOMING RELEASES
  useEffect(() => {
    if (apiEnabled && artistName) {
      (async () => {
        // const results = await getArtistData(metadata.name);
        // if (results) {
        //   setLinks(() => results.externalLinks);
        // }

        const fr = await getUpcomingReleases(artistName);
        if (fr) {
          // TODO: xform to Album[] || SimplifiedAlbum[]
          setFReleases(() => fr);
        }
      })();
    }
  }, [apiEnabled, artistName]);

  // ARTIST EXTERNAL LINKS
  useEffect(() => {
    if (metadata) {
      const link: ScilentExternalLink = {
        type: Object.keys(metadata.external_urls)[0],
        url: {
          resource: metadata.external_urls.spotify,
        },
      };
      setLinks(() => [link]);
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
    <Box className='h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        {/* ARTIST METADATA */}
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center text-dark/80 dark:text-light/80'>
            {/* ARTIST TYPE */}
            <h4>{metadata?.type}</h4>

            {/* ARTIST FOLLOW ICON */}
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

          {/* EXTERNAL LINKS */}
          <ExternalLinks links={links} />
        </div>

        <div className='flex gap-x-4 w-full items-start'>
          <HeaderImage
            imageUrl={metadata?.images[0].url}
            alt={`Artist image ${artistName || metadata?.name}`}
            fallbackIcon={FaUser}
          />

          <div className='flex-1'>
            <h1 className='text-brand-dark dark:text-brand-primary truncate'>
              {artistName}
            </h1>
            {metadata?.followers.total && (
              <p className='subtitle text-dark/70 dark:text-light'>
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
                <p className='subtitle text-dark/70 dark:text-light'>
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
              <span className='text-dark/50 dark:text-light/50 subtitle text-xs font-medium'>
                Genres
              </span>
              {metadata.genres.map((genre) => (
                <NextPill
                  text={genre}
                  variant='bordered'
                  size='sm'
                  radius='sm'
                  key={genre}
                  classNames={{ content: 'text-dark dark:text-light' }}
                />
              ))}
            </div>
          </ScrollShadow>
        )}
      </Header>

      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden px-6 no-scrollbar'>
          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-12 md:mb-8'>
            {/* ARTIST UPCOMING RELEASES */}
            {fReleases && fReleases.length > 0 ? (
              <div className='flex flex-col my-4 gap-y-4'>
                <h3 className='text-brand-dark'>Coming soon</h3>
                {fReleases.map((release, i) => (
                  <HeaderItem
                    key={`upcoming-releases-${i}`}
                    title={`${getReleaseDate(release.releaseDate)}`}
                    name={release.title}
                    image={release.artwork.url}
                    className='self-center justify-items-center cursor-default'
                    icon={TbMusicStar}
                    // onClick={() =>
                    //   router.push(`/release/${release.album.id}`)
                    // }
                  />
                ))}
              </div>
            ) : (
              releases && (
                <div className='flex flex-col my-4 gap-y-4'>
                  <h3 className='text-dark dark:text-light'>Latest Release</h3>
                  <HeaderItem
                    title={`${getReleaseDate(releases[0].release_date)}`}
                    name={releases[0].name}
                    image={releases[0].images[0].url}
                    className='self-center justify-items-center'
                    icon={TbMusicStar}
                    onClick={() => router.push(`/release/${releases[0].id}`)}
                  />
                </div>
              )
            )}

            {/* ARTIST TOP ITEMS */}
            {topItems && (
              <div className='flex flex-col my-4 gap-y-4'>
                <h3 className='text-dark/80 dark:text-light/80'>Top Music</h3>
                <HeaderItem
                  title='Top Track'
                  name={topItems[0].name}
                  icon={TbMusicHeart}
                  image={topItems[0].album.images[0].url}
                  onClick={() =>
                    router.push(`/release/${topItems[0].album.id}`)
                  }
                  className='self-center'
                />
              </div>
            )}
          </div>

          {/* ARTIST RELEASES */}
          <div className='mb-8'>
            <div className='w-full flex items-center gap-x-2'>
              <h3 className='text-dark/80 dark:text-light/80'>Releases</h3>
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
          <div className='mb-8'>
            <div className='w-full flex items-center gap-x-2'>
              <h3 className='text-dark/80 dark:text-light/80'>
                Related Artists
              </h3>
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
