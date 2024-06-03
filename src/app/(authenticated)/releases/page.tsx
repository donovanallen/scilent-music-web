'use client';

import { ScrollShadow } from '@nextui-org/react';
import { Album, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';

import Box from '@/components/Box';
import Header from '@/components/Header';
import InfoIcon from '@/components/InfoIcon';
import PageContent from '@/components/PageContent';

const Releases: React.FC = () => {
  const session = useSession();
  // const [followedArtists, setFollowedArtists] = useState<FollowedArtists>();
  const [featuredReleases, setFeaturedReleases] = useState<
    SimplifiedAlbum[] | Album[]
  >();

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     (async () => {
  //       const { artists } = await sdk.currentUser.followedArtists();
  //       console.log('followed artists', artists);

  //       const artistReleases = await Promise.all(
  //         artists.items.map(
  //           async (artist) =>
  //             await sdk.artists.albums(artist.id, undefined, 'US', 3),
  //         ),
  //       );
  //       setReleases(() => artistReleases.flatMap((r) => r.items));
  //     })();
  //   }
  // }, [status]);

  useEffect(() => {
    if (session) {
      (async () => {
        const result = await sdk.browse.getNewReleases();
        setFeaturedReleases(() => result.albums.items);
      })();
    }
  }, [session]);

  return (
    <Box className='bg-dark rounded-md h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='inline-flex items-center gap-x-2'>
          <h1 className='text-brand-light w-fit text-lg sm:text-xl md:text-2xl'>
            Release Hub
          </h1>

          <InfoIcon
            tooltipEnabled
            tooltip={{
              content:
                'The Release Hub is home to all the recent and upcoming releases from your favorite artists.',
            }}
          />
        </div>
      </Header>
      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden p-6'>
          {/* FEATURED RELEASES */}
          <div className='inline-flex items-center gap-x-2'>
            <h3 className='w-fit text-lg sm:text-xl md:text-2xl'>
              Featured Releases
            </h3>
            <InfoIcon
              tooltipEnabled
              tooltip={{
                content: "These are Spotify's featured new releases",
              }}
            />
          </div>
          <PageContent
            albums={featuredReleases}
            // pageData={followedArtists.artists}
            // history={recents}
          />
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Releases;
